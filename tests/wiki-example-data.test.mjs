import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

const read = (name) => fs.readFile(new URL(`../${name}`, import.meta.url), "utf8");

test("정적 Wiki 데이터는 예시 데이터 세트임을 명시한다", async () => {
    const data = await read("team_technical_assets_data.js");
    assert.match(data, /"dataMode": "example"/);
    assert.match(data, /"dataLabel": "예시 데이터"/);
    assert.match(data, /"cardCount": 14/);
});

test("Wiki 목록·상세·상단에 큰 예시 표시를 일관되게 렌더링한다", async () => {
    const [html, css, script] = await Promise.all([
        read("team_technical_assets_wiki.html"),
        read("team_technical_assets_wiki.css"),
        read("team_technical_assets_wiki.js")
    ]);
    assert.match(html, /id="wiki-example-dataset"/);
    assert.match(html, /20260817-example-badge-1/);
    assert.equal((script.match(/class="wiki-example-badge">예시/g) ?? []).length, 2);
    assert.match(script, /libraryMetadata\.dataMode === "example"/);
    assert.match(css, /\.wiki-example-dataset\s*\{/);
    assert.match(css, /\.wiki-result-card-badges > \.wiki-example-badge/);
    assert.match(css, /font-size: 0\.76rem/);
});
