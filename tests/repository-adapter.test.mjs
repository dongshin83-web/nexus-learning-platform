import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import test from "node:test";

const testsDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(testsDir, "..");
const source = await fs.readFile(path.join(rootDir, "team_technical_assets_repository.js"), "utf8");

function createContext(overrides = {}) {
    const context = { window: {}, ...overrides };
    vm.runInNewContext(source, context);
    return context;
}

test("static repository reads page data and blocks direct writes", async () => {
    const context = createContext();
    context.window.TECHNICAL_ASSET_LIBRARY = { cards: [{ id: "sample" }] };
    const repository = context.window.createTechnicalAssetRepository({ mode: "static" });
    assert.equal((await repository.listAssets())[0].id, "sample");
    await assert.rejects(repository.createAsset({ id: "new" }), /정적 모드에서는 직접 등록할 수 없습니다/);
});

test("REST repository sends a draft to the configured internal API", async () => {
    const requests = [];
    const context = createContext({
        fetch: async (url, options) => {
            requests.push({ url, options });
            return { ok: true, status: 201, json: async () => ({ id: "new-asset" }) };
        }
    });
    const repository = context.window.createTechnicalAssetRepository({ mode: "api", apiBaseUrl: "https://internal.example/api/v1/" });
    const result = await repository.createAsset({ id: "new-asset" });
    assert.equal(result.id, "new-asset");
    assert.equal(requests[0].url, "https://internal.example/api/v1/assets");
    assert.equal(requests[0].options.method, "POST");
    assert.equal(JSON.parse(requests[0].options.body).id, "new-asset");
});
