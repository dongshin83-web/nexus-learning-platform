import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readJson, validateCard } from "./card-contract.mjs";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(toolsDir, "..");
const cardsDir = path.join(rootDir, "data", "cards");
const outputPath = path.join(rootDir, "team_technical_assets_data.js");

export async function loadCards(directory = cardsDir) {
    const entries = (await fs.readdir(directory, { withFileTypes: true }))
        .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
        .sort((a, b) => a.name.localeCompare(b.name));

    const cards = [];
    for (const entry of entries) {
        const value = await readJson(path.join(directory, entry.name));
        if (Array.isArray(value)) cards.push(...value);
        else cards.push(value);
    }
    return cards;
}

export function validateLibrary(cards) {
    const errors = [];
    const warnings = [];
    const ids = new Set();

    cards.forEach((card) => {
        const result = validateCard(card);
        result.errors.forEach((message) => errors.push(`${card.id ?? "unknown"}: ${message}`));
        result.warnings.forEach((message) => warnings.push(`${card.id ?? "unknown"}: ${message}`));
        if (ids.has(card.id)) errors.push(`${card.id}: 중복 card id`);
        ids.add(card.id);
    });

    cards.forEach((card) => {
        (card.relations ?? []).forEach((relation) => {
            if (relation.targetId && !ids.has(relation.targetId)) warnings.push(`${card.id}: 관계 대상이 현재 샘플 데이터에 없음 (${relation.targetId})`);
        });
    });

    return { errors, warnings };
}

export function serializeLibrary(cards) {
    const sorted = [...cards].sort((a, b) => {
        const dateCompare = String(b.updatedAt).localeCompare(String(a.updatedAt));
        return dateCompare || a.title.localeCompare(b.title, "ko");
    });
    const payload = {
        schemaVersion: "1.1",
        cardCount: sorted.length,
        cards: sorted
    };
    return `window.TECHNICAL_ASSET_LIBRARY = ${JSON.stringify(payload, null, 2)};\n`;
}

async function main() {
    const checkOnly = process.argv.includes("--check");
    const cards = await loadCards();
    const validation = validateLibrary(cards);
    validation.warnings.forEach((message) => console.warn(`WARN ${message}`));
    if (validation.errors.length) {
        validation.errors.forEach((message) => console.error(`ERROR ${message}`));
        process.exitCode = 1;
        return;
    }

    const output = serializeLibrary(cards);
    if (checkOnly) {
        let current = "";
        try { current = await fs.readFile(outputPath, "utf8"); } catch {}
        if (current !== output) {
            console.error("ERROR team_technical_assets_data.js가 최신 카드 데이터와 다릅니다. npm run build:data를 실행하세요.");
            process.exitCode = 1;
            return;
        }
        console.log(`OK ${cards.length} cards; generated data is current`);
        return;
    }

    await fs.writeFile(outputPath, output, "utf8");
    console.log(`Built ${cards.length} cards -> ${path.relative(rootDir, outputPath)}`);
}

if (path.resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
    await main();
}
