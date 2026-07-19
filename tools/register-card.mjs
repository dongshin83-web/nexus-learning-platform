import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readJson, validateCard } from "./card-contract.mjs";
import { loadCards, serializeLibrary, validateLibrary } from "./build-library-data.mjs";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(toolsDir, "..");
const cardsDir = path.join(rootDir, "data", "cards");
const outputPath = path.join(rootDir, "team_technical_assets_data.js");

function valueAfter(flag) {
    const index = process.argv.indexOf(flag);
    return index >= 0 ? process.argv[index + 1] : "";
}

function fail(messages) {
    messages.forEach((message) => console.error(`ERROR ${message}`));
    process.exitCode = 1;
}

function validateRegistration(card, existingCards) {
    const result = validateCard(card);
    const errors = [...result.errors];
    const warnings = [...result.warnings];
    const existingIds = new Set(existingCards.map((item) => item.id));

    if (!/^[a-z0-9][a-z0-9-]*$/.test(String(card.id ?? ""))) {
        errors.push("id에는 영문 소문자, 숫자와 하이픈만 사용할 수 있습니다.");
    }
    if (card.registrationId && !/^REG-\d{14}-[A-Z0-9]{4}$/.test(card.registrationId)) {
        errors.push("registrationId 형식이 올바르지 않습니다.");
    }
    if (existingIds.has(card.id)) errors.push(`이미 존재하는 card id: ${card.id}`);

    (card.relations ?? []).forEach((relation) => {
        if (!existingIds.has(relation.targetId)) {
            errors.push(`관계 대상을 현재 Library에서 찾을 수 없음: ${relation.targetId}`);
        }
        if (!String(relation.note ?? "").trim()) {
            errors.push(`관계 '${relation.targetId ?? "unknown"}'에는 활용 설명이 필요합니다.`);
        }
    });

    (card.frameworkLinks ?? []).forEach((link) => {
        if (link.confirmed !== true) {
            errors.push(`Framework 연결 '${link.targetId ?? "unknown"}'을 확인해야 합니다.`);
        }
    });

    const foundAssetIds = card.searchReuse?.foundAssetIds ?? [];
    foundAssetIds.forEach((id) => {
        if (!existingIds.has(id)) {
            errors.push(`검색·재사용 대상을 현재 Library에서 찾을 수 없음: ${id}`);
        }
    });

    if (card.publicationStatus === "게시") {
        if (card.searchReuse?.performed !== true) {
            errors.push("게시 전 기존 Library 검색을 완료해야 합니다.");
        }
        if ((card.links ?? []).some((link) => !/^https:\/\//i.test(String(link.href ?? "")))) {
            errors.push("게시 카드의 사내 원본 링크는 https:// 주소여야 합니다.");
        }
    }

    return { errors, warnings, suggestions: result.suggestions };
}

async function main() {
    const fileArg = valueAfter("--file");
    const shouldImport = process.argv.includes("--import");
    if (!fileArg) {
        fail(["--file <등록 JSON 경로>가 필요합니다."]);
        return;
    }

    const sourcePath = path.resolve(process.cwd(), fileArg);
    let card;
    try {
        card = await readJson(sourcePath);
    } catch (error) {
        fail([`JSON을 읽을 수 없습니다: ${error.message}`]);
        return;
    }

    if (!card || typeof card !== "object" || Array.isArray(card)) {
        fail(["등록 파일은 카드 JSON 객체 하나여야 합니다."]);
        return;
    }

    const existingCards = await loadCards();
    const validation = validateRegistration(card, existingCards);
    validation.warnings.forEach((message) => console.warn(`WARN ${message}`));
    validation.suggestions.forEach((message) => console.info(`SUGGEST ${message}`));
    if (validation.errors.length) {
        fail(validation.errors);
        return;
    }

    console.log(`OK registration card: ${card.id} (${card.type})`);
    if (!shouldImport) {
        console.log("CHECK ONLY: --import를 지정하면 data/cards로 반입합니다.");
        return;
    }

    const targetPath = path.join(cardsDir, `${card.id}.json`);
    try {
        await fs.access(targetPath);
        fail([`동일한 파일이 이미 존재합니다: ${path.relative(rootDir, targetPath)}`]);
        return;
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
    }

    await fs.writeFile(targetPath, `${JSON.stringify(card, null, 2)}\n`, "utf8");
    const allCards = await loadCards();
    const libraryValidation = validateLibrary(allCards);
    if (libraryValidation.errors.length) {
        await fs.unlink(targetPath);
        fail(["반입 후 Library 검증에 실패하여 새 파일을 되돌렸습니다.", ...libraryValidation.errors]);
        return;
    }

    libraryValidation.warnings.forEach((message) => console.warn(`WARN ${message}`));
    await fs.writeFile(outputPath, serializeLibrary(allCards), "utf8");
    console.log(`IMPORTED ${path.relative(rootDir, targetPath)}`);
    console.log(`BUILT ${allCards.length} cards -> ${path.relative(rootDir, outputPath)}`);
    console.log("NEXT: git diff와 npm run check를 확인한 뒤 Branch/Merge Request로 제출하세요.");
}

await main();
