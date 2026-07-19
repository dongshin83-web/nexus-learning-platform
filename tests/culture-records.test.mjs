import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import test from "node:test";

const testsDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(testsDir, "..");

async function loadCultureRecords() {
    const source = await fs.readFile(path.join(rootDir, "team_technical_assets_culture_data.js"), "utf8");
    const context = { window: {} };
    vm.runInNewContext(source, context);
    return context.window.TEAM_CULTURE_RECORDS;
}

test("Culture records have unique ids and reusable media/link arrays", async () => {
    const records = await loadCultureRecords();
    assert.ok(Array.isArray(records));
    assert.ok(records.length >= 1);
    assert.equal(new Set(records.map((record) => record.id)).size, records.length);
    records.forEach((record) => {
        assert.match(record.id, /^[a-z0-9][a-z0-9-]*$/);
        assert.ok(record.title);
        assert.ok(record.type);
        assert.ok(record.summary);
        assert.ok(Array.isArray(record.images));
        assert.ok(Array.isArray(record.links));
    });
});

test("팀장레터 21호의 seven card-news images exist in order", async () => {
    const records = await loadCultureRecords();
    const letter = records.find((record) => record.id === "leader-letter-21");
    assert.equal(letter.title, "필요할 때 다시 찾을 수 있는 곳");
    assert.equal(letter.images.length, 7);
    for (const image of letter.images) {
        assert.ok(image.alt);
        await fs.access(path.join(rootDir, image.src));
    }
});
