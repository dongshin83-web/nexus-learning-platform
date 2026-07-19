import path from "node:path";
import { fileURLToPath } from "node:url";

const serverDir = path.dirname(fileURLToPath(import.meta.url));
export const projectRoot = path.resolve(serverDir, "..");

function booleanEnv(name, fallback = false) {
    const value = process.env[name];
    if (value === undefined) return fallback;
    return /^(1|true|yes)$/i.test(value);
}

export function loadConfig(overrides = {}) {
    const host = overrides.host ?? process.env.TECH_ASSET_HOST ?? "127.0.0.1";
    const authMode = overrides.authMode ?? process.env.TECH_ASSET_AUTH_MODE ?? "development";
    const allowRemote = overrides.allowRemote ?? booleanEnv("TECH_ASSET_ALLOW_REMOTE", false);
    if (host !== "127.0.0.1" && host !== "localhost" && !allowRemote) {
        throw new Error("외부 접속 주소로 실행하려면 TECH_ASSET_ALLOW_REMOTE=true가 필요합니다.");
    }
    if (authMode === "development" && host !== "127.0.0.1" && host !== "localhost") {
        throw new Error("development 인증은 로컬 주소에서만 사용할 수 있습니다.");
    }

    return {
        host,
        port: Number(overrides.port ?? process.env.TECH_ASSET_PORT ?? 8787),
        authMode,
        trustProxy: overrides.trustProxy ?? booleanEnv("TECH_ASSET_TRUST_PROXY", false),
        trustedProxyIps: overrides.trustedProxyIps ?? String(process.env.TECH_ASSET_TRUSTED_PROXY_IPS ?? "127.0.0.1,::1,::ffff:127.0.0.1").split(",").map((value) => value.trim()).filter(Boolean),
        databasePath: path.resolve(overrides.databasePath ?? process.env.TECH_ASSET_DB_PATH ?? path.join(projectRoot, "var", "technical-assets.sqlite")),
        staticRoot: path.resolve(overrides.staticRoot ?? projectRoot),
        apiPrefix: "/api/v1",
        maxBodyBytes: Number(overrides.maxBodyBytes ?? process.env.TECH_ASSET_MAX_BODY_BYTES ?? 2_000_000)
    };
}
