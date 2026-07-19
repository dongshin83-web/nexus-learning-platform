import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const appRoot = path.resolve(here, "..");
const sourceRoot = path.resolve(process.env.TECH_ASSET_UI_SOURCE || path.join(appRoot, ".."));
const publicRoot = path.join(appRoot, "public");
const entries = fs.readdirSync(sourceRoot).filter((name) => /^team_technical_assets.*\.(html|css|js|woff2)$/i.test(name));

fs.mkdirSync(publicRoot, { recursive: true });
for (const name of entries) fs.copyFileSync(path.join(sourceRoot, name), path.join(publicRoot, name));

fs.writeFileSync(
  path.join(publicRoot, "team_technical_assets_runtime_config.js"),
  'window.TECHNICAL_ASSET_RUNTIME = { mode: "api", apiBaseUrl: "/api/v1", credentials: "same-origin" };\n',
  "utf8",
);

const assetSource = path.join(sourceRoot, "assets", "registration-guide");
const assetTarget = path.join(publicRoot, "assets", "registration-guide");
if (fs.existsSync(assetSource)) fs.cpSync(assetSource, assetTarget, { recursive: true, force: true });

process.stdout.write(`Synced ${entries.length} UI files from ${sourceRoot}\n`);
