import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { deriveDraftFromCards, validateBasisDraft } from "../team_technical_assets_library_test.js";

const basisCard = {
    id: "methodology-impact-risk-ranking",
    type: "방법론",
    title: "충격 취약부 Risk Ranking",
    domain: "impact",
    contexts: ["설계", "개발"],
    tags: ["충격", "Risk Ranking"],
    aliases: ["Drop 비교"]
};

const validInput = {
    id: "new-impact-application",
    title: "신규 구조 충격 비교",
    type: "VD Request",
    owner: "홍길동",
    registrant: "김등록",
    reviewer: "이검토",
    sourceLabel: "결과보고서",
    sourceUrl: "https://internal.example/report",
    useCase: "설계안 선택 전 상대 위험을 비교한다.",
    summary: "기존 방법론을 신규 구조에 적용한 초안이다.",
    contents: "신규 조건과 판단 한계를 확인했다.",
    relationNote: "기존 Risk Ranking 절차를 조건 변경 적용",
    relationConfirmed: true,
    technologyMapDecision: "not_applicable",
    technologyMapReason: "Test 대상 아님",
    learningPathDecision: "not_applicable",
    learningPathReason: "Test 대상 아님",
    humanConfirmed: true
};

const validWorkflow = {
    conversationComplete: true,
    securityComplete: true,
    fileReady: true,
    handoffValid: true
};

test("Library 기반 등록 Test 페이지가 실제 카드 데이터와 직접 등록 모듈을 연결한다", async () => {
    const html = await fs.readFile(new URL("../team_technical_assets_library_test.html", import.meta.url), "utf8");
    assert.match(html, /team_technical_assets_data\.js/);
    assert.match(html, /team_technical_assets_library_test\.js/);
    assert.match(html, /id="basis-card-list"/);
    assert.match(html, /id="basis-submit-test"/);
    assert.doesNotMatch(html, /id="basis-download-json"/);
});

test("선택한 Library 카드의 분류와 관계를 신규 초안에 반영한다", () => {
    const draft = deriveDraftFromCards([basisCard], { ...validInput, tags: "신규 구조" }, "REG-20260720120000-TEST");
    assert.equal(draft.domain, "impact");
    assert.deepEqual(draft.contexts, ["설계", "개발"]);
    assert.deepEqual(draft.searchReuse.foundAssetIds, [basisCard.id]);
    assert.deepEqual(draft.relations, [{ type: "BASED_ON", targetId: basisCard.id, note: validInput.relationNote, confirmed: true }]);
    assert.equal(draft.registrationSource.testOnly, true);
});

test("기반 카드와 신규 사실 및 절차 확인이 모두 있을 때 기반 등록 가능으로 판정한다", () => {
    const draft = deriveDraftFromCards([basisCard], validInput, "REG-20260720120000-TEST");
    const result = validateBasisDraft(draft, [basisCard], validWorkflow);
    assert.equal(result.passed, true);
    assert.equal(result.errors.length, 0);
    assert.ok(result.warnings.some((message) => message.includes("Dry-run Test")));
});

test("기반 카드가 없거나 기존 ID를 재사용하면 차단한다", () => {
    const draft = deriveDraftFromCards([], {
        ...validInput,
        id: basisCard.id,
        title: "중복 카드"
    }, "REG-20260720120000-TEST");
    const result = validateBasisDraft(draft, [basisCard], validWorkflow);
    assert.equal(result.passed, false);
    assert.ok(result.errors.some((message) => message.includes("기반 카드")));
    assert.ok(result.errors.some((message) => message.includes("이미 사용 중")));
});
