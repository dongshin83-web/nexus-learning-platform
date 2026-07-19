import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { authenticate } from "./auth.mjs";
import { HttpError } from "./errors.mjs";

const contentTypes = {
    ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml", ".woff2": "font/woff2"
};
const blockedStaticRoots = new Set([".git", ".vercel", "server", "database", "docs", "tests", "tools", "sync", "data", "var", "dist", "node_modules"]);
const publicExtensions = new Set(Object.keys(contentTypes));

function send(response, status, body, headers = {}) {
    const payload = typeof body === "string" || Buffer.isBuffer(body) ? body : JSON.stringify(body);
    response.writeHead(status, {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "SAMEORIGIN",
        "Referrer-Policy": "same-origin",
        ...headers
    });
    response.end(payload);
}

async function readJson(request, maxBytes) {
    let size = 0;
    const chunks = [];
    for await (const chunk of request) {
        size += chunk.length;
        if (size > maxBytes) throw new HttpError(413, "요청 데이터가 허용 크기를 초과했습니다.");
        chunks.push(chunk);
    }
    if (!chunks.length) return {};
    try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); }
    catch { throw new HttpError(400, "올바른 JSON 요청이 아닙니다."); }
}

function routeMatch(pathname, pattern) {
    const names = [];
    const regex = new RegExp(`^${pattern.replace(/:([A-Za-z]+)/g, (_, name) => { names.push(name); return "([^/]+)"; })}$`);
    const match = pathname.match(regex);
    return match ? Object.fromEntries(names.map((name, index) => [name, decodeURIComponent(match[index + 1])])) : null;
}

function isSameOrigin(origin, host) {
    try { return new URL(origin).host === host; }
    catch { return false; }
}

export function createApp({ config, service }) {
    return http.createServer(async (request, response) => {
        try {
            const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
            const pathname = url.pathname;

            if (pathname === "/healthz") return send(response, 200, { status: "ok", storage: "sqlite", time: new Date().toISOString() }, { "Content-Type": "application/json; charset=utf-8" });
            if (pathname === "/team_technical_assets_runtime_config.js") {
                return send(response, 200, `window.TECHNICAL_ASSET_RUNTIME = ${JSON.stringify({ mode: "api", apiBaseUrl: config.apiPrefix, credentials: "same-origin" })};\n`, { "Content-Type": contentTypes[".js"] });
            }
            if (pathname === "/team_technical_assets_data.js") {
                const user = authenticate(request, config);
                const cards = service.list(new URLSearchParams(), user);
                return send(response, 200, `window.TECHNICAL_ASSET_LIBRARY = ${JSON.stringify({ cards })};\n`, { "Content-Type": contentTypes[".js"] });
            }

            if (pathname.startsWith(config.apiPrefix)) {
                if (!["GET", "HEAD", "OPTIONS"].includes(request.method)) {
                    const origin = String(request.headers.origin ?? "");
                    if (origin && !isSameOrigin(origin, request.headers.host)) throw new HttpError(403, "다른 출처에서 보낸 변경 요청은 허용되지 않습니다.");
                }
                const user = authenticate(request, config);
                const apiPath = pathname.slice(config.apiPrefix.length) || "/";
                let match;
                if (request.method === "GET" && apiPath === "/session") return send(response, 200, { user }, { "Content-Type": contentTypes[".json"] });
                if (request.method === "GET" && apiPath === "/assets") return send(response, 200, service.list(url.searchParams, user), { "Content-Type": contentTypes[".json"] });
                if (request.method === "GET" && apiPath === "/review-queue") return send(response, 200, service.reviewQueue(user), { "Content-Type": contentTypes[".json"] });
                if (request.method === "GET" && apiPath === "/culture-records") return send(response, 200, service.listCultureRecords(user), { "Content-Type": contentTypes[".json"] });
                if (request.method === "POST" && apiPath === "/culture-records") {
                    const result = service.createCultureRecord(await readJson(request, config.maxBodyBytes), user);
                    return send(response, 201, result, { "Content-Type": contentTypes[".json"] });
                }
                if (request.method === "POST" && apiPath === "/asset-registration-requests") {
                    const result = service.register(await readJson(request, config.maxBodyBytes), user);
                    return send(response, 201, result, { "Content-Type": contentTypes[".json"] });
                }
                if (request.method === "POST" && apiPath === "/assets") {
                    const result = service.createDraft(await readJson(request, config.maxBodyBytes), user);
                    return send(response, 201, result, { "Content-Type": contentTypes[".json"] });
                }
                if ((match = routeMatch(apiPath, "/assets/:id/recommendations")) && request.method === "GET") return send(response, 200, service.recommendations(match.id, url.searchParams, user), { "Content-Type": contentTypes[".json"] });
                if ((match = routeMatch(apiPath, "/assets/:id/submit")) && request.method === "POST") return send(response, 200, service.submit(match.id, user), { "Content-Type": contentTypes[".json"] });
                if ((match = routeMatch(apiPath, "/assets/:id/request-changes")) && request.method === "POST") {
                    const body = await readJson(request, config.maxBodyBytes);
                    return send(response, 200, service.requestChanges(match.id, body.comment, user), { "Content-Type": contentTypes[".json"] });
                }
                if ((match = routeMatch(apiPath, "/assets/:id/publish")) && request.method === "POST") return send(response, 200, service.publish(match.id, user), { "Content-Type": contentTypes[".json"] });
                if ((match = routeMatch(apiPath, "/assets/:id")) && request.method === "GET") {
                    return send(response, 200, service.get(match.id, user), { "Content-Type": contentTypes[".json"] });
                }
                if ((match = routeMatch(apiPath, "/assets/:id")) && request.method === "PATCH") {
                    const expectedVersion = Number(request.headers["if-match"] || 0) || undefined;
                    return send(response, 200, service.update(match.id, await readJson(request, config.maxBodyBytes), user, expectedVersion), { "Content-Type": contentTypes[".json"] });
                }
                if ((match = routeMatch(apiPath, "/culture-records/:id")) && request.method === "PATCH") {
                    return send(response, 200, service.updateCultureRecord(match.id, await readJson(request, config.maxBodyBytes), user), { "Content-Type": contentTypes[".json"] });
                }
                throw new HttpError(404, "API 경로를 찾을 수 없습니다.");
            }

            const relative = pathname === "/" ? "team_technical_assets.html" : pathname.replace(/^\/+/, "");
            const firstSegment = relative.split(/[\\/]/)[0];
            if (blockedStaticRoots.has(firstSegment) || firstSegment.startsWith(".")) throw new HttpError(403, "공개되지 않은 서버 경로입니다.");
            const filePath = path.resolve(config.staticRoot, relative);
            if (!filePath.startsWith(`${config.staticRoot}${path.sep}`) && filePath !== config.staticRoot) throw new HttpError(403, "허용되지 않은 경로입니다.");
            if (!publicExtensions.has(path.extname(filePath).toLowerCase())) throw new HttpError(403, "공개되지 않은 파일 형식입니다.");
            if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) throw new HttpError(404, "페이지를 찾을 수 없습니다.");
            return send(response, 200, fs.readFileSync(filePath), { "Content-Type": contentTypes[path.extname(filePath).toLowerCase()] || "application/octet-stream", "Cache-Control": "public, max-age=60" });
        } catch (error) {
            const status = error instanceof HttpError ? error.status : 500;
            if (status === 500) console.error(error);
            return send(response, status, { message: error.message || "서버 오류가 발생했습니다.", errors: error.details || [] }, { "Content-Type": contentTypes[".json"] });
        }
    });
}
