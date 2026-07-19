import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findDuplicateCandidates, readJson, validateCard } from "./card-contract.mjs";
import { loadCards } from "./build-library-data.mjs";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(toolsDir, "..");

function parseArgs(argv) {
    const args = {};
    for (let i = 0; i < argv.length; i += 1) {
        const value = argv[i];
        if (!value.startsWith("--")) continue;
        const key = value.slice(2);
        if (key === "force") args.force = true;
        else args[key] = argv[i + 1];
    }
    return args;
}

function compact(values) {
    return values.filter((value) => String(value ?? "").trim()).join(" / ");
}

const contentBuilders = {
    "VD Request": (packet, internal) => ({
        context: packet.abstractContext,
        primaryQuestion: packet.primaryQuestion,
        inputsAndConstraints: packet.inputsAndConstraints,
        approach: packet.approachOrContent,
        result: packet.observationsAndResult,
        judgmentScope: internal.judgmentScope,
        limitations: packet.limitationsAndUnknowns,
        followUp: packet.reuseOrFollowUp
    }),
    "방법론": (packet, internal) => ({
        problemAndPurpose: compact([packet.abstractContext, packet.primaryQuestion]),
        technicalPrinciples: packet.approachOrContent,
        inputsAndPrerequisites: packet.inputsAndConstraints,
        standardProcedure: internal.standardProcedure,
        resultsAndCriteria: packet.observationsAndResult,
        scopeAndLimits: [...(packet.validConditions ?? []), ...(packet.limitationsAndUnknowns ?? [])],
        validationAndReuse: [...(packet.evidenceAvailable ?? []), ...(packet.reuseOrFollowUp ?? [])]
    }),
    "BP": (packet, internal) => ({
        businessContext: compact([packet.abstractContext, packet.primaryQuestion]),
        simulationResponse: packet.approachOrContent,
        businessFeedback: internal.businessFeedback,
        businessImpact: internal.businessImpact,
        reproductionConditions: packet.validConditions,
        evidence: packet.evidenceAvailable
    }),
    "CoR": (packet, internal) => ({
        backgroundAndGap: compact([packet.abstractContext, packet.primaryQuestion]),
        objectiveAndSuccessCriteria: internal.objectiveAndSuccessCriteria,
        scopeAndPlan: internal.scopeAndPlan,
        validationDesign: internal.validationDesign,
        progressDecisions: internal.progressDecisions,
        resultAndJudgment: packet.observationsAndResult,
        outputsAndFollowUp: packet.reuseOrFollowUp
    }),
    "기술보고서": (packet, internal) => ({
        questionAndPurpose: compact([packet.primaryQuestion, packet.abstractContext]),
        scopeAndConditions: [...(packet.inputsAndConstraints ?? []), ...(packet.validConditions ?? [])],
        methodAndEvidence: compact([packet.approachOrContent, ...(packet.evidenceAvailable ?? [])]),
        findingsAndConclusion: packet.observationsAndResult,
        validConditionsAndDecisions: internal.validConditionsAndDecisions,
        limitations: packet.limitationsAndUnknowns,
        officialSource: internal.officialSource
    }),
    "노하우": (packet, internal) => ({
        symptomAndConditions: compact([packet.abstractContext, ...(packet.inputsAndConstraints ?? [])]),
        causeAndDiagnosis: internal.causeAndDiagnosis,
        resolution: packet.approachOrContent,
        effectAndEvidence: compact([packet.observationsAndResult, ...(packet.evidenceAvailable ?? [])]),
        risksAndRecovery: [...(packet.validConditions ?? []), ...(packet.limitationsAndUnknowns ?? [])],
        versionsAndSources: internal.versionsAndSources
    }),
    "Tool Manual": (packet, internal) => ({
        purposeAndOutput: compact([packet.abstractContext, packet.primaryQuestion]),
        prerequisites: packet.inputsAndConstraints,
        procedure: internal.procedure ?? packet.approachOrContent,
        completionCheck: packet.observationsAndResult,
        errorsAndWarnings: packet.limitationsAndUnknowns,
        versionsAndSources: internal.versionsAndSources
    }),
    "교육자료": (packet, internal) => ({
        learningObjectives: internal.learningObjectives ?? packet.primaryQuestion,
        audienceAndPrerequisites: internal.audienceAndPrerequisites,
        outline: packet.approachOrContent,
        activities: internal.activities,
        completionCriteria: packet.observationsAndResult,
        sourcesAndVersion: internal.sourcesAndVersion
    })
};

