import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
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

test("Registration Guide keeps one Handoff JSON and registers directly in step four", () => {
  const html = read("team_technical_assets_registration.html");
  const script = read("team_technical_assets_registration.js");
  assert.match(html, /반입용 JSON 파일 만들기/);
  assert.match(html, /사내 Library에 직접 등록하기/);
  assert.match(html, /등록 JSON을 다시 다운로드하지 않습니다/);
  assert.match(script, /Library 등록 요청/);
  assert.match(script, /DB에 한 번 저장/);
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

test("Library switches from static sample data to published API assets in API mode", () => {
  const shared = read("team_technical_assets.js");
  const library = read("team_technical_assets_library.js");
  assert.match(shared, /let libraryItems/);
  assert.match(library, /runtime\.mode === "api"/);
  assert.match(library, /libraryItems = await repository\.listAssets\(\)/);
});
