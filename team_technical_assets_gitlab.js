const textValue = (value) => String(value ?? "").trim();
const CARD_MARKER_START = "<!-- TECHNICAL_ASSET_CARD_JSON";
const CARD_MARKER_END = "-->";

export function normalizeGitLabRegistrationConfig(config = {}) {
    return {
        baseUrl: textValue(config.baseUrl).replace(/\/+$/, ""),
        projectId: textValue(config.projectId),
        wikiUrl: textValue(config.wikiUrl).replace(/\/+$/, ""),
        token: textValue(config.token)
    };
}

export function validateGitLabRegistrationConfig(config = {}) {
    const normalized = normalizeGitLabRegistrationConfig(config);
    const errors = [];
    if (!normalized.baseUrl) errors.push("GitLab 서버 주소를 입력하세요.");
    if (normalized.baseUrl && !/^https:\/\//i.test(normalized.baseUrl) && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalized.baseUrl)) {
        errors.push("GitLab 서버 주소는 HTTPS를 사용해야 합니다.");
    }
    if (!normalized.projectId) errors.push("GitLab 프로젝트 ID 또는 경로를 입력하세요.");
    if (!normalized.token) errors.push("현재 사용자 GitLab Access Token을 입력하세요.");
    return errors;
}

export function buildGitLabWikiApiUrl(config = {}) {
    const normalized = normalizeGitLabRegistrationConfig(config);
    return `${normalized.baseUrl}/api/v4/projects/${encodeURIComponent(normalized.projectId)}/wikis`;
}

export function buildGitLabIssuesApiUrl(config = {}) {
    const normalized = normalizeGitLabRegistrationConfig(config);
    return `${normalized.baseUrl}/api/v4/projects/${encodeURIComponent(normalized.projectId)}/issues`;
}

export function buildGitLabWikiWebUrl(slug, config = {}) {
    const normalized = normalizeGitLabRegistrationConfig(config);
    if (normalized.wikiUrl) return `${normalized.wikiUrl}/${encodeURIComponent(textValue(slug))}`;
    if (!normalized.baseUrl || !normalized.projectId || /^\d+$/.test(normalized.projectId)) return "";
    return `${normalized.baseUrl}/${normalized.projectId.replace(/^\/+|\/+$/g, "")}/-/wikis/${encodeURIComponent(textValue(slug))}`;
}

function markdownValue(value) {
    if (Array.isArray(value)) return value.map((item) => `- ${markdownValue(item)}`).join("\n");
    if (value && typeof value === "object") return Object.entries(value).map(([key, item]) => `- **${key}**: ${markdownValue(item)}`).join("\n");
    return textValue(value) || "미기록";
}

export function cardToGitLabWikiMarkdown(card) {
    const metadata = `${CARD_MARKER_START}\n${JSON.stringify(card, null, 2)}\n${CARD_MARKER_END}`;
    const details = Object.entries(card.content || {})
        .map(([key, value]) => `### ${key}\n\n${markdownValue(value)}`)
        .join("\n\n");
    return `${metadata}\n\n# ${card.title}\n\n` +
        `- 자산 ID: \`${card.id}\`\n` +
        `- 자산유형: ${card.type}\n` +
        `- 기술영역: ${card.domain}\n` +
        `- 담당자: ${card.owner}\n` +
        `- 등록자: ${card.registrant}\n` +
        `- 게시 상태: ${card.publicationStatus}\n` +
        `- 태그: ${(card.tags || []).map((tag) => `#${tag}`).join(" ") || "미기록"}\n\n` +
        `## 요약\n\n${card.summary}\n\n` +
        `## 활용 상황\n\n${card.useCase}\n\n` +
        `## 핵심 내용\n\n${card.contents}\n\n` +
        `## 유형별 상세\n\n${details || "미기록"}\n`;
}

export function gitLabWikiPageToCard(page = {}) {
    const content = textValue(page.content);
    const start = content.indexOf(CARD_MARKER_START);
    if (start < 0) return null;
    const jsonStart = start + CARD_MARKER_START.length;
    const end = content.indexOf(CARD_MARKER_END, jsonStart);
    if (end < 0) return null;
    try {
        const card = JSON.parse(content.slice(jsonStart, end).trim());
        return card && typeof card === "object" && !Array.isArray(card) ? card : null;
    } catch {
        return null;
    }
}

async function readApiMessage(response) {
    try {
        const body = await response.json();
        if (typeof body?.message === "string") return body.message;
        if (body?.message && typeof body.message === "object") return Object.values(body.message).flat().join(" ");
        if (typeof body?.error === "string") return body.error;
    } catch {
        return response.statusText || "응답 내용을 확인할 수 없습니다.";
    }
    return response.statusText || "요청이 거부되었습니다.";
}

function discussionTitle(card = {}) {
    return `[Wiki 자산 논의] ${textValue(card.id)} · ${textValue(card.title)}`;
}

function discussionDescription(card = {}, config = {}) {
    const wikiUrl = buildGitLabWikiWebUrl(card.id, config);
    return `기술자산 Wiki 문서의 질문·적용 경험·개선 의견을 기록하는 Thread입니다.\n\n` +
        `- 자산 ID: \`${textValue(card.id)}\`\n` +
        `- 자산명: ${textValue(card.title)}\n` +
        `${wikiUrl ? `- Wiki 문서: ${wikiUrl}\n` : ""}` +
        `\n이 Issue의 Note 작성자와 작성일은 GitLab이 자동으로 기록합니다.`;
}