export function createCardFromHandoff(packet, internal) {
    if (packet.securitySelfCheck !== "pass") throw new Error("외부 Handoff Packet의 보안 자체점검이 pass가 아닙니다.");
    if (!packet.cardTypeCandidate) throw new Error("cardTypeCandidate가 없습니다.");
    if (!internal.type) throw new Error("내부에서 최종 카드 유형을 확정해야 합니다.");
    const contentBuilder = contentBuilders[internal.type];
    if (!contentBuilder) throw new Error(`지원하지 않는 카드 유형: ${internal.type}`);

    const now = internal.updatedAt ?? internal.createdAt;
    const content = { ...contentBuilder(packet, internal), ...(internal.contentOverrides ?? {}) };
    const resultSummary = packet.observationsAndResult || "결과 확인 필요";

    return {
        schemaVersion: "0.1",
        id: internal.cardId,
        type: internal.type,
        title: internal.actualTitle,
        domain: internal.domain,
        secondaryDomains: internal.secondaryDomains ?? [],
        contexts: internal.contexts ?? [],
        publicationStatus: internal.publicationStatus ?? "초안",
        status: internal.status ?? "초안",
        owner: internal.owner,
        registrant: internal.registrant,
        reviewer: internal.reviewer ?? "",
        contributors: internal.contributors ?? [],
        createdAt: internal.createdAt,
        updatedAt: now,
        tags: internal.tags ?? [],
        aliases: [...new Set([...(packet.searchTerms ?? []), ...(internal.aliases ?? [])])],
        summary: packet.abstractContext,
        useCase: packet.primaryQuestion,
        contents: compact([packet.approachOrContent, resultSummary, ...(packet.limitationsAndUnknowns ?? [])]),
        sourceIds: internal.sourceIds ?? [],
        links: internal.links ?? [],
        relations: internal.relations ?? [],
        frameworkLinks: internal.frameworkLinks ?? [],
        frameworkLinkDecisions: internal.frameworkLinkDecisions ?? {
            technologyMap: { status: "target_missing", reason: "Handoff 단계에서 연결 대상 확인 필요" },
            learningPath: { status: "target_missing", reason: "Handoff 단계에서 연결 대상 확인 필요" }
        },
        searchReuse: internal.searchReuse ?? { performed: false, foundAssetIds: [], usageType: "", outcome: "" },
        aiAssistance: {
            externalStructured: true,
            externalStructuredAt: internal.externalStructuredAt ?? internal.createdAt,
            internalClineStructured: true,
            internalClineStructuredAt: now,
            humanConfirmed: internal.humanConfirmed === true,
            confirmedBy: internal.humanConfirmed === true ? internal.registrant : ""
        },
        content,
        changeLog: [{
            changedAt: now,
            changedBy: internal.registrant,
            changeType: "생성",
            reason: "외부 AI Handoff Packet과 내부 보완정보로 샌드박스 카드 생성"
        }],
        demo: internal.demo === true
    };
}

function renderValidation(card, validation) {
    const section = (title, values, empty) => `## ${title}\n\n${values.length ? values.map((value) => `- ${value}`).join("\n") : `- ${empty}`}\n`;
    return `# ${card.id} 검증 결과\n\n${section("오류", validation.errors, "없음")}${section("경고", validation.warnings, "없음")}${section("제안", validation.suggestions, "없음")}`;
}

function renderPreview(card) {
    return `# ${card.title}\n\n- 유형: ${card.type}\n- 게시 상태: ${card.publicationStatus}\n- 유형별 상태: ${card.status}\n- 담당자: ${card.owner}\n- 등록자: ${card.registrant}\n- Reviewer: ${card.reviewer || "확인 필요"}\n- 기술영역: ${card.domain}\n- 활용 맥락: ${card.contexts.join(", ")}\n\n## 요약\n\n${card.summary}\n\n## 활용 상황\n\n${card.useCase}\n\n## 핵심 내용\n\n${card.contents}\n\n## 구조화 본문\n\n\`\`\`json\n${JSON.stringify(card.content, null, 2)}\n\`\`\`\n`;
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    if (!args.handoff || !args.internal) {
        console.error("Usage: node tools/register-handoff.mjs --handoff <packet.json> --internal <internal.json> [--force]");
        process.exitCode = 1;
        return;
    }

    const handoffPath = path.resolve(rootDir, args.handoff);
    const internalPath = path.resolve(rootDir, args.internal);
    const packet = await readJson(handoffPath);
    const internal = await readJson(internalPath);
    const card = createCardFromHandoff(packet, internal);
    const existingCards = await loadCards();
    const duplicates = findDuplicateCandidates(card, existingCards);
    const validation = validateCard(card);
    const outputCardPath = path.join(rootDir, "data", "cards", `${card.id}.json`);
    const packageDir = path.join(rootDir, "sandbox", "output", card.id);

    try {
        await fs.access(outputCardPath);
        if (!args.force) throw new Error(`${path.relative(rootDir, outputCardPath)}가 이미 있습니다. --force 없이 덮어쓰지 않습니다.`);
    } catch (error) {
        if (error.code !== "ENOENT" && !args.force) throw error;
    }

    await fs.mkdir(packageDir, { recursive: true });
    await fs.writeFile(path.join(packageDir, "preview.md"), renderPreview(card), "utf8");
    await fs.writeFile(path.join(packageDir, "validation_report.md"), renderValidation(card, validation), "utf8");
    await fs.writeFile(path.join(packageDir, "duplicate_and_relation_candidates.md"), `# 중복·관계 후보\n\n${duplicates.length ? duplicates.map((item) => `- ${item.id} | ${item.type} | ${item.title} | score ${item.score}`).join("\n") : "- 후보 없음"}\n`, "utf8");

    if (validation.errors.length) {
        console.error(`Registration blocked: ${validation.errors.length} validation error(s). See ${path.relative(rootDir, packageDir)}.`);
        process.exitCode = 1;
        return;
    }

    await fs.writeFile(outputCardPath, `${JSON.stringify(card, null, 2)}\n`, "utf8");
    console.log(`Registered sandbox card -> ${path.relative(rootDir, outputCardPath)}`);
    console.log(`Review package -> ${path.relative(rootDir, packageDir)}`);
}

if (path.resolve(process.argv[1] ?? "") === fileURLToPath(import.meta.url)) {
    await main();
}
