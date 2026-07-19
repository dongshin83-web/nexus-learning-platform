import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { loadConfig, projectRoot } from "../server/config.mjs";
import { SqliteAssetStore } from "../server/sqlite-store.mjs";
import { AssetService } from "../server/asset-service.mjs";
import { createApp } from "../server/app.mjs";

let directory;
let store;
let server;
let baseUrl;

before(async () => {
    directory = await fs.mkdtemp(path.join(os.tmpdir(), "technical-assets-api-"));
    const config = loadConfig({ databasePath: path.join(directory, "test.sqlite"), staticRoot: projectRoot, port: 0 });
    store = new SqliteAssetStore({ databasePath: config.databasePath, schemaPath: path.join(projectRoot, "database", "library_schema.sqlite.sql") });
    server = createApp({ config, service: new AssetService(store) });
    await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
    await new Promise((resolve) => server.close(resolve));
    store.close();
    await fs.rm(directory, { recursive: true, force: true });
});

function registrationCard(id, registrationId) {
    return {
        schemaVersion: "1.0.0",
        id,
        registrationId,
        title: `Backend E2E ${id}`,
        type: "VD Request",
        domain: "impact",
        contexts: ["설계"],
        publicationStatus: "게시",
        status: "완료",
        owner: "테스트 담당자",
        registrant: "테스트 등록자",
        reviewer: "테스트 Reviewer",
        createdAt: "2026-07-19",
        updatedAt: "2026-07-19",
        summary: "백엔드 종단간 등록 시험용 자산입니다.",
        useCase: "등록과 검토 및 게시 흐름을 검증합니다.",
        contents: "원자 저장과 권한 분리를 확인합니다.",
        tags: ["backend", "e2e"],
        aliases: ["백엔드 시험"],
        links: [{ label: "시험 근거", href: "https://internal.example.test/evidence", role: "evidence", accessScope: "VDE 내부", status: "verified" }],
        relations: [],
        changeLog: [],
        frameworkLinks: [],
        frameworkLinkDecisions: {
            technologyMap: { status: "not_applicable", reason: "백엔드 시험 범위 밖" },
            learningPath: { status: "not_applicable", reason: "백엔드 시험 범위 밖" }
        },
        searchReuse: { performed: true, foundAssetIds: [], decision: "no-candidate", reason: "테스트 DB에 기존 후보 없음" },
        aiAssistance: { manualStructured: true, humanConfirmed: true },
        content: {
            context: "백엔드 시험",
            primaryQuestion: "등록이 원자적으로 처리되는가",
            inputsAndConstraints: "로컬 SQLite",
            approach: "HTTP API 종단간 시험",
            result: "상태와 감사 기록 확인",
            judgmentScope: "등록 검토 게시 흐름",
            limitations: "사내 SSO 제외",
            followUp: "사내 연동"
        }
    };
}

async function api(pathname, { method = "GET", body, roles = "registrant,reviewer" } = {}) {
    return fetch(`${baseUrl}${pathname}`, {
        method,
        headers: {
            "x-dev-user": roles.includes("reviewer") ? "reviewer.one" : "registrant.one",
            "x-dev-roles": roles,
            ...(body ? { "content-type": "application/json" } : {})
        },
        body: body ? JSON.stringify(body) : undefined
    });
}

test("등록 요청은 초안 생성과 검토 요청을 한 트랜잭션으로 처리한다", async () => {
    const response = await api("/api/v1/asset-registration-requests", { method: "POST", body: registrationCard("backend-e2e-one", "REG-20260719010101-A001"), roles: "registrant" });
    assert.equal(response.status, 201);
    const card = await response.json();
    assert.equal(card.workflowStatus, "검토 요청");
    assert.equal(card.publicationStatus, "초안");
    assert.equal(store.listReviews(card.id).at(-1).action, "submitted");
});

test("검토 전 자산은 Library 데이터에서 숨기고 검토함에만 표시한다", async () => {
    const libraryData = await (await api("/team_technical_assets_data.js", { roles: "registrant" })).text();
    assert.equal(libraryData.includes("backend-e2e-one"), false);
    const queue = await (await api("/api/v1/review-queue", { roles: "reviewer" })).json();
    assert.equal(queue.some((item) => item.id === "backend-e2e-one"), true);
});

test("서버 코드와 DB 경로는 정적 파일로 공개하지 않는다", async () => {
    assert.equal((await api("/server/index.mjs")).status, 403);
    assert.equal((await api("/database/library_schema.sqlite.sql")).status, 403);
    assert.equal((await api("/.git/config")).status, 403);
});

test("다른 출처의 변경 요청을 차단한다", async () => {
    const response = await fetch(`${baseUrl}/api/v1/asset-registration-requests`, {
        method: "POST",
        headers: { origin: "https://malicious.example", "content-type": "application/json", "x-dev-roles": "registrant" },
        body: JSON.stringify(registrationCard("csrf-blocked", "REG-20260719010101-C001"))
    });
    assert.equal(response.status, 403);
    assert.equal(store.getAsset("csrf-blocked"), null);
});

test("등록자는 게시할 수 없고 Reviewer 승인 후 Library에 노출된다", async () => {
    const forbidden = await api("/api/v1/assets/backend-e2e-one/publish", { method: "POST", roles: "registrant" });
    assert.equal(forbidden.status, 403);
    const published = await api("/api/v1/assets/backend-e2e-one/publish", { method: "POST", roles: "reviewer" });
    assert.equal(published.status, 200);
    assert.equal((await published.json()).workflowStatus, "게시");
    const libraryData = await (await api("/team_technical_assets_data.js", { roles: "registrant" })).text();
    assert.equal(libraryData.includes("backend-e2e-one"), true);
});

test("Reviewer 수정 요청과 중복 등록 충돌을 기록한다", async () => {
    const card = registrationCard("backend-e2e-two", "REG-20260719010101-A002");
    assert.equal((await api("/api/v1/asset-registration-requests", { method: "POST", body: card, roles: "registrant" })).status, 201);
    const changed = await api("/api/v1/assets/backend-e2e-two/request-changes", { method: "POST", body: { comment: "근거 링크 설명을 보완하세요." }, roles: "reviewer" });
    assert.equal(changed.status, 200);
    assert.equal((await changed.json()).workflowStatus, "수정 필요");
    const duplicate = await api("/api/v1/asset-registration-requests", { method: "POST", body: card, roles: "registrant" });
    assert.equal(duplicate.status, 409);
});
