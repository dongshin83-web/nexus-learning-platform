import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

test("Overview leads with full-width purpose and a 3D wireframe team Knowledge Ontology", () => {
  const html = read("team_technical_assets.html");
  const css = read("team_technical_assets.css");

  assert.match(html, /knowledge-ontology-card[\s\S]*TEAM KNOWLEDGE ONTOLOGY[\s\S]*VISION MAP[\s\S]*<h1 id="knowledge-ontology-title">일의 맥락을 연결해 다시 쓰는 팀 지식<\/h1>/);
  assert.doesNotMatch(html, /overview-page-header|Why this Wiki|overview-page-title/);
  assert.equal((html.match(/<h1\b/g) ?? []).length, 1);
  assert.equal((html.match(/data-ontology-node=/g) ?? []).length, 6);
  assert.match(html, /knowledge-ontology-card[\s\S]*<\/section>[\s\S]*<figure class="container knowledge-graph"/);
  assert.match(html, /knowledge-wireframe-canvas/);
  assert.match(html, /knowledge-network-core[\s\S]*OUR TEAM[\s\S]*Knowledge[\s\S]*Ontology/);
  assert.doesNotMatch(html, /실제 Wiki 카드의 실시간 관계도가 아닌/);
  assert.doesNotMatch(html, /overview-ranking-grid|landing-most-used-assets|landing-contributors/);
  assert.match(html, /지금의 AI 활용[\s\S]*내용·맥락 정리[\s\S]*관계 후보 제안[\s\S]*사람이 검토[\s\S]*Wiki에 연결/);
  assert.match(html, /knowledge-purpose-strip[\s\S]*맥락을 남깁니다[\s\S]*지식을 연결합니다[\s\S]*AI Native를 준비합니다/);
  assert.doesNotMatch(css, /\.knowledge-ontology-card\s*\{[\s\S]{0,240}grid-template-columns:/);
  assert.match(css, /\.knowledge-wireframe-canvas/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  const script = read("team_technical_assets.js");
  assert.match(script, /function initKnowledgeWireframe\(\)[\s\S]*requestAnimationFrame\(drawFrame\)/);
  assert.match(script, /organicWave[\s\S]*time \* 0\.00009/);
  assert.match(script, /coreCenter[\s\S]*highlightedNodeIndexes\.forEach[\s\S]*lineTo\(coreCenter\.x, coreCenter\.y\)/);
  assert.match(html, /knowledge-network-core-surface[\s\S]*knowledge-wireframe-canvas[\s\S]*knowledge-network-core/);
  assert.match(css, /knowledge-network-core-surface[\s\S]*z-index:\s*1[\s\S]*knowledge-network-core[\s\S]*z-index:\s*3/);
  assert.match(script, /highlightedNodeIndexes\.forEach[\s\S]*lineWidth = 2\.6/);
  assert.doesNotMatch(script, /signalX|signalY/);
  assert.match(html, /일의 맥락을 연결해 다시 쓰는 팀 지식/);
  assert.doesNotMatch(html, /일의 맥락을 연결해<br>/);
  assert.match(css, /knowledge-ontology-copy h1[\s\S]{0,260}white-space:\s*nowrap/);
  assert.match(css, /knowledge-ontology-copy > p[\s\S]{0,300}white-space:\s*nowrap/);
  assert.match(script, /highlighted \? 6\.2 : 3/);
  assert.match(css, /\.overview-main\s*\{[\s\S]{0,120}padding-top:\s*var\(--spacing-8\)/);
  assert.match(css, /@media \(max-width: 45rem\)[\s\S]*\.overview-main\s*\{[\s\S]{0,120}padding-top:\s*var\(--spacing-5\)/);
  assert.match(css, /\.knowledge-graph\s*\{[\s\S]{0,180}min-height:\s*clamp\(46rem, 88vh, 50rem\)/);
  assert.match(css, /@media \(max-width: 45rem\)[\s\S]*\.knowledge-graph\s*\{[\s\S]{0,120}min-height:\s*40rem/);
  assert.match(script, /scaleRatio = width <= 720 \? 0\.33 : 0\.36/);
  assert.match(script, /tooltipStates[\s\S]*resolveTooltipCollisions/);
  assert.doesNotMatch(script, /tooltip\.dataset\.tooltipSide/);
  assert.doesNotMatch(script, /const rowY =|index % 2 === 0 \? 0\.23/);
  assert.match(script, /horizontalOffset = compactLayout[\s\S]*verticalOffset = compactLayout/);
  assert.match(script, /compactLayout \? 0\.055 : 0\.035/);
  assert.match(script, /const smoothedPosition[\s\S]*avoidCoreCollision\(smoothedPosition/);
});

test("Overview keeps discovery cards after the purpose section", () => {
  const html = read("team_technical_assets.html");
  const css = read("team_technical_assets.css");

  assert.match(html, /knowledge-purpose-strip[\s\S]*overview-paired-grid overview-discovery-grid[\s\S]*overview-daily-panel[\s\S]*overview-gap-panel/);
  assert.match(css, /\.overview-paired-grid\s*\{[\s\S]*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 60rem\)[\s\S]*\.overview-paired-grid\s*\{[\s\S]*grid-template-columns:\s*1fr/);
});

test("Overview labels only the remaining discovery fixtures as example data", () => {
  const html = read("team_technical_assets.html");

  assert.equal((html.match(/overview-example-badge/g) ?? []).length, 2);
  assert.match(html, /DAILY PICK[\s\S]*SEARCH GAP/);
});
