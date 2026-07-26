import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => fs.readFileSync(path.join(root, relative), "utf8");

test("Culture registration uses direct registration language without JSON download", () => {
  const html = read("team_technical_assets_culture.html");
  const script = read("team_technical_assets_culture.js");
  assert.match(html, /팀 기록 등록/);
  assert.doesNotMatch(html, /등록 JSON 다운로드/);
  assert.match(script, /createCultureRecord\(record\)/);
  assert.match(script, /Nexus 검토본에는 데이터가 저장되지 않습니다/);
  assert.doesNotMatch(script, /function downloadJson/);
});

test("Wiki Guide keeps one Handoff JSON and registers directly in the Wiki", () => {
  const html = read("team_technical_assets_wiki_registration.html");
  const script = read("team_technical_assets_registration.js");
  assert.match(html, /반입용 JSON 파일 만들기/);
  assert.match(html, /사내 Wiki에 바로 등록하기/);
  assert.match(script, /GitLab 연결정보 확인 후 Wiki에 바로 등록/);
  assert.match(script, /등록 성공 즉시 GitLab Wiki에 게시/);
});

test("all nine asset types share the Wiki registration guide contract", () => {
  const source = read("team_technical_assets_registration.js");
  const sandbox = { document: { addEventListener() {} }, window: {} };
  vm.runInNewContext(
    `${source}\nglobalThis.audit = { TYPE_SPECIFIC_SCHEMAS, promptDefinitions, assetTypeGuideMeta, wikiRegistrationCompletionWalkthrough };`,
    sandbox
  );
  const {
    TYPE_SPECIFIC_SCHEMAS: schemas,
    promptDefinitions: prompts,
    assetTypeGuideMeta: meta,
    wikiRegistrationCompletionWalkthrough: captures
  } = sandbox.audit;
  const expectedKeys = ["vd-request", "cor", "methodology", "bp", "technical-report", "knowhow", "tool-manual", "education-material", "external-report"];
  assert.deepEqual(Object.keys(prompts), expectedKeys);
  assert.deepEqual(Object.keys(meta), expectedKeys);
  assert.deepEqual(Object.values(prompts).map((definition) => definition.cardType).sort(), Object.keys(schemas).sort());
  assert.equal(captures.length, 8);
  captures.forEach((capture) => {
    const image = fs.readFileSync(path.join(root, capture.src.split("?")[0]));
    assert.ok(image.length > 1000, `${capture.src}: capture image is empty`);
    capture.regions.forEach(([, , x, y, width, height]) => {
      const values = [x, y, width, height].map((value) => Number.parseFloat(value));
      assert.ok(values.every(Number.isFinite));
      assert.ok(values[0] >= 0 && values[1] >= 0 && values[0] + values[2] <= 100 && values[1] + values[3] <= 100);
    });
  });
});

test("Next.js backend template exposes atomic asset and direct Culture routes", () => {
  const schema = read("backend-nextjs/prisma/schema.prisma");
  const assetRoute = read("backend-nextjs/src/app/api/v1/asset-registration-requests/route.ts");
  const cultureRoute = read("backend-nextjs/src/app/api/v1/culture-records/route.ts");
  const service = read("backend-nextjs/src/lib/technicalAssets.ts");
  assert.match(schema, /model TechnicalAsset/);
  assert.match(schema, /model CultureRecord/);
  assert.match(assetRoute, /registerAsset/);
  assert.match(cultureRoute, /createCultureRecord/);
  assert.match(service, /prisma\.\$transaction/);
});

test("legacy Library adapter remains available only for the internal sandbox", () => {
  const shared = read("team_technical_assets.js");
  const library = read("team_technical_assets_library.js");
  assert.match(shared, /let libraryItems/);
  assert.match(library, /runtime\.mode === "api"/);
  assert.match(library, /libraryItems = await repository\.listAssets\(\)/);
});

test("Wiki Guide preserves semantic card tones and translucent capture regions", () => {
  const css = read("team_technical_assets.css");
  assert.match(css, /\.registration-guide-block\.is-completion\s*\{[^}]*background:\s*#edf7ef/s);
  assert.match(css, /\.registration-guide-caution\s*\{[^}]*background:\s*#fff3d6/s);
  assert.match(css, /\.is-ai\s*\{[^}]*--role-tint:\s*rgba\(37, 99, 235, 0\.14\)/s);
  assert.match(css, /\.is-registrant\s*\{[^}]*--role-tint:\s*rgba\(183, 121, 31, 0\.14\)/s);
  assert.match(css, /\.is-system\s*\{[^}]*--role-tint:\s*rgba\(15, 118, 110, 0\.14\)/s);
  assert.match(css, /\.registration-screen-region\s*\{[^}]*background:\s*var\(--role-tint\)/s);
  assert.doesNotMatch(css, /\.registration-screen-region\s*\{[^}]*background:\s*color-mix/s);
});
