import test from "node:test";
import assert from "node:assert/strict";
import {
    addGitLabAssetDiscussionComment,
    buildGitLabIssuesApiUrl,
    buildGitLabWikiApiUrl,
    buildGitLabWikiWebUrl,
    cardToGitLabWikiMarkdown,
    gitLabWikiPageToCard,
    loadGitLabAssetDiscussionComments,
    registerCardInGitLabWiki,
    validateGitLabRegistrationConfig
} from "../team_technical_assets_gitlab.js";

const card = {
    id: "impact-risk-ranking", title: "충격 위험도 비교", type: "방법론", domain: "impact",
    owner: "담당자", registrant: "등록자", publicationStatus: "게시", tags: ["충격", "위험도"],
    summary: "충격 취약 경향 비교", useCase: "설계안 판단", contents: "동일 조건 상대 비교",
    content: { standardProcedure: ["조건 정렬", "결과 비교"] }
};
const config = {
    baseUrl: "https://gitlab.company.com/", projectId: "vde/technical-assets",
    wikiUrl: "https://gitlab.company.com/vde/technical-assets/-/wikis", token: "session-only-token"
};

test("실제 자산 등록 대상은 data/cards가 아니라 GitLab Project Wiki API다", () => {
    assert.equal(buildGitLabWikiApiUrl(config), "https://gitlab.company.com/api/v4/projects/vde%2Ftechnical-assets/wikis");
    assert.equal(buildGitLabWikiWebUrl("impact-risk-ranking", config), "https://gitlab.company.com/vde/technical-assets/-/wikis/impact-risk-ranking");
});

test("Wiki Markdown은 검색 메타데이터를 숨은 JSON 계약으로 보존하고 다시 카드로 읽힌다", () => {
    const markdown = cardToGitLabWikiMarkdown(card);
    assert.match(markdown, /TECHNICAL_ASSET_CARD_JSON/);
    assert.match(markdown, /# 충격 위험도 비교/);
    assert.deepEqual(gitLabWikiPageToCard({ content: markdown }), card);
    assert.equal(gitLabWikiPageToCard({ content: "# 일반 Wiki 문서" }), null);
});

test("GitLab Wiki 직접 등록은 토큰을 헤더로만 보내고 Markdown 문서를 만든다", async () => {
    let request;
    const result = await registerCardInGitLabWiki(card, config, async (url, options) => {
        request = { url, options };
        return { ok: true, json: async () => ({ slug: "impact-risk-ranking", title: card.title }) };
    });
    assert.equal(request.options.method, "POST");
    assert.equal(request.options.headers["PRIVATE-TOKEN"], "session-only-token");
    assert.doesNotMatch(request.options.body, /session-only-token/);
    const body = JSON.parse(request.options.body);
    assert.equal(body.format, "markdown");
    assert.match(body.title, /impact-risk-ranking/);
    assert.match(body.content, /TECHNICAL_ASSET_CARD_JSON/);
    assert.equal(result.wikiUrl, "https://gitlab.company.com/vde/technical-assets/-/wikis/impact-risk-ranking");
});

test("GitLab 설정 누락과 동일 Wiki 문서 중복을 등록 오류로 표시한다", async () => {
    assert.deepEqual(validateGitLabRegistrationConfig({}), ["GitLab 서버 주소를 입력하세요.", "GitLab 프로젝트 ID 또는 경로를 입력하세요.", "현재 사용자 GitLab Access Token을 입력하세요."]);
    await assert.rejects(registerCardInGitLabWiki(card, config, async () => ({
        ok: false, status: 400, statusText: "Bad Request", json: async () => ({ message: "Slug has already been taken" })
    })), /같은 자산 ID/);
});

test("Wiki 자산 댓글은 GitLab Issue Note로 등록되고 작성자와 날짜를 서버 응답에서 사용한다", async () => {
    const calls = [];
    const responses = [
        [],
        { iid: 7, title: `[Wiki 자산 논의] ${card.id} · ${card.title}`, web_url: "https://gitlab.company.com/vde/technical-assets/-/issues/7" },
        { id: 31, body: "적용 결과를 추가했습니다.", created_at: "2026-07-21T12:34:56.000Z", author: { name: "GitLab 사용자" } }
    ];
    const fetchImpl = async (url, options) => {
        calls.push({ url, options });
        const body = responses.shift();
        return { ok: true, json: async () => body };
    };

    const comment = await addGitLabAssetDiscussionComment(card, "적용 결과를 추가했습니다.", config, fetchImpl);
    assert.equal(buildGitLabIssuesApiUrl(config), "https://gitlab.company.com/api/v4/projects/vde%2Ftechnical-assets/issues");
    assert.equal(calls[0].options.method, "GET");
    assert.equal(calls[1].options.method, "POST");
    assert.match(calls[2].url, /\/issues\/7\/notes$/);
    assert.equal(calls[2].options.headers["PRIVATE-TOKEN"], "session-only-token");
    assert.deepEqual(JSON.parse(calls[2].options.body), { body: "적용 결과를 추가했습니다." });
    assert.equal(comment.author, "GitLab 사용자");
    assert.equal(comment.createdAt, "2026-07-21T12:34:56.000Z");

    const loaded = await loadGitLabAssetDiscussionComments(card, config, async (url, options) => {
        if (url.includes("/notes?")) return { ok: true, json: async () => ([{ ...responses[0], id: 31, body: "기존 댓글", created_at: "2026-07-20T01:02:03.000Z", author: { username: "reviewer" } }]) };
        return { ok: true, json: async () => ([{ iid: 7, title: `[Wiki 자산 논의] ${card.id} · ${card.title}` }]) };
    });
    assert.equal(loaded.comments[0].author, "reviewer");
    assert.equal(loaded.comments[0].createdAt, "2026-07-20T01:02:03.000Z");
});
