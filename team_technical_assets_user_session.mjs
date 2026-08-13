const SESSION_STORAGE_KEY = "technical-assets.gitlab-user-session.v1";

function textValue(value) {
    return String(value ?? "").trim();
}

function storageOrNull(storage) {
    if (storage) return storage;
    try {
        return globalThis.sessionStorage || null;
    } catch {
        return null;
    }
}

/**
 * 로컬 Pages 프로토타입은 토큰을 탭 세션 동안만 보관한다.
 * 운영에서는 이 모듈의 호출부를 GitLab OAuth/사내 SSO 세션 공급자로 교체한다.
 */
export function loadGitLabUserSession(storage) {
    const target = storageOrNull(storage);
    if (!target) return null;
    try {
        const parsed = JSON.parse(target.getItem(SESSION_STORAGE_KEY) || "null");
        const actor = textValue(parsed?.actor);
        const token = textValue(parsed?.token);
        if (!actor || !token) return null;
        return {
            actor: actor.startsWith("@") ? actor : `@${actor}`,
            token,
            connectedAt: textValue(parsed.connectedAt)
        };
    } catch {
        return null;
    }
}

export function saveGitLabUserSession({ actor, token } = {}, storage) {
    const target = storageOrNull(storage);
    const normalizedActor = textValue(actor);
    const normalizedToken = textValue(token);
    if (!target) throw new Error("이 브라우저에서는 GitLab 사용자 세션을 보관할 수 없습니다.");
    if (!normalizedActor || !normalizedToken) throw new Error("확인된 GitLab 사용자와 Access Token이 필요합니다.");
    const session = {
        actor: normalizedActor.startsWith("@") ? normalizedActor : `@${normalizedActor}`,
        token: normalizedToken,
        connectedAt: new Date().toISOString()
    };
    target.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    return session;
}

export function clearGitLabUserSession(storage) {
    storageOrNull(storage)?.removeItem(SESSION_STORAGE_KEY);
}

export { SESSION_STORAGE_KEY };
