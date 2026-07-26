import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

const pages = [
  "team_technical_assets.html",
  "team_technical_assets_map.html",
  "team_technical_assets_techtree.html",
  "team_technical_assets_wiki_registration.html",
  "team_technical_assets_culture.html",
];

test("all primary guide pages share one page heading scale and rhythm", () => {
  pages.forEach((page) => {
    const html = read(page);
    assert.match(html, /class="[^"]*technical-page-header[^"]*"/, `${page}: missing shared header`);
    assert.match(html, /class="[^"]*technical-page-badge[^"]*"/, `${page}: missing shared badge`);
    assert.match(html, /class="[^"]*technical-page-title[^"]*"/, `${page}: missing shared title`);
    assert.match(html, /class="[^"]*technical-page-copy[^"]*"/, `${page}: missing shared description`);
    assert.match(html, /team_technical_assets\.css\?v=20260720-(?:page-header-2|overview-count-inline-1)|team_technical_assets\.css\?v=20260721-registration-5/, `${page}: stale shared CSS`);
  });

  const css = read("team_technical_assets.css");
  assert.match(css, /\.technical-page-title\s*\{[^}]*font-size:\s*clamp\(1\.9rem, 3vw, 2\.65rem\)/s);
  assert.match(css, /\.technical-page-title\s*\{[^}]*line-height:\s*1\.22/s);
  assert.match(css, /\.technical-page-copy\s*\{[^}]*font-size:\s*0\.9rem/s);
  assert.match(css, /\.technical-page-copy\s*\{[^}]*line-height:\s*1\.65/s);
});
