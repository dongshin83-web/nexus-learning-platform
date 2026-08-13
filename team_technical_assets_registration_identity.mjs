import {
    loadGitLabCurrentUser,
    normalizeGitLabRegistrationConfig,
    validateGitLabRegistrationConfig
} from "./team_technical_assets_gitlab.js?v=20260731-yaml-index-1";

/**
 * GitLab 서버와 프로젝트는 사이트 공통 설정에서만 가져오고,
 * 사용자가 매 등록마다 제공하는 값은 현재 창의 Access Token으로 제한한다.
 */
export function buildFixedGitLabRegistrationConfig(siteConfig = {}, token = "") {
    return normalizeGitLabRegistrationConfig({
        ...siteConfig,
        token
    });
}

export function fixedGitLabTargetErrors(siteConfig = {}) {
    const normalized = buildFixedGitLabRegistrationConfig(siteConfig, "__validation_only__");
    return validateGitLabRegistrationConfig(normalized)
        .filter((message) => !message.includes("Access Token"));
}

export function validateFixedGitLabRegistrationConfig(siteConfig = {}, token = "") {
    return validateGitLabRegistrationConfig(
        buildFixedGitLabRegistrationConfig(siteConfig, token)
    );
}

export function sameGitLabRegistrationCredential(left = {}, right = {}) {
    const normalizedLeft = normalizeGitLabRegistrationConfig(left);
    const normalizedRight = normalizeGitLabRegistrationConfig(right);
    return normalizedLeft.baseUrl === normalizedRight.baseUrl
        && normalizedLeft.projectId === normalizedRight.projectId
        && normalizedLeft.token === normalizedRight.token;
}

export async function resolveCurrentGitLabRegistrant(config = {}, fetchImpl = globalThis.fetch) {
    const snapshot = normalizeGitLabRegistrationConfig(config);
    const errors = validateGitLabRegistrationConfig(snapshot);
    if (errors.length) throw new Error(errors.join(" "));
    const user = await loadGitLabCurrentUser(snapshot, fetchImpl);
    return { user, config: snapshot };
}
