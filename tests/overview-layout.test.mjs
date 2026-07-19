import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

test("Overview pairs monthly rankings and discovery cards in two equal grids", () => {
  const html = read("team_technical_assets.html");
  const css = read("team_technical_assets.css");

  assert.match(html, /overview-paired-grid overview-ranking-grid[\s\S]*overview-primary-panel[\s\S]*overview-contributor-panel/);
  assert.match(html, /overview-paired-grid overview-discovery-grid[\s\S]*overview-daily-panel[\s\S]*overview-gap-panel/);
  assert.match(css, /\.overview-paired-grid\s*\{[\s\S]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 60rem\)[\s\S]*\.overview-paired-grid\s*\{[\s\S]*grid-template-columns:\s*1fr/);
});

test("Overview monthly rankings are capped at five and contributors include credited participants", () => {
  const html = read("team_technical_assets.html");
  const script = read("team_technical_assets.js");

  assert.equal((html.match(/overview-example-badge/g) ?? []).length, 4);
  assert.match(script, /const landingOverviewExampleMode = true/);
  assert.match(script, /const landingExampleMostUsedAssets = \[[\s\S]*tool-manual-ai-search[\s\S]*\];/);
  assert.match(script, /const landingExampleContributors = \[[\s\S]*샘플 Reviewer E[\s\S]*\];/);
  assert.match(script, /function getLandingContributorDetail/);
  assert.match(script, /class="contributor-breakdown"/);
  assert.match(script, /registeredUsageLinks[\s\S]*\.slice\(0, 5\)/);
  assert.match(script, /\(item\.contributors \?\? \[\]\)\.forEach\(\(name\) => add\(name, "참여", item\)\)/);
  assert.match(script, /function getLandingContributors\(\)[\s\S]*\.slice\(0, 5\)/);
  assert.match(script, /class="overview-rank"/);
});
