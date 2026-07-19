import fs from "node:fs/promises";

export const CARD_TYPES = [
    "방법론",
    "BP",
    "VD Request",
    "CoR",
    "기술보고서",
    "노하우",
    "Tool Manual",
    "교육자료",
    "외부 보고 자료"
];

export const PUBLICATION_STATUSES = ["초안", "검토 중", "게시", "개정 필요", "폐기"];

export const CONTEXT_VALUES = [
    "연구",
    "설계",
    "개발",
    "공정",
    "제조",
    "품질",
    "고객",
    "사업부",
    "CTO",
    "AX",
    "품질경영",
    "생산기술"
];

export const TYPE_STATUSES = {
    "방법론": ["방법론 후보", "정식 방법론", "승격 보류", "자격 해제"],
    "BP": ["BP 후보", "BP", "승격 보류", "자격 해제"],
    "VD Request": ["접수", "수행 중", "완료", "보류", "취소"],
    "CoR": ["제안", "선정·계획", "수행 중", "완료", "미선정", "중단"],
    "기술보고서": ["작성 중", "검토 중", "검토 완료", "보완 필요"],
    "노하우": ["작성 중", "검토 중", "검토 완료", "보완 필요"],
    "Tool Manual": ["작성 중", "검토 중", "검토 완료", "보완 필요"],
    "교육자료": ["작성 중", "검토 중", "검토 완료", "보완 필요"],
    "외부 보고 자료": ["작성 중", "검토 중", "검토 완료", "보완 필요"]
};

const TYPE_REQUIRED_CONTENT = {
    "방법론": ["problemAndPurpose", "technicalPrinciples", "inputsAndPrerequisites", "standardProcedure", "resultsAndCriteria", "scopeAndLimits", "validationAndReuse"],
    "BP": ["businessContext", "simulationResponse", "businessFeedback", "businessImpact", "reproductionConditions", "evidence"],
    "VD Request": ["context", "primaryQuestion", "inputsAndConstraints", "approach", "result", "judgmentScope", "limitations", "followUp"],
    "CoR": ["backgroundAndGap", "objectiveAndSuccessCriteria", "scopeAndPlan", "validationDesign", "progressDecisions", "resultAndJudgment", "outputsAndFollowUp"],
    "기술보고서": ["questionAndPurpose", "scopeAndConditions", "methodAndEvidence", "findingsAndConclusion", "validConditionsAndDecisions", "limitations", "officialSource"],
    "노하우": ["symptomAndConditions", "causeAndDiagnosis", "resolution", "effectAndEvidence", "risksAndRecovery", "versionsAndSources"],
    "Tool Manual": ["purposeAndOutput", "prerequisites", "procedure", "completionCheck", "errorsAndWarnings", "versionsAndSources"],
    "교육자료": ["learningObjectives", "audienceAndPrerequisites", "outline", "activities", "completionCriteria", "sourcesAndVersion"],
    "외부 보고 자료": ["reportPurpose", "audienceAndDecision", "approvedMessages", "sourceAssetsAndEvidence", "disclosureScope", "versionAndValidity", "limitationsAndNotes"]
};

const FRAMEWORK_DECISION_STATUSES = ["linked", "not_applicable", "target_missing"];
const FRAMEWORK_RELATION_TYPES = ["DEFINES", "TEACHES", "PRACTICES", "ENABLES", "EXAMPLE_OF", "APPLIES", "VALIDATES", "EVIDENCE_FOR", "REFERENCES"];

export async function readJson(filePath) {
    const source = await fs.readFile(filePath, "utf8");
    return JSON.parse(source.replace(/^\uFEFF/, ""));
}

export function normalizeText(value) {
    return String(value ?? "")
        .normalize("NFKC")
        .toLocaleLowerCase("ko")
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();
}

export function flattenText(value) {
    if (value === null || value === undefined) return "";
    if (Array.isArray(value)) return value.map(flattenText).join(" ");
    if (typeof value === "object") return Object.values(value).map(flattenText).join(" ");
    return String(value);
}

function hasValue(value) {
    if (Array.isArray(value)) return value.length > 0;
    if (value && typeof value === "object") return Object.keys(value).length > 0;
    return String(value ?? "").trim().length > 0;
}

function isDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ""));
}

