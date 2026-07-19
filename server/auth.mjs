import { HttpError } from "./errors.mjs";

const validRoles = new Set(["registrant", "reviewer", "admin"]);

function parseRoles(value) {
    return String(value ?? "")
        .split(",")
        .map((role) => role.trim().toLowerCase())
        .filter((role) => validRoles.has(role));
}

export function authenticate(request, config) {
    if (config.authMode === "development") {
        const id = String(request.headers["x-dev-user"] ?? "local.registrant").trim();
        const roles = parseRoles(request.headers["x-dev-roles"] ?? "registrant,reviewer");
        return { id, displayName: id, roles: roles.length ? roles : ["registrant"] };
    }

    if (config.authMode === "trusted-header") {
        if (!config.trustProxy) throw new HttpError(500, "trusted-header 인증에는 TECH_ASSET_TRUST_PROXY=true가 필요합니다.");
        const remoteAddress = String(request.socket?.remoteAddress ?? "");
        if (!config.trustedProxyIps.includes(remoteAddress)) throw new HttpError(403, "신뢰된 인증 Proxy를 거치지 않은 요청입니다.");
        const id = String(request.headers["x-authenticated-user"] ?? "").trim();
        const displayName = String(request.headers["x-authenticated-name"] ?? id).trim();
        const roles = parseRoles(request.headers["x-authenticated-roles"]);
        if (!id) throw new HttpError(401, "사내 인증 사용자 정보를 확인할 수 없습니다.");
        return { id, displayName, roles };
    }

    throw new HttpError(500, `지원하지 않는 인증 모드입니다: ${config.authMode}`);
}

export function requireRole(user, ...roles) {
    if (!roles.some((role) => user.roles.includes(role) || user.roles.includes("admin"))) {
        throw new HttpError(403, "이 작업을 수행할 권한이 없습니다.");
    }
}
