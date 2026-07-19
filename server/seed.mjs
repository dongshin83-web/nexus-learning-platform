import fs from "node:fs/promises";
import path from "node:path";
import { loadConfig, projectRoot } from "./config.mjs";
import { SqliteAssetStore } from "./sqlite-store.mjs";

const config = loadConfig();
const cardsDirectory = path.join(projectRoot, "data", "cards");
const files = (await fs.readdir(cardsDirectory)).filter((name) => name.endsWith(".json")).sort();
const cards = [];
for (const name of files) {
    const parsed = JSON.parse((await fs.readFile(path.join(cardsDirectory, name), "utf8")).replace(/^\uFEFF/, ""));
    if (Array.isArray(parsed)) cards.push(...parsed);
    else cards.push(parsed);
}

const store = new SqliteAssetStore({ databasePath: config.databasePath, schemaPath: path.join(projectRoot, "database", "library_schema.sqlite.sql") });
try {
    const result = store.seedCards(cards);
    console.log(JSON.stringify({ database: config.databasePath, ...result }, null, 2));
} finally {
    store.close();
}
