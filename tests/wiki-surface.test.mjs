import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

const read = (name) => fs.readFile(new URL(`../${name}`, import.meta.url), "utf8");

test("Overview는 Wiki와 Wiki Guide를 운영 진입점으로 사용한다", async () => {
    const html = await read("team_technical_assets.html");
    assert.match(html, /href="team_technical_assets_wiki\.html"[^>]*>Wiki<\/a>/);
    assert.match(html, /href="team_technical_assets_wiki_registration\.html"[^>]*>Wiki Guide<\/a>/);
    assert.doesNotMatch(html, /href="team_technical_assets_library\.html"/);
    assert.doesNotMatch(html, /href="team_technical_assets_registration\.html"/);
    assert.match(html, /Wiki 전체 보기/);
});

test("Wiki와 Wiki Guide가 필요한 실행 모듈을 연결한다", async () => {
    const [wiki, guide] = await Promise.all([
        read("team_technical_assets_wiki.html"),
        read("team_technical_assets_wiki_registration.html")
    ]);
    assert.match(wiki, /id="asset-registration-dialog"/);
    assert.match(wiki, /team_technical_assets_registration_modal\.js/);
    assert.match(wiki, /team_technical_assets_wiki\.js/);
    assert.match(guide, /data-registration-context="wiki"/);
    assert.match(guide, /team_technical_assets_registration\.js/);
});

test("구 Library와 Registration Guide 운영 페이지는 제거되어 있다", async () => {
    for (const file of ["team_technical_assets_library.html", "team_technical_assets_registration.html"]) {
        await assert.rejects(
            () => fs.access(new URL(`../${file}`, import.meta.url)),
            (error) => error?.code === "ENOENT"
        );
    }
});