async function gitLabApiRequest(url, options, fetchImpl) {
    const response = await fetchImpl(url, options);
    if (!response.ok) {
        const message = await readApiMessage(response);
        if (response.status === 401 || response.status === 403) {
            throw new Error("GitLab 인증 또는 Issue 작성 권한을 확인하세요.");
        }
        throw new Error(`GitLab Issue 요청 실패 (${response.status}): ${message}`);
    }
    return response.json().catch(() => ({}));
}

export async function findGitLabAssetDiscussion(card, config = {}, fetchImpl = globalThis.fetch) {
    const normalized = normalizeGitLabRegistrationConfig(config);
    const configErrors = validateGitLabRegistrationConfig(normalized);
    if (configErrors.length) throw new Error(configErrors.join(" "));
    if (typeof fetchImpl !== "function") throw new Error("GitLab Issue 요청을 실행할 수 없습니다.");

    const issuesUrl = buildGitLabIssuesApiUrl(normalized);
    const query = new URLSearchParams({ scope: "all", state: "opened", search: textValue(card.id), in: "title", per_page: "100" });
    const issues = await gitLabApiRequest(`${issuesUrl}?${query}`, {
        method: "GET",
        headers: { "PRIVATE-TOKEN": normalized.token }
    }, fetchImpl);
    return (Array.isArray(issues) ? issues : []).find((issue) => textValue(issue.title) === discussionTitle(card)) || null;
}

export async function ensureGitLabAssetDiscussion(card, config = {}, fetchImpl = globalThis.fetch) {
    const normalized = normalizeGitLabRegistrationConfig(config);
    const exact = await findGitLabAssetDiscussion(card, normalized, fetchImpl);
    if (exact) return exact;

    return gitLabApiRequest(buildGitLabIssuesApiUrl(normalized), {
        method: "POST",
        headers: { "Content-Type": "application/json", "PRIVATE-TOKEN": normalized.token },
        body: JSON.stringify({ title: discussionTitle(card), description: discussionDescription(card, normalized) })
    }, fetchImpl);
}

export async function loadGitLabAssetDiscussionComments(card, config = {}, fetchImpl = globalThis.fetch) {
    const normalized = normalizeGitLabRegistrationConfig(config);
    const issue = await findGitLabAssetDiscussion(card, normalized, fetchImpl);
    if (!issue) return { issueIid: null, issueUrl: "", comments: [] };
    const notes = await gitLabApiRequest(`${buildGitLabIssuesApiUrl(normalized)}/${encodeURIComponent(issue.iid)}/notes?sort=asc&order_by=created_at&per_page=100`, {
        method: "GET",
        headers: { "PRIVATE-TOKEN": normalized.token }
    }, fetchImpl);
    return {
        issueIid: issue.iid,
        issueUrl: issue.web_url || "",
        comments: (Array.isArray(notes) ? notes : []).filter((note) => note.system !== true).map((note) => ({
            id: note.id,
            author: textValue(note.author?.name || note.author?.username) || "GitLab 사용자",
            message: textValue(note.body),
            createdAt: textValue(note.created_at)
        }))
    };
}

export async function addGitLabAssetDiscussionComment(card, message, config = {}, fetchImpl = globalThis.fetch) {
    const normalized = normalizeGitLabRegistrationConfig(config);
    const issue = await ensureGitLabAssetDiscussion(card, normalized, fetchImpl);
    const note = await gitLabApiRequest(`${buildGitLabIssuesApiUrl(normalized)}/${encodeURIComponent(issue.iid)}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "PRIVATE-TOKEN": normalized.token },
        body: JSON.stringify({ body: textValue(message) })
    }, fetchImpl);
    return {
        issueIid: issue.iid,
        issueUrl: issue.web_url || "",
        id: note.id,
        author: textValue(note.author?.name || note.author?.username) || "GitLab 사용자",
        message: textValue(note.body) || textValue(message),
        createdAt: textValue(note.created_at) || new Date().toISOString()
    };
}

export async function registerCardInGitLabWiki(card, config = {}, fetchImpl = globalThis.fetch) {
    const normalized = normalizeGitLabRegistrationConfig(config);
    const configErrors = validateGitLabRegistrationConfig(normalized);
    if (configErrors.length) throw new Error(configErrors.join(" "));
    if (typeof fetchImpl !== "function") throw new Error("GitLab Wiki 등록 요청을 실행할 수 없습니다.");

    const response = await fetchImpl(buildGitLabWikiApiUrl(normalized), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "PRIVATE-TOKEN": normalized.token
        },
        body: JSON.stringify({
            title: `${card.id} · ${card.title}`,
            content: cardToGitLabWikiMarkdown(card),
            format: "markdown"
        })
    });

    if (!response.ok) {
        const message = await readApiMessage(response);
        if (response.status === 400 && /(already exists|has already been taken)/i.test(message)) {
            throw new Error("같은 자산 ID의 GitLab Wiki 문서가 이미 있습니다. 자산 ID를 변경하거나 기존 Wiki 문서를 수정하세요.");
        }
        if (response.status === 401 || response.status === 403) {
            throw new Error("GitLab 인증 또는 Wiki 작성 권한을 확인하세요. 토큰은 현재 사용자에게 허용된 범위만 사용합니다.");
        }
        throw new Error(`GitLab Wiki 등록 실패 (${response.status}): ${message}`);
    }

    const result = await response.json().catch(() => ({}));
    return {
        ...result,
        slug: result.slug || card.id,
        wikiUrl: buildGitLabWikiWebUrl(result.slug || card.id, normalized),
        projectId: normalized.projectId
    };
}