export function validateCard(card) {
    const errors = [];
    const warnings = [];
    const suggestions = [];

    if (!card || typeof card !== "object" || Array.isArray(card)) {
        return { errors: ["카드는 JSON 객체여야 합니다."], warnings, suggestions };
    }

    const required = ["schemaVersion", "id", "type", "title", "domain", "contexts", "publicationStatus", "status", "owner", "registrant", "createdAt", "updatedAt", "summary", "useCase", "contents", "content"];
    required.forEach((field) => {
        if (!hasValue(card[field])) errors.push(`필수 필드 누락: ${field}`);
    });

    if (card.type && !CARD_TYPES.includes(card.type)) errors.push(`지원하지 않는 카드 유형: ${card.type}`);
    if (card.publicationStatus && !PUBLICATION_STATUSES.includes(card.publicationStatus)) errors.push(`지원하지 않는 게시 상태: ${card.publicationStatus}`);
    if (card.type && card.status && !(TYPE_STATUSES[card.type] ?? []).includes(card.status)) {
        errors.push(`${card.type}에서 지원하지 않는 유형별 상태: ${card.status}`);
    }
    if (card.createdAt && !isDate(card.createdAt)) errors.push("createdAt은 YYYY-MM-DD 형식이어야 합니다.");
    if (card.updatedAt && !isDate(card.updatedAt)) errors.push("updatedAt은 YYYY-MM-DD 형식이어야 합니다.");
    if (card.owner && (/파트$|팀$/.test(card.owner.trim()) || card.owner.trim() === "공통")) {
        errors.push("owner에는 파트·팀·공통이 아니라 실제 담당자 이름을 입력해야 합니다.");
    }
    if (!Array.isArray(card.contexts)) errors.push("contexts는 배열이어야 합니다.");
    if (Array.isArray(card.contexts)) {
        const invalidContexts = card.contexts.filter((value) => !CONTEXT_VALUES.includes(value));
        if (invalidContexts.length) errors.push(`지원하지 않는 활용 맥락: ${invalidContexts.join(", ")}`);
    }
    if (!Array.isArray(card.tags)) errors.push("tags는 배열이어야 합니다.");
    if (!Array.isArray(card.aliases)) errors.push("aliases는 배열이어야 합니다.");
    if (!Array.isArray(card.links)) errors.push("links는 배열이어야 합니다.");
    if (!Array.isArray(card.relations)) errors.push("relations는 배열이어야 합니다.");
    if (!Array.isArray(card.changeLog)) errors.push("changeLog는 배열이어야 합니다.");
    if (!Array.isArray(card.frameworkLinks)) errors.push("frameworkLinks는 배열이어야 합니다.");

    const frameworkLinks = Array.isArray(card.frameworkLinks) ? card.frameworkLinks : [];
    const frameworkDecisions = card.frameworkLinkDecisions ?? {};
    [
        ["technologyMap", "technology-map", "Technology Map"],
        ["learningPath", "learning-path", "Learning Path"]
    ].forEach(([decisionKey, frameworkId, label]) => {
        const decision = frameworkDecisions[decisionKey];
        const status = String(decision?.status ?? "").trim();
        const links = frameworkLinks.filter((link) => link.framework === frameworkId);
        if (!FRAMEWORK_DECISION_STATUSES.includes(status)) {
            errors.push(`${label} 연결 결정을 선택해야 합니다.`);
            return;
        }
        if (status === "linked" && links.length === 0) errors.push(`${label} 연결됨 상태에는 연결 대상이 필요합니다.`);
        if (status !== "linked" && links.length > 0) errors.push(`${label} 연결 결정과 frameworkLinks가 일치하지 않습니다.`);
        if (status !== "linked" && !String(decision?.reason ?? "").trim()) errors.push(`${label} 미연결 사유가 필요합니다.`);
    });

    const frameworkKeys = new Set();
    frameworkLinks.forEach((link) => {
        const key = `${link.framework}:${link.targetId}:${link.relationType}`;
        if (frameworkKeys.has(key)) errors.push(`중복 Framework 연결: ${key}`);
        frameworkKeys.add(key);
        if (!FRAMEWORK_RELATION_TYPES.includes(link.relationType)) errors.push(`지원하지 않는 Framework 관계: ${link.relationType}`);
        if (!String(link.targetId ?? "").trim()) errors.push("Framework 연결에는 targetId가 필요합니다.");
        if (!String(link.note ?? "").trim()) errors.push(`Framework 연결 '${link.targetId ?? "unknown"}'에는 설명이 필요합니다.`);
    });

    const requiredContent = TYPE_REQUIRED_CONTENT[card.type] ?? [];
    const missingContent = requiredContent.filter((field) => !hasValue(card.content?.[field]));

    if (card.publicationStatus === "게시") {
        if (!hasValue(card.reviewer)) errors.push("게시 카드에는 reviewer가 필요합니다.");
        if (!Array.isArray(card.links) || card.links.length === 0) errors.push("게시 카드에는 사내 원본 또는 근거 링크가 필요합니다.");
        if (missingContent.length) errors.push(`유형별 게시 필드 누락: ${missingContent.join(", ")}`);
        if (card.type === "VD Request" && card.searchReuse?.performed !== true) errors.push("게시된 VD Request는 기존 자산 검색을 완료해야 합니다.");
        const ai = card.aiAssistance ?? {};
        const structured = ai.externalStructured || ai.internalStructured || ai.internalClineStructured || ai.manualStructured;
        if (!structured || !ai.humanConfirmed) {
            errors.push("게시 카드에는 구조화 방식과 사람의 최종 확인 기록이 필요합니다.");
        }
    } else if (missingContent.length) {
        warnings.push(`초안 보완 필드: ${missingContent.join(", ")}`);
    }

    if (!card.aliases?.length) suggestions.push("검색 별칭 후보를 검토하세요.");
    if (!card.relations?.length) suggestions.push("연결 가능한 기존 자산이 있는지 확인하세요.");
    if (card.links?.some((link) => link.href === "#")) warnings.push("Placeholder 링크가 남아 있습니다.");
    if (card.demo === true) warnings.push("샘플 데이터입니다. 실제 운영 전 교체하거나 제외하세요.");

    return { errors, warnings, suggestions };
}

