import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { createCardFromHandoff } from "../tools/register-handoff.mjs";
import { findDuplicateCandidates, readJson, scoreCard, validateCard } from "../tools/card-contract.mjs";
import { loadCards, serializeLibrary, validateLibrary } from "../tools/build-library-data.mjs";

const testsDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(testsDir, "..");
const handoffPath = path.join(rootDir, "sandbox", "handoff", "vdr-drop-design-selection.json");
const internalPath = path.join(rootDir, "sandbox", "internal", "vdr-drop-design-selection.internal.json");

test("all card source files satisfy the common contract", async () => {
    const cards = await loadCards();
    const validation = validateLibrary(cards);
    assert.deepEqual(validation.errors, []);
    assert.equal(cards.length, 14);
    assert.equal(new Set(cards.map((card) => card.type)).size, 9);
});

test("external handoff and internal overlay produce a publishable VD Request", async () => {
    const packet = await readJson(handoffPath);
    const internal = await readJson(internalPath);
    const card = createCardFromHandoff(packet, internal);
    const validation = validateCard(card);

    assert.deepEqual(validation.errors, []);
    assert.equal(card.type, "VD Request");
    assert.equal(card.searchReuse.performed, true);
    assert.equal(card.aiAssistance.externalStructured, true);
    assert.equal(card.aiAssistance.internalClineStructured, true);
    assert.equal(card.aiAssistance.humanConfirmed, true);
    assert.ok(card.content.judgmentScope.includes("상대 비교"));
});

test("classification contract separates publication, type status, context, and person owner", async () => {
    const cards = await loadCards();
    const methodology = cards.find((card) => card.type === "방법론");

    assert.ok(cards.every((card) => card.contexts.length > 0));
    assert.ok(cards.every((card) => !card.contexts.some((context) => ["교육", "팀 운영"].includes(context))));
    assert.ok(cards.every((card) => !(/파트$|팀$/.test(card.owner) || card.owner === "공통")));
    assert.match(validateCard({ ...methodology, owner: "3파트" }).errors.join(" "), /실제 담당자 이름/);
    assert.match(validateCard({ ...methodology, status: "수행 중" }).errors.join(" "), /유형별 상태/);
    assert.match(validateCard({ ...methodology, publicationStatus: "보완 필요" }).errors.join(" "), /게시 상태/);
    assert.doesNotMatch(validateCard({ ...methodology, contexts: ["연구", "CTO"] }).errors.join(" "), /활용 맥락/);
    assert.match(validateCard({ ...methodology, contexts: ["교육"] }).errors.join(" "), /활용 맥락/);
});

test("security self-check blocks an unsafe external packet", async () => {
    const packet = await readJson(handoffPath);
    const internal = await readJson(internalPath);
    assert.throws(
        () => createCardFromHandoff({ ...packet, securitySelfCheck: "recheck" }, internal),
        /보안 자체점검/
    );
});

test("duplicate candidates surface the related impact methodology and CoR", async () => {
    const packet = await readJson(handoffPath);
    const internal = await readJson(internalPath);
    const card = createCardFromHandoff(packet, internal);
    const cards = await loadCards();
    const candidates = findDuplicateCandidates(card, cards);
    const ids = candidates.map((candidate) => candidate.id);

    assert.ok(ids.includes("methodology-impact-risk-ranking"));
    assert.ok(ids.includes("cor-impact"));
});

test("search evaluation queries find expected cards in the top five", async () => {
    const cards = await loadCards();
    const evaluations = await readJson(path.join(rootDir, "data", "search-evaluation.json"));

    evaluations.forEach((evaluation) => {
        const ranked = cards
            .map((card) => ({ id: card.id, score: scoreCard(card, evaluation.query) }))
            .filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5)
            .map((item) => item.id);

        evaluation.expectedTopIds.forEach((expectedId) => {
            assert.ok(ranked.includes(expectedId), `${evaluation.id}: ${expectedId} not in ${ranked.join(", ")}`);
        });
    });
});

test("generated browser data is deterministic and current", async () => {
    const cards = await loadCards();
    const expected = serializeLibrary(cards);
    const actual = await fs.readFile(path.join(rootDir, "team_technical_assets_data.js"), "utf8");
    assert.equal(actual, expected);
});
