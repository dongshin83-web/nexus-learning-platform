import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const testsDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(testsDir, "..");
const registerTool = path.join(rootDir, "tools", "register-card.mjs");

function draftCard(overrides = {}) {
    return {
        schemaVersion: "1.0",
        registrationId: "REG-20260719123456-TEST",
        id: "registration-check-only-test",
        type: "VD Request",
        title: "등록 검사 전용 테스트",
        domain: "impact",
        secondaryDomains: [],
        contexts: ["개발", "사업부"],
        publicationStatus: "초안",
        status: "접수",
        owner: "테스트 담당자",
        registrant: "테스트 등록자",
        reviewer: "",
        contributors: [],
        createdAt: "2026-07-19",
        updatedAt: "2026-07-19",
        summary: "등록 CLI의 계약 검사를 확인하는 초안 카드입니다.",
        useCase: "다운로드 JSON을 data/cards에 반입하기 전에 검사할 때 사용합니다.",
        contents: "검사 전용 데이터",
        tags: ["등록 검사"],
        aliases: [],
        sourceIds: [],
        links: [],
        relations: [],
        frameworkLinks: [],
        frameworkLinkDecisions: {
            technologyMap: { status: "target_missing", reason: "테스트용 대상 없음" },
            learningPath: { status: "not_applicable", reason: "테스트용 학습 연결 없음" }
        },
        searchReuse: { performed: true, foundAssetIds: [], decision: "no-candidate", reason: "테스트용 후보 없음" },
        aiAssistance: { manualStructured: true, humanConfirmed: true },
        changeLog: [{ changedAt: "2026-07-19", changedBy: "테스트 등록자", changeType: "생성", reason: "CLI 검사" }],
        content: { context: "등록 CLI 계약 검사" },
        ...overrides
    };
}

async function withTempCard(card, callback) {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), "technical-asset-registration-"));
    const filePath = path.join(directory, "card.json");
    await fs.writeFile(filePath, `${JSON.stringify(card, null, 2)}\n`, "utf8");
    try {
        return await callback(filePath);
    } finally {
        await fs.rm(directory, { recursive: true, force: true });
    }
}

test("registration CLI accepts a valid check-only draft without modifying the Library", async () => {
    const before = await fs.readFile(path.join(rootDir, "team_technical_assets_data.js"), "utf8");
    const result = await withTempCard(draftCard(), (filePath) => execFileAsync(process.execPath, [registerTool, "--file", filePath], { cwd: rootDir }));
    const after = await fs.readFile(path.join(rootDir, "team_technical_assets_data.js"), "utf8");
    assert.match(result.stdout, /OK registration card/);
    assert.match(result.stdout, /CHECK ONLY/);
    assert.equal(after, before);
});

test("registration CLI rejects an invalid card id", async () => {
    await assert.rejects(
        withTempCard(draftCard({ id: "Invalid ID" }), (filePath) => execFileAsync(process.execPath, [registerTool, "--file", filePath], { cwd: rootDir })),
        (error) => /id에는 영문 소문자/.test(String(error.stderr ?? error.message))
    );
});

test("registration CLI rejects a relation to a missing Library card", async () => {
    const card = draftCard({
        relations: [{ type: "related", targetId: "missing-library-card", note: "존재하지 않는 관계" }]
    });
    await assert.rejects(
        withTempCard(card, (filePath) => execFileAsync(process.execPath, [registerTool, "--file", filePath], { cwd: rootDir })),
        (error) => /관계 대상을 현재 Library에서 찾을 수 없음/.test(error.stderr)
    );
});