export function scoreCard(card, query) {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) return 0;

    const terms = normalizedQuery.split(/\s+/).filter(Boolean);
    const fields = {
        id: normalizeText(card.id),
        title: normalizeText(card.title),
        summary: normalizeText(card.summary),
        useCase: normalizeText(card.useCase),
        contexts: normalizeText(flattenText(card.contexts)),
        aliases: normalizeText(flattenText(card.aliases)),
        tags: normalizeText(flattenText(card.tags)),
        content: normalizeText(flattenText(card.content)),
        relations: normalizeText(flattenText(card.relations))
    };

    if (fields.id === normalizedQuery) return 1000;
    if (fields.title === normalizedQuery) return 900;

    let score = 0;
    let matchedTerms = 0;
    terms.forEach((term) => {
        let matched = false;
        if (fields.title.includes(term)) { score += 40; matched = true; }
        if (fields.aliases.includes(term)) { score += 26; matched = true; }
        if (fields.contexts.includes(term)) { score += 22; matched = true; }
        if (fields.tags.includes(term)) { score += 20; matched = true; }
        if (fields.summary.includes(term)) { score += 16; matched = true; }
        if (fields.useCase.includes(term)) { score += 12; matched = true; }
        if (fields.content.includes(term)) { score += 8; matched = true; }
        if (fields.relations.includes(term)) { score += 5; matched = true; }
        if (matched) matchedTerms += 1;
    });

    if (terms.length > 1 && matchedTerms < Math.min(2, terms.length)) return 0;
    if (matchedTerms === terms.length) score += 30;
    return score;
}

export function findDuplicateCandidates(card, existingCards, limit = 5) {
    const candidateTerms = new Set(normalizeText([
        card.title,
        card.summary,
        ...(card.contexts ?? []),
        ...(card.tags ?? []),
        ...(card.aliases ?? [])
    ].join(" ")).split(/\s+/).filter((term) => term.length > 1));

    return existingCards
        .filter((item) => item.id !== card.id)
        .map((item) => {
            const terms = new Set(normalizeText([item.title, item.summary, ...(item.contexts ?? []), ...(item.tags ?? []), ...(item.aliases ?? [])].join(" ")).split(/\s+/).filter((term) => term.length > 1));
            const intersection = [...candidateTerms].filter((term) => terms.has(term)).length;
            const union = new Set([...candidateTerms, ...terms]).size || 1;
            const domainBoost = item.domain === card.domain ? 0.12 : 0;
            return { id: item.id, title: item.title, type: item.type, score: Number((intersection / union + domainBoost).toFixed(3)) };
        })
        .filter((item) => item.score >= 0.12)
        .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "ko"))
        .slice(0, limit);
}
