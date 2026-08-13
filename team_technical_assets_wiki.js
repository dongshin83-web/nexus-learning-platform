import {
    addGitLabAssetDiscussionComment,
    loadGitLabAssetDiscussionComments,
    normalizeGitLabRegistrationConfig
} from "./team_technical_assets_gitlab.js";
import {
    deriveCorDisplayFields,
    deriveLeanAssetDisplayFields,
    deriveMethodologyDisplayFields,
    deriveVdRequestDisplayFields,
    handoffCardType,
    isLeanHandoffPacket,
    isLeanMethodologyPacket,
    normalizeLeanAssetContent,
    normalizeMethodologyContent,
    normalizeVdRequestContent,
    validateLeanHandoffPacket
} from "./team_technical_assets_handoff.mjs";
import { normalizeSearchMetadata } from "./team_technical_assets_search_metadata.mjs";

export const WIKI_STORAGE_KEY = "team-technical-assets-wiki-entries-v1";
export const WIKI_DISCUSSION_KEY = "team-technical-assets-wiki-discussions-v1";
export const WIKI_SEARCH_LOG_KEY = "team-technical-assets-wiki-search-log-v1";

export const CARD_TYPES = ["방법론", "BP", "VD Request", "CoR", "기술보고서", "외부 보고 자료", "노하우", "Tool Manual", "교육자료"];

export const TECHNOLOGY_DOMAINS = [
    { id: "deformation", label: "01. 변형", shortLabel: "변형" },
    { id: "delamination", label: "02. 박리", shortLabel: "박리" },
    { id: "impact", label: "03. 충격", shortLabel: "충격" },
    { id: "thermal-flow", label: "04. 열유동", shortLabel: "열유동" },
    { id: "fatigue", label: "05. 피로", shortLabel: "피로" },
    { id: "vibration", label: "06. 진동", shortLabel: "진동" },
    { id: "other", label: "07. 기타", shortLabel: "기타" }
];

export const DOMAIN_LABELS = Object.fromEntries(TECHNOLOGY_DOMAINS.map((domain) => [domain.id, domain.shortLabel]));

export const CONTEXT_OPTIONS = [
    { value: "연구", group: "업무 단계" },
    { value: "설계", group: "업무 단계" },
    { value: "개발", group: "업무 단계" },
    { value: "공정", group: "업무 단계" },
    { value: "제조", group: "업무 단계" },
    { value: "품질", group: "업무 단계" },
    { value: "고객", group: "대응 대상" },
    { value: "사업부", group: "대응 대상" },
    { value: "CTO", group: "대응 대상" },
    { value: "AX", group: "대응 대상" },
    { value: "품질경영", group: "대응 대상" },
    { value: "생산기술", group: "대응 대상" }
];

const WORKFLOW_STAGES = CONTEXT_OPTIONS.filter((context) => context.group === "업무 단계");
const RESPONSE_TARGETS = CONTEXT_OPTIONS.filter((context) => context.group === "대응 대상");
const SEARCH_INDEX_CACHE = new WeakMap();

const FIELD_LABELS = {
    context: "상황",
    primaryQuestion: "판단 질문",
    inputsAndConstraints: "입력·제약조건",
    approach: "접근 방법",
    result: "결과·결론",
    judgmentScope: "판단 범위",
    limitations: "한계",
    followUp: "후속 활용",
    problemAndPurpose: "문제와 목적",
    technicalPrinciples: "기술 원리",
    inputsAndPrerequisites: "입력·선행조건",
    standardProcedure: "표준 절차",
    resultsAndCriteria: "결과와 판단 기준",
    scopeAndLimits: "적용범위와 한계",
    businessContext: "사업 맥락",
    simulationResponse: "Simulation 대응",
    reproductionConditions: "재현 조건",
    evidence: "근거",
    questionAndPurpose: "기술 질문과 목적",
    scopeAndConditions: "범위와 조건",
    methodAndEvidence: "방법과 근거",
    findingsAndConclusion: "관찰과 결론",
    knowhowCategory: "노하우 유형",
    purposeAndOutput: "목적과 결과물",
    prerequisites: "사전조건",
    procedure: "실행 절차",
    learningObjectives: "학습목표",
    outline: "구성",
    completionCriteria: "완료 기준",
    reportPurpose: "보고 목적",
    audienceAndDecision: "대상과 의사결정",
    approvedMessages: "핵심 메시지",
    sourceAssetsAndEvidence: "근거 자산",
    disclosureScope: "공유 범위",
    limitationsAndNotes: "한계와 주의사항",
    internalSupplement: "사내 보완 내용",
    internalLimitations: "사내 확인 적용범위·한계",
    activities: "실습·활동",
    audienceAndPrerequisites: "대상과 사전조건",
    backgroundAndGap: "배경과 차이",
    businessFeedback: "사업 피드백",
    businessImpact: "사업 영향",
    causeAndDiagnosis: "원인과 진단",
    completionCheck: "완료 확인",
    effectAndEvidence: "효과와 근거",
    errorsAndWarnings: "오류와 주의사항",
    objectiveAndSuccessCriteria: "목표와 성공 기준",
    officialSource: "공식 원본",
    sourceAndRelationRoles: "원문·근거·관련 자산의 역할",
    outputsAndFollowUp: "산출물과 후속조치",
    progressDecisions: "진행 중 의사결정",
    resolution: "해결 방법",
    resultAndJudgment: "결과와 판단",
    risksAndRecovery: "위험과 복구",
    scopeAndPlan: "범위와 계획",
    sourcesAndVersion: "출처와 버전",
    symptomAndConditions: "현상과 조건",
    validationAndReuse: "검증과 재사용",
    validationDesign: "검증 설계",
    validConditionsAndDecisions: "유효 조건과 의사결정",
    versionAndValidity: "버전과 유효성",
    versionsAndSources: "버전과 출처"
};

export function normalizeText(value) {
    return String(value ?? "")
        .normalize("NFKC")
        .toLocaleLowerCase("ko")
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();
}

export function slugify(value) {
    return String(value ?? "")
        .normalize("NFKD")
        .toLocaleLowerCase("en")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 72);
}

export function decodeWikiHash(hash) {
    try {
        return decodeURIComponent(String(hash ?? "").replace(/^#/, ""));
    } catch {
        return "";
    }
}

function unique(values) {
    return [...new Set(asArray(values).map((value) => String(value ?? "").trim()).filter(Boolean))];
}

function asArray(value) {
    if (Array.isArray(value)) return value;
    if (value === undefined || value === null || value === "") return [];
    return [value];
}

function flattenValue(value) {
    if (Array.isArray(value)) return value.map(flattenValue).join(" ");
    if (value && typeof value === "object") return Object.values(value).map(flattenValue).join(" ");
    return String(value ?? "");
}

function toDateString(value = new Date()) {
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.valueOf())) return new Date().toISOString().slice(0, 10);
    return date.toISOString().slice(0, 10);
}

function makeUniqueId(title, existingEntries, now = new Date()) {
    const existingIds = new Set((existingEntries ?? []).map((entry) => entry.id));
    const base = slugify(title) || `wiki-${now.valueOf()}`;
    if (!existingIds.has(base)) return base;
    let suffix = 2;
    while (existingIds.has(`${base}-${suffix}`)) suffix += 1;
    return `${base}-${suffix}`;
}

function text(value) {
    return String(value ?? "").trim();
}

function normalizeDomainId(value) {
    return value === "thermal" ? "thermal-flow" : value;
}

function domainLabel(value) {
    const normalized = normalizeDomainId(value);
    return DOMAIN_LABELS[normalized] ?? (text(normalized) || "기타");
}

function normalizeHttpUrl(value) {
    const source = text(value);
    if (!source) return "";
    try {
        const url = new URL(source);
        return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
        return "";
    }
}

function packetType(packet, fallback = "노하우") {
    const candidate = handoffCardType(packet);
    return CARD_TYPES.includes(candidate) ? candidate : fallback;
}

export function buildWikiEntry(packet = {}, input = {}, existingEntries = [], now = new Date()) {
    const candidates = normalizeSearchMetadata(packet);
    const cardType = handoffCardType(packet);
    const displayFields = isLeanHandoffPacket(packet)
        ? deriveLeanAssetDisplayFields(packet)
        : (cardType === "VD Request"
        ? deriveVdRequestDisplayFields(packet)
        : (cardType === "CoR"
            ? deriveCorDisplayFields(packet)
            : (isLeanMethodologyPacket(packet)
                ? deriveMethodologyDisplayFields(packet)
                : { summary: "", useCase: "", contents: "" })));
    const title = text(input.title ?? packet.workingTitle ?? packet.title) || "제목 없는 기술자산";
    const type = CARD_TYPES.includes(input.type) ? input.type : packetType(packet);
    const requestedDomain = normalizeDomainId(input.domain);
    const packetDomain = normalizeDomainId(candidates.primaryDomainCandidate || packet.domain);
    const domain = Object.hasOwn(DOMAIN_LABELS, requestedDomain) ? requestedDomain : (Object.hasOwn(DOMAIN_LABELS, packetDomain) ? packetDomain : "other");
    const summary = text(input.summary) || text(displayFields.summary) || text(packet.abstractContext ?? packet.summary);
    const useCase = text(input.useCase) || text(displayFields.useCase) || text(packet.primaryQuestion ?? packet.useCase);
    const packetContents = [packet.approachOrContent, packet.observationsAndResult].map(text).filter(Boolean).join("\n\n");
    const contents = text(input.contents ?? packet.contents) || displayFields.contents || packetContents;
    const registrant = text(input.registrant ?? packet.registrant) || "현재 사용자";
    const owner = text(input.owner ?? packet.owner) || registrant;
    const sourceLabel = text(input.sourceLabel);
    const sourceUrl = normalizeHttpUrl(input.sourceUrl);
    const date = toDateString(now);
    const facets = packet.searchMetadata?.facets ?? packet.searchMetadata?.searchFacets ?? {};
    const packetTags = unique([
        ...candidates.visibleTags,
        ...asArray(facets.problemPhenomena),
        ...asArray(facets.productStructureProcess),
        ...asArray(facets.toolModelData),
        ...asArray(packet.searchTerms ?? packet.tags)
    ]);
    const inputTags = String(input.tags ?? "").split(",");
    const packetRelations = Array.isArray(packet.relations)
        ? packet.relations
        : asArray(packet.relatedAssetCandidates).map((candidate) => ({ type: "REFERENCES", targetId: text(candidate), note: "AI Handoff에서 제안된 관련 자산" })).filter((relation) => relation.targetId);
    const inputRelations = String(input.relatedAssets ?? "").split(",").map(text).filter(Boolean).map((targetId) => ({ type: "REFERENCES", targetId, note: "사내 등록 단계에서 연결" }));
    const relationKeys = new Set();
    const relations = [...packetRelations, ...inputRelations].filter((relation) => {
        const key = `${text(relation.type) || "REFERENCES"}:${text(relation.targetId)}`;
        if (!text(relation.targetId) || relationKeys.has(key)) return false;
        relationKeys.add(key);
        return true;
    });
    const baseContent = isLeanHandoffPacket(packet)
        ? normalizeLeanAssetContent(packet)
        : (cardType === "VD Request"
        ? normalizeVdRequestContent(packet)
        : (isLeanMethodologyPacket(packet)
            ? normalizeMethodologyContent(packet)
            : (packet.typeSpecific && typeof packet.typeSpecific === "object" ? packet.typeSpecific : (packet.content ?? {}))));
    const content = baseContent && typeof baseContent === "object" && !Array.isArray(baseContent) ? { ...baseContent } : {};
    if (text(input.typeSpecificNotes)) content.internalSupplement = text(input.typeSpecificNotes);
    if (text(input.limitations)) content.internalLimitations = String(input.limitations).split("\n").map(text).filter(Boolean);

    return {
        schemaVersion: "wiki-local-0.1",
        id: makeUniqueId(title, existingEntries, now instanceof Date ? now : new Date(now)),
        type,
        title,
        domain,
        secondaryDomains: unique(candidates.secondaryDomainCandidates ?? packet.secondaryDomains ?? []).map(normalizeDomainId),
        owner,
        registrant,
        contributors: unique(packet.contributors ?? []),
        createdAt: date,
        updatedAt: date,
        tags: unique([...packetTags, ...inputTags]),
        contexts: unique([
            ...candidates.workflowStageCandidates,
            ...candidates.responseTargetCandidates,
            ...asArray(packet.contexts),
            ...String(input.contexts ?? "").split(",")
        ]),
        aliases: unique(candidates.aliases ?? packet.aliases ?? []),
        searchMetadata: {
            expectedQueries: unique(candidates.expectedQueries)
        },
        summary,
        useCase,
        contents,
        sourceIds: unique(packet.sourceIds ?? []),
        links: sourceUrl ? [{ label: sourceLabel || "사내 원본", href: sourceUrl, type: "원본", status: "정상" }] : [],
        relations,
        content,
        aiAssistance: {
            externalStructured: true,
            humanConfirmed: true
        },
        registrationSource: {
            method: "local-wiki-ai-handoff",
            packetVersion: text(packet.packetVersion) || "확인 필요"
        },
        localOnly: true
    };
}

function selectionSet(value) {
    if (value instanceof Set) return value;
    if (Array.isArray(value)) return new Set(value);
    if (!value || value === "all") return new Set();
    return new Set([value]);
}

function getSearchFields(entry) {
    if (SEARCH_INDEX_CACHE.has(entry)) return SEARCH_INDEX_CACHE.get(entry);
    const domainId = normalizeDomainId(entry.domain);
    const fields = {
        id: normalizeText(entry.id),
        title: normalizeText(entry.title),
        aliases: normalizeText(flattenValue(entry.aliases)),
        contexts: normalizeText(flattenValue(entry.contexts)),
        tags: normalizeText(flattenValue(entry.tags)),
        summary: normalizeText(entry.summary),
        useCase: normalizeText(entry.useCase),
        contents: normalizeText(entry.contents),
        content: normalizeText(flattenValue(entry.content)),
        relations: normalizeText(flattenValue(entry.relations)),
        links: normalizeText(flattenValue(entry.links)),
        expectedQueries: normalizeText(flattenValue(entry.searchMetadata?.expectedQueries)),
        domain: normalizeText([DOMAIN_LABELS[domainId] ?? domainId, domainId].join(" "))
    };
    SEARCH_INDEX_CACHE.set(entry, fields);
    return fields;
}

export function getWikiSearchScore(entry, query) {
    const normalizedQuery = normalizeText(query);
    if (!normalizedQuery) return 0;
    const terms = normalizedQuery.split(/\s+/).filter(Boolean);
    const fields = getSearchFields(entry);
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
        if (fields.contents.includes(term)) { score += 8; matched = true; }
        if (fields.content.includes(term)) { score += 8; matched = true; }
        if (fields.relations.includes(term)) { score += 5; matched = true; }
        if (fields.links.includes(term)) { score += 4; matched = true; }
        if (fields.expectedQueries.includes(term)) { score += 18; matched = true; }
        if (fields.domain.includes(term)) { score += 4; matched = true; }
        if (matched) matchedTerms += 1;
    });
    if (terms.length > 1 && matchedTerms < Math.min(2, terms.length)) return 0;
    if (matchedTerms === terms.length) score += 30;
    return score;
}

export function getWikiMatchedFields(entry, query) {
    const terms = normalizeText(query).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    const fields = getSearchFields(entry);
    const labels = {
        id: "ID",
        title: "제목",
        aliases: "검색별칭",
        contexts: "분류",
        tags: "태그",
        summary: "요약",
        useCase: "판단 질문",
        contents: "본문",
        content: "세부 본문",
        relations: "관련 자산",
        links: "원본 링크",
        expectedQueries: "예상 검색문장",
        domain: "기술영역"
    };
    return Object.entries(fields)
        .filter(([, value]) => terms.some((term) => value.includes(term)))
        .map(([key]) => labels[key]);
}

function matchesContext(entry, selectedValues) {
    return selectedValues.size === 0 || asArray(entry.contexts).some((context) => selectedValues.has(context));
}

export function searchWikiEntries(entries, filters = {}) {
    const query = text(filters.search);
    const domains = selectionSet(filters.domains ?? filters.domain);
    const stages = selectionSet(filters.stages);
    const targets = selectionSet(filters.targets);
    const selectedType = filters.type ?? "all";
    const publication = filters.publication ?? "all";
    const sort = filters.sort ?? "relevance";

    return [...(entries ?? [])]
        .map((entry) => ({ entry, score: getWikiSearchScore(entry, query) }))
        .filter(({ entry, score }) => {
            const primaryDomain = normalizeDomainId(entry.domain);
            const secondaryDomains = asArray(entry.secondaryDomains).map(normalizeDomainId);
            return (!query || score > 0)
                && (filters.includeRetired === true || !text(entry.retiredAt))
                && (selectedType === "all" || entry.type === selectedType)
                && (publication === "all" || (publication === "published" ? entry.publicationStatus === "게시" : entry.publicationStatus !== "게시"))
                && (domains.size === 0 || domains.has(primaryDomain) || secondaryDomains.some((domain) => domains.has(domain)))
                && matchesContext(entry, stages)
                && matchesContext(entry, targets);
        })
        .sort((a, b) => {
            if (sort === "owner") return text(a.entry.owner || a.entry.registrant).localeCompare(text(b.entry.owner || b.entry.registrant), "ko") || String(b.entry.updatedAt ?? "").localeCompare(String(a.entry.updatedAt ?? ""));
            if (sort === "updated") return String(b.entry.updatedAt ?? "").localeCompare(String(a.entry.updatedAt ?? ""));
            if (sort === "title") return text(a.entry.title).localeCompare(text(b.entry.title), "ko");
            if (query) return b.score - a.score || String(b.entry.updatedAt ?? "").localeCompare(String(a.entry.updatedAt ?? ""));
            return String(b.entry.updatedAt ?? "").localeCompare(String(a.entry.updatedAt ?? ""));
        });
}

export function filterWikiEntries(entries, filters = {}) {
    return searchWikiEntries(entries, filters).map(({ entry }) => entry);
}

const REUSE_RELATION_TYPES = new Set(["USES", "ADAPTS", "REFERENCES", "VALIDATES", "EVIDENCE_FOR", "TEACHES", "PRACTICES", "BASED_ON"]);

export function buildIncomingReuseCounts(entries = []) {
    const counts = new Map(entries.map((entry) => [entry.id, 0]));
    entries.forEach((candidate) => {
        const usageType = text(candidate.searchReuse?.usageType);
        const reusedIds = new Set([
            ...(usageType && usageType !== "적합 자산 없음" ? asArray(candidate.searchReuse?.foundAssetIds) : []),
            ...asArray(candidate.relations)
                .filter((relation) => REUSE_RELATION_TYPES.has(relation?.type) && relation?.status !== "해제")
                .map((relation) => relation?.targetId)
        ].filter(Boolean));
        reusedIds.forEach((targetId) => {
            if (targetId !== candidate.id && counts.has(targetId)) counts.set(targetId, (counts.get(targetId) ?? 0) + 1);
        });
    });
    return counts;
}

function markdownList(values) {
    const list = asArray(values).map(text).filter(Boolean);
    return list.length ? list.map((item) => `- ${item}`).join("\n") : "- 해당 없음";
}

function markdownValue(value, depth = 0) {
    if (Array.isArray(value)) {
        const items = value.map((item) => markdownValue(item, depth + 1)).filter(Boolean);
        return items.length ? items.map((item) => `- ${item.replace(/\n/g, "\n  ")}`).join("\n") : "해당 없음";
    }
    if (value && typeof value === "object") {
        return Object.entries(value)
            .map(([key, item]) => `${"  ".repeat(depth)}- **${FIELD_LABELS[key] ?? key}**: ${markdownValue(item, depth + 1)}`)
            .join("\n");
    }
    return text(value);
}

function contentToMarkdown(content) {
    if (!content || typeof content !== "object" || Array.isArray(content)) return "기록된 유형별 세부 내용이 없습니다.";
    const sections = Object.entries(content)
        .map(([key, value]) => ({ label: FIELD_LABELS[key] ?? key, value: markdownValue(value) }))
        .filter((entry) => entry.value && entry.value !== "확인 필요");
    return sections.length ? sections.map((entry) => `### ${entry.label}\n\n${entry.value}`).join("\n\n") : "기록된 유형별 세부 내용이 없습니다.";
}

const REQUIRED_EVIDENCE_STATUS_LABELS = {
    confirmed: "확인 완료",
    deferred: "추후 확인",
    not_applicable: "해당 없음"
};

function requiredEvidenceToMarkdown(entry) {
    if (text(entry.type) !== "VD Request") return "";
    const requiredEvidence = entry.internalCompletion?.requiredEvidence || {};
    const rows = [
        ["요청자 피드백", requiredEvidence.requesterFeedback],
        ["의사결정 영향", requiredEvidence.decisionImpact]
    ].map(([label, decision]) => {
        const status = REQUIRED_EVIDENCE_STATUS_LABELS[text(decision?.status)] || "미선택";
        const note = text(decision?.note) || (status === "확인 완료" ? "실제 내용 확인" : "사유 미기록");
        return `| ${label} | ${status} | ${note} |`;
    }).join("\n");
    return `## 요청자 피드백·의사결정 영향 확인 상태

| 항목 | 상태 | 사유·후속 확인 계획 |
| --- | --- | --- |
${rows}`;
}

export function wikiEntryToMarkdown(entry) {
    const type = text(entry.type) || "기술자산";
    const domain = domainLabel(entry.domain);
    const tags = unique(entry.tags ?? []).join(", ") || "해당 없음";
    const aliases = unique(entry.aliases ?? []).join(", ") || "해당 없음";
    const expectedQueries = unique(entry.searchMetadata?.expectedQueries ?? []).join(" / ") || "해당 없음";
    const links = (entry.links ?? []).length
        ? entry.links.map((link) => `| ${text(link.label)} | ${text(link.type) || "원본"} | ${text(link.href)} |`).join("\n")
        : "| 해당 없음 | - | - |";
    const relations = (entry.relations ?? []).length
        ? entry.relations.map((relation) => `| ${text(relation.type) || "REFERENCES"} | ${text(relation.targetId)} | ${text(relation.note)} |`).join("\n")
        : "| 해당 없음 | - | - |";

    return `# [${type}] ${text(entry.title)}

> ${text(entry.summary)}

## 기본 정보

| 항목 | 내용 |
| --- | --- |
| 자산유형 | ${type} |
| 주 기술영역 | ${domain} |
| 보조 기술영역 | ${asArray(entry.secondaryDomains).map(domainLabel).join(", ") || "해당 없음"} |
| 게시 상태 | ${text(entry.publicationStatus) || "미기록"} |
| 유형별 상태 | ${text(entry.status) || "미기록"} |
| Owner | ${text(entry.owner)} |
| 등록자 | ${text(entry.registrant)} |
| 검토자 | ${text(entry.reviewer) || "미지정"} |
| 등록일 | ${text(entry.createdAt)} |
| 최근 수정 | ${text(entry.updatedAt)} |
| 기존 card_id | ${text(entry.id)} |

## 문제 상황과 판단 질문

${text(entry.useCase)}

## 접근 방법·핵심 내용

${text(entry.contents)}

## 유형별 세부 내용

${contentToMarkdown(entry.content)}

${requiredEvidenceToMarkdown(entry)}

## 검색 정보

- 검색 태그: ${tags}
- 검색 별칭: ${aliases}
- 예상 검색문장: ${expectedQueries}
- 활용 맥락: ${unique(entry.contexts ?? []).join(", ") || "해당 없음"}

## 검색·재사용 기록

- 기존 자산 검색: ${entry.searchReuse?.performed ? "수행" : "미기록"}
- 활용 유형·판단: ${text(entry.searchReuse?.usageType || entry.searchReuse?.decision) || "미기록"}
- 결과·사유: ${text(entry.searchReuse?.outcome || entry.searchReuse?.reason) || "미기록"}
- 연결 자산: ${unique(entry.searchReuse?.foundAssetIds ?? []).join(", ") || "해당 없음"}

## 사내 원본 링크

| 링크명 | 유형 | URL·경로 |
| --- | --- | --- |
${links}

## 관련 자산

| 관계유형 | 대상 | 설명 |
| --- | --- | --- |
${relations}

## 적용범위·한계·후속 활용

${markdownList(entry.content?.internalLimitations ?? entry.content?.limitations ?? entry.content?.scopeAndLimits ?? entry.content?.limitationsAndNotes)}

/label ~"library-item" ~"type/${type}" ~"tech/${domain}"
`;
}

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function escapeMultiline(value) {
    return escapeHtml(value).replace(/\n/g, "<br>");
}

function safeHref(value) {
    try {
        const url = new URL(value);
        return ["http:", "https:"].includes(url.protocol) ? url.href : "";
    } catch {
        return "";
    }
}

function contentValue(value) {
    if (Array.isArray(value)) return value.map((item) => contentValue(item)).filter(Boolean).join("\n");
    if (value && typeof value === "object") {
        return Object.entries(value)
            .map(([key, item]) => `${FIELD_LABELS[key] ?? key}: ${contentValue(item)}`)
            .filter((item) => !item.endsWith(": "))
            .join("\n");
    }
    return text(value);
}

function contentEntries(content) {
    if (!content || typeof content !== "object") return [];
    return Object.entries(content)
        .map(([key, value]) => ({ label: FIELD_LABELS[key] ?? key, value: contentValue(value) }))
        .filter((entry) => entry.value && entry.value !== "확인 필요");
}

function readStorage(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key));
        return value ?? fallback;
    } catch {
        return fallback;
    }
}

function writeStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch {
        return false;
    }
}

function copyText(value) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(value);
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied ? Promise.resolve() : Promise.reject(new Error("copy failed"));
}

function extractJson(raw) {
    const source = text(raw);
    const fenced = source.match(/```(?:json)?\s*([\s\S]*?)```/i);
    return JSON.parse(fenced ? fenced[1].trim() : source);
}

export function parseHandoffPacket(raw) {
    const packet = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : extractJson(raw);
    if (!packet || typeof packet !== "object" || Array.isArray(packet)) throw new Error("Handoff JSON 객체가 아닙니다.");
    if (!text(packet.packetVersion)) throw new Error("packetVersion이 없습니다.");
    if (text(packet.packetVersion) === "0.3") {
        const errors = validateLeanHandoffPacket(packet);
        if (errors.length) throw new Error(`Lean v0.3 검증 실패: ${errors.join(" / ")}`);
        return packet;
    }
    if (text(packet.packetVersion) !== "0.2") throw new Error("VD Request·CoR·방법론 Lean v0.3 또는 기존 v0.2 Handoff만 반입할 수 있습니다.");
    if (!CARD_TYPES.includes(text(packet.cardTypeCandidate))) throw new Error("지원하는 cardTypeCandidate가 아닙니다.");
    if (packet.securitySelfCheck !== "pass") throw new Error("v0.2 securitySelfCheck가 pass인 Handoff JSON만 반입할 수 있습니다.");
    if (!packet.typeSpecific || typeof packet.typeSpecific !== "object" || Array.isArray(packet.typeSpecific)) throw new Error("v0.2 typeSpecific 구조가 없습니다.");
    return packet;
}

export function handoffTypeMatches(packet, selectedType) {
    if (!packet) return true;
    return handoffCardType(packet) === text(selectedType);
}

function downloadText(filename, value, type) {
    const blob = new Blob([value], { type });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(anchor.href);
}

function formatCommentDate(value) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? text(value) : date.toLocaleString("ko-KR", { hour12: false });
}

function initializeWiki() {
    const allEntries = Array.isArray(window.TECHNICAL_ASSET_LIBRARY?.cards) ? window.TECHNICAL_ASSET_LIBRARY.cards : [];
    const storedDiscussions = readStorage(WIKI_DISCUSSION_KEY, {});
    let discussions = storedDiscussions && typeof storedDiscussions === "object" && !Array.isArray(storedDiscussions) ? storedDiscussions : {};
    const incomingReuseCounts = buildIncomingReuseCounts(allEntries);
    let selectedId = "";
    let currentPage = 1;
    const pageSize = 50;
    const gitlabDiscussionConfig = normalizeGitLabRegistrationConfig(window.TECHNICAL_ASSET_GITLAB_CONFIG || {});
    const gitlabDiscussionEnabled = Boolean(gitlabDiscussionConfig.baseUrl && gitlabDiscussionConfig.projectId);
    let gitlabDiscussionToken = "";
    let toastTimer = null;
    let searchTimer = null;
    let logTimer = null;
    const selectedDomains = new Set();
    const selectedStages = new Set();
    const selectedTargets = new Set();

    const list = document.getElementById("wiki-entry-list");
    const article = document.getElementById("wiki-article");
    const search = document.getElementById("wiki-search");
    const typeFilter = document.getElementById("wiki-type-filter");
    const sortFilter = document.getElementById("wiki-sort-filter");
    const pagination = document.getElementById("wiki-pagination");
    const detailDialog = document.getElementById("wiki-detail-dialog");
    const filterForm = search?.closest("form");
    if (!list || !article || !search || !typeFilter || !sortFilter || !pagination || !detailDialog) return;

    function showToast(message) {
        const toast = document.getElementById("wiki-toast");
        window.clearTimeout(toastTimer);
        toast.textContent = message;
        toast.hidden = false;
        toastTimer = window.setTimeout(() => { toast.hidden = true; }, 3600);
    }

    function currentFilters() {
        return {
            search: search.value,
            type: typeFilter.value,
            domains: selectedDomains,
            stages: selectedStages,
            targets: selectedTargets,
            sort: sortFilter.value
        };
    }

    function scheduleSearchLog(resultCount) {
        const filters = currentFilters();
        const hasCondition = text(filters.search) || filters.type !== "all" || filters.domains.size || filters.stages.size || filters.targets.size;
        if (!hasCondition) return;
        window.clearTimeout(logTimer);
        logTimer = window.setTimeout(() => {
            const record = {
                schemaVersion: "1.0",
                searchedAt: new Date().toISOString(),
                query: text(filters.search),
                type: filters.type,
                domains: [...filters.domains],
                workflowStages: [...filters.stages],
                responseTargets: [...filters.targets],
                sort: filters.sort,
                resultCount
            };
            const previous = readStorage(WIKI_SEARCH_LOG_KEY, []);
            const next = [...(Array.isArray(previous) ? previous : []), record].slice(-500);
            writeStorage(WIKI_SEARCH_LOG_KEY, next);
        }, 600);
    }

    function renderMetrics() {
        document.getElementById("wiki-total-count").textContent = String(allEntries.length);
        document.getElementById("wiki-published-count").textContent = String(allEntries.filter((entry) => entry.publicationStatus === "게시").length);
        document.getElementById("wiki-reused-count").textContent = String(allEntries.filter((entry) => (incomingReuseCounts.get(entry.id) ?? 0) > 0).length);
        const indexStatus = document.getElementById("wiki-index-status");
        if (indexStatus) {
            const generatedAt = text(window.TECHNICAL_ASSET_LIBRARY?.generatedAt);
            const sourceCommit = text(window.TECHNICAL_ASSET_LIBRARY?.sourceWikiCommit);
            if (generatedAt) {
                const date = new Date(generatedAt);
                const displayDate = Number.isNaN(date.getTime())
                    ? generatedAt
                    : date.toLocaleString("ko-KR", { hour12: false });
                indexStatus.textContent = `마지막 Index ${displayDate}${sourceCommit ? ` · Wiki ${sourceCommit.slice(0, 8)}` : ""}`;
            } else {
                indexStatus.textContent = "현재는 로컬 예시 데이터 · 운영 전환 후 Wiki Index 시각 표시";
            }
        }
    }

    function renderFacetGroup(containerId, group, options, selected, candidates, matches) {
        const container = document.getElementById(containerId);
        const optionMarkup = options.map((option) => {
            const value = option.id ?? option.value;
            const label = option.label ?? option.value;
            const count = candidates.filter((entry) => matches(entry, value)).length;
            const active = selected.has(value);
            return `<button class="wiki-filter-chip${active ? " is-selected" : ""}" type="button" data-wiki-facet="${group}" data-wiki-facet-value="${escapeHtml(value)}" aria-pressed="${active}"${count === 0 && !active ? " disabled" : ""}><span>${escapeHtml(label)}</span><small>${count}</small></button>`;
        }).join("");
        container.innerHTML = `<button class="wiki-filter-chip${selected.size === 0 ? " is-selected" : ""}" type="button" data-wiki-facet="${group}" data-wiki-facet-value="all" aria-pressed="${selected.size === 0}"><span>전체</span><small>${candidates.length}</small></button>${optionMarkup}`;
    }

    function renderFacets() {
        const filters = currentFilters();
        const domainCandidates = searchWikiEntries(allEntries, { ...filters, domains: new Set() }).map(({ entry }) => entry);
        const stageCandidates = searchWikiEntries(allEntries, { ...filters, stages: new Set() }).map(({ entry }) => entry);
        const targetCandidates = searchWikiEntries(allEntries, { ...filters, targets: new Set() }).map(({ entry }) => entry);
        renderFacetGroup("wiki-domain-chips", "domains", TECHNOLOGY_DOMAINS, selectedDomains, domainCandidates, (entry, value) => [normalizeDomainId(entry.domain), ...asArray(entry.secondaryDomains).map(normalizeDomainId)].includes(value));
        renderFacetGroup("wiki-stage-chips", "stages", WORKFLOW_STAGES, selectedStages, stageCandidates, (entry, value) => asArray(entry.contexts).includes(value));
        renderFacetGroup("wiki-target-chips", "targets", RESPONSE_TARGETS, selectedTargets, targetCandidates, (entry, value) => asArray(entry.contexts).includes(value));
    }

    function activeFilterSummary(total) {
        const parts = [];
        if (text(search.value)) parts.push(`“${text(search.value)}”`);
        if (typeFilter.value !== "all") parts.push(typeFilter.value);
        if (selectedDomains.size) parts.push([...selectedDomains].map(domainLabel).join(" 또는 "));
        if (selectedStages.size) parts.push([...selectedStages].join(" 또는 "));
        if (selectedTargets.size) parts.push([...selectedTargets].join(" 또는 "));
        const start = total ? (currentPage - 1) * pageSize + 1 : 0;
        const end = Math.min(currentPage * pageSize, total);
        return `${parts.length ? `${parts.join(" · ")} 조건` : "전체 기술자산"} · ${start}-${end} 표시`;
    }

    function renderPagination(pageCount) {
        if (pageCount <= 1) {
            pagination.hidden = true;
            pagination.innerHTML = "";
            return;
        }
        const visiblePages = new Set([1, pageCount]);
        for (let page = Math.max(1, currentPage - 2); page <= Math.min(pageCount, currentPage + 2); page += 1) visiblePages.add(page);
        const pages = [...visiblePages].sort((a, b) => a - b);
        let previous = 0;
        const pageButtons = pages.map((page) => {
            const gap = previous && page - previous > 1 ? '<span class="wiki-pagination-gap" aria-hidden="true">…</span>' : "";
            previous = page;
            return `${gap}<button type="button" data-wiki-page="${page}"${page === currentPage ? ' class="is-current" aria-current="page"' : ""}>${page}</button>`;
        }).join("");
        pagination.hidden = false;
        pagination.innerHTML = `<button type="button" data-wiki-page="${currentPage - 1}"${currentPage === 1 ? " disabled" : ""} aria-label="이전 페이지"><i class="bx bx-chevron-left"></i><span>이전</span></button>${pageButtons}<button type="button" data-wiki-page="${currentPage + 1}"${currentPage === pageCount ? " disabled" : ""} aria-label="다음 페이지"><span>다음</span><i class="bx bx-chevron-right"></i></button>`;
    }

    function renderList() {
        const results = searchWikiEntries(allEntries, currentFilters());
        const pageCount = Math.max(1, Math.ceil(results.length / pageSize));
        currentPage = Math.min(currentPage, pageCount);
        const pageResults = results.slice((currentPage - 1) * pageSize, currentPage * pageSize);
        document.getElementById("wiki-result-count").textContent = String(results.length);
        document.getElementById("wiki-result-context").textContent = activeFilterSummary(results.length);
        list.innerHTML = pageResults.length ? pageResults.map(({ entry }) => {
            const tags = unique(entry.tags ?? []).slice(0, 3);
            const matchedFields = getWikiMatchedFields(entry, search.value).slice(0, 4);
            const reuseCount = incomingReuseCounts.get(entry.id) ?? 0;
            return `<li class="wiki-result-card${entry.id === selectedId ? " is-selected" : ""}"><button type="button" data-wiki-entry="${escapeHtml(entry.id)}" aria-label="${escapeHtml(entry.title)} 상세 보기">
                <span class="wiki-result-card-badges"><span class="wiki-type-badge" data-asset-type="${escapeHtml(entry.type)}">${escapeHtml(entry.type)}</span><span>${escapeHtml(domainLabel(entry.domain))}</span><span>${escapeHtml(entry.publicationStatus || "상태 미기록")}</span>${reuseCount ? `<span>재사용 ${reuseCount}</span>` : ""}</span>
                <strong class="wiki-result-title">${escapeHtml(entry.title)}</strong>
                <span class="wiki-result-summary">${escapeHtml(entry.summary || entry.useCase || "요약이 없습니다.")}</span>
                ${tags.length ? `<span class="wiki-result-tags">${tags.map((tag) => `<span>#${escapeHtml(tag)}</span>`).join("")}</span>` : ""}
                ${matchedFields.length ? `<span class="wiki-match-signal"><i class="bx bx-target-lock" aria-hidden="true"></i>${escapeHtml(matchedFields.join(" · "))} 일치</span>` : ""}
                <span class="wiki-result-footer"><span>${escapeHtml(entry.owner || entry.registrant || "Owner 미지정")}</span><time datetime="${escapeHtml(entry.updatedAt || "")}">${escapeHtml(entry.updatedAt || "수정일 미기록")}</time></span>
            </button></li>`;
        }).join("") : '<li class="wiki-list-empty"><i class="bx bx-search-alt" aria-hidden="true"></i><strong>검색 조건에 맞는 항목이 없습니다.</strong><span>키워드를 줄이거나 분류 필터를 해제해 보세요.</span></li>';
        renderPagination(pageCount);
        scheduleSearchLog(results.length);
        return results;
    }

    function renderArticle(entry) {
        if (!entry) return;
        const details = contentEntries(entry.content);
        const links = asArray(entry.links).map((link) => ({ ...link, safeHref: safeHref(link.href) })).filter((link) => link.safeHref);
        const relations = asArray(entry.relations).filter((relation) => relation?.targetId);
        const comments = discussions[entry.id] ?? [];
        const reuseCount = incomingReuseCounts.get(entry.id) ?? 0;
        const secondaryDomains = asArray(entry.secondaryDomains).map(domainLabel);
        const aliases = unique(entry.aliases ?? []);
        const tags = unique(entry.tags ?? []);
        const expectedQueries = unique(entry.searchMetadata?.expectedQueries ?? []);
        const sourceIds = unique(entry.sourceIds ?? []);
        const changes = asArray(entry.changeLog);
        const reuse = entry.searchReuse ?? {};
        const contexts = unique(entry.contexts ?? []);

        article.innerHTML = `<header class="wiki-article-header">
            <p class="wiki-breadcrumb"><span>Wiki</span><i class="bx bx-chevron-right"></i><span>${escapeHtml(entry.type)}</span><i class="bx bx-chevron-right"></i><span>${escapeHtml(entry.id)}</span></p>
            <span class="wiki-article-badges"><span class="wiki-type-badge" data-asset-type="${escapeHtml(entry.type)}">${escapeHtml(entry.type)}</span><span>${escapeHtml(domainLabel(entry.domain))}</span><span>${escapeHtml(entry.publicationStatus || "상태 미기록")}</span>${reuseCount ? `<span>재사용 ${reuseCount}회</span>` : ""}</span>
            <h2 id="wiki-detail-title" tabindex="-1">${escapeHtml(entry.title)}</h2>
            <p class="wiki-article-summary">${escapeHtml(entry.summary || "요약이 없습니다.")}</p>
            <nav class="wiki-article-actions" aria-label="현재 Wiki 항목 작업"><button class="secondary-action-button" type="button" data-copy-markdown="${escapeHtml(entry.id)}"><i class="bx bx-copy"></i><span>Issue용 Markdown 복사</span></button><button class="secondary-action-button" type="button" data-download-markdown="${escapeHtml(entry.id)}"><i class="bx bx-download"></i><span>Markdown 저장</span></button></nav>
            <dl class="wiki-metadata">
                <span><dt>Owner</dt><dd>${escapeHtml(entry.owner || "미지정")}</dd></span><span><dt>등록자</dt><dd>${escapeHtml(entry.registrant || "미지정")}</dd></span><span><dt>검토자</dt><dd>${escapeHtml(entry.reviewer || "미지정")}</dd></span>
                <span><dt>등록일</dt><dd>${escapeHtml(entry.createdAt || "미기록")}</dd></span><span><dt>최근 수정</dt><dd>${escapeHtml(entry.updatedAt || "미기록")}</dd></span><span><dt>유형별 상태</dt><dd>${escapeHtml(entry.status || "미기록")}</dd></span>
                <span><dt>게시 상태</dt><dd>${escapeHtml(entry.publicationStatus || "미기록")}</dd></span><span><dt>재사용</dt><dd>${reuseCount}회</dd></span><span><dt>자산 ID</dt><dd>${escapeHtml(entry.id)}</dd></span>
            </dl>
        </header>
        <section class="wiki-article-section" id="wiki-use-case"><h3>문제 상황과 판단 질문</h3><p>${escapeMultiline(entry.useCase || "기록된 판단 질문이 없습니다.")}</p></section>
        <section class="wiki-article-section" id="wiki-contents"><h3>접근 방법·핵심 내용</h3><p>${escapeMultiline(entry.contents || "기록된 핵심 내용이 없습니다.")}</p></section>
        <section class="wiki-article-section" id="wiki-classification"><h3>분류와 검색 정보</h3><dl class="wiki-content-list"><dt>주 기술영역</dt><dd>${escapeHtml(domainLabel(entry.domain))}</dd><dt>보조 기술영역</dt><dd>${escapeHtml(secondaryDomains.join(", ") || "해당 없음")}</dd><dt>업무 단계·대응 대상</dt><dd>${escapeHtml(contexts.join(", ") || "해당 없음")}</dd><dt>검색 태그(자동 분류 + 선택 추가)</dt><dd>${escapeHtml(tags.join(", ") || "해당 없음")}</dd><dt>검색 별칭</dt><dd>${escapeHtml(aliases.join(", ") || "해당 없음")}</dd><dt>예상 검색문장</dt><dd>${escapeMultiline(expectedQueries.join("\n") || "해당 없음")}</dd></dl></section>
        ${details.length ? `<section class="wiki-article-section" id="wiki-type-content"><h3>${escapeHtml(entry.type)} 세부 내용</h3><dl class="wiki-content-list">${details.map((detail) => `<dt>${escapeHtml(detail.label)}</dt><dd>${escapeMultiline(detail.value)}</dd>`).join("")}</dl></section>` : ""}
        <section class="wiki-article-section" id="wiki-reuse"><h3>검색·재사용 기록</h3><dl class="wiki-content-list"><dt>기존 자산 검색</dt><dd>${reuse.performed ? "수행" : "미기록"}</dd><dt>활용 유형·판단</dt><dd>${escapeHtml(reuse.usageType || reuse.decision || "미기록")}</dd><dt>결과·사유</dt><dd>${escapeHtml(reuse.outcome || reuse.reason || "미기록")}</dd><dt>연결된 기존 자산</dt><dd>${escapeHtml(unique(reuse.foundAssetIds ?? []).join(", ") || "해당 없음")}</dd><dt>이 자산의 재사용</dt><dd>${reuseCount}회</dd></dl></section>
        ${sourceIds.length ? `<section class="wiki-article-section" id="wiki-source-ids"><h3>원자료 ID</h3><ul class="wiki-tag-list">${sourceIds.map((id) => `<li>${escapeHtml(id)}</li>`).join("")}</ul></section>` : ""}
        ${links.length ? `<section class="wiki-article-section" id="wiki-links"><h3>사내 원본 링크</h3><ul class="wiki-link-list">${links.map((link) => `<li><a href="${escapeHtml(link.safeHref)}" target="_blank" rel="noopener"><span><strong>${escapeHtml(link.label || "원본")}</strong><small>${escapeHtml([link.assetType || link.type, link.system, link.role, link.accessScope, link.status, link.verifiedAt].filter(Boolean).join(" · "))}</small></span><i class="bx bx-link-external"></i></a></li>`).join("")}</ul></section>` : ""}
        ${relations.length ? `<section class="wiki-article-section" id="wiki-relations"><h3>관련 자산</h3><ul class="wiki-relation-list">${relations.map((relation) => `<li><button type="button" data-related-entry="${escapeHtml(relation.targetId)}"><span><strong>${escapeHtml(relation.type || "REFERENCES")}</strong> ${escapeHtml(relation.targetId)}</span><span>${escapeHtml(relation.note || "")}</span></button></li>`).join("")}</ul></section>` : ""}
        ${changes.length ? `<section class="wiki-article-section" id="wiki-change-log"><h3>변경 이력</h3><ol class="wiki-change-list">${changes.map((change) => `<li><time>${escapeHtml(change.changedAt || change.date || "미기록")}</time><span><strong>${escapeHtml(change.changeType || "변경")}</strong> · ${escapeHtml(change.changedBy || change.author || "미기록")}</span><p>${escapeHtml(change.reason || change.summary || "")}</p></li>`).join("")}</ol></section>` : ""}
        <section class="wiki-discussion" id="wiki-discussion"><header class="wiki-discussion-header"><span><h3>질문과 논의</h3><p>${gitlabDiscussionEnabled ? "GitLab Issue Thread에 댓글을 저장하며 작성자와 날짜는 GitLab이 자동 기록합니다." : "로컬 기능시험에서는 브라우저에 저장하며 날짜를 자동 기록합니다. 사내 사이트에서는 GitLab Issue Thread로 전환됩니다."}</p></span><span class="wiki-discussion-count">${comments.length}개</span></header>
            <ol class="wiki-comment-list">${comments.length ? comments.map((comment) => `<li class="wiki-comment"><header><strong>${escapeHtml(comment.author)}</strong><time datetime="${escapeHtml(comment.createdAt)}">${escapeHtml(formatCommentDate(comment.createdAt))}</time></header><p>${escapeMultiline(comment.message)}</p></li>`).join("") : '<li class="wiki-comment-empty">아직 논의가 없습니다. 첫 질문이나 적용 경험을 남겨보세요.</li>'}</ol>
            <form class="wiki-comment-form" data-comment-entry="${escapeHtml(entry.id)}">${gitlabDiscussionEnabled ? '<label>GitLab Access Token<input name="gitlabToken" type="password" autocomplete="off" placeholder="현재 사용자 토큰 · 이 창에서만 사용"></label>' : '<label>작성자<input name="author" required placeholder="이름"></label>'}<label>댓글<textarea name="message" rows="2" required placeholder="질문, 적용 결과, 개선 의견"></textarea></label>${gitlabDiscussionEnabled ? '<button class="secondary-action-button" type="button" data-sync-comments><i class="bx bx-refresh"></i><span>기존 댓글 불러오기</span></button>' : ''}<button class="asset-register-button" type="submit"><i class="bx bx-message-rounded-add"></i><span>댓글 등록</span></button></form>
        </section>`;
    }

    function syncBodyDialogState() {
        document.body.classList.toggle("wiki-dialog-open", detailDialog.open);
    }

    function selectEntry(id, updateHash = true, openDetail = true) {
        const entry = allEntries.find((candidate) => candidate.id === id);
        if (!entry) return;
        selectedId = id;
        renderList();
        renderArticle(entry);
        if (updateHash) history.replaceState(null, "", `#${encodeURIComponent(id)}`);
        if (openDetail && !detailDialog.open) detailDialog.showModal();
        syncBodyDialogState();
        if (openDetail) document.getElementById("wiki-detail-title")?.focus({ preventScroll: true });
    }

    function renderWiki() {
        renderFacets();
        renderList();
        if (detailDialog.open) renderArticle(allEntries.find((entry) => entry.id === selectedId));
    }

    function refreshIncomingReuseCounts() {
        incomingReuseCounts.clear();
        buildIncomingReuseCounts(allEntries).forEach((count, id) => incomingReuseCounts.set(id, count));
    }

    function clearFacetSelections() {
        selectedDomains.clear();
        selectedStages.clear();
        selectedTargets.clear();
    }

    function resetFilters() {
        search.value = "";
        typeFilter.value = "all";
        sortFilter.value = "relevance";
        clearFacetSelections();
        currentPage = 1;
        history.replaceState(null, "", window.location.pathname);
        renderWiki();
    }

    function closeDetail() {
        if (detailDialog.open) detailDialog.close();
        if (decodeWikiHash(window.location.hash) === selectedId) history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
        syncBodyDialogState();
    }

    CARD_TYPES.forEach((type) => typeFilter.add(new Option(type, type)));
    renderMetrics();

    search.addEventListener("input", () => {
        window.clearTimeout(searchTimer);
        searchTimer = window.setTimeout(() => { currentPage = 1; renderWiki(); }, 140);
    });
    filterForm?.addEventListener("submit", (event) => event.preventDefault());
    filterForm?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-wiki-facet]");
        if (!button) return;
        const groups = { domains: selectedDomains, stages: selectedStages, targets: selectedTargets };
        const selected = groups[button.dataset.wikiFacet];
        if (!selected) return;
        const value = button.dataset.wikiFacetValue;
        if (value === "all") selected.clear();
        else if (selected.has(value)) selected.delete(value);
        else selected.add(value);
        currentPage = 1;
        renderWiki();
    });
    [typeFilter, sortFilter].forEach((control) => control.addEventListener("change", () => { currentPage = 1; renderWiki(); }));
    document.getElementById("reset-wiki-filters").addEventListener("click", resetFilters);
    document.getElementById("wiki-export-search-log")?.addEventListener("click", () => {
        const logs = readStorage(WIKI_SEARCH_LOG_KEY, []);
        downloadText(`wiki-search-log-${new Date().toISOString().slice(0, 10)}.json`, `${JSON.stringify(logs, null, 2)}\n`, "application/json;charset=utf-8");
        showToast(`${Array.isArray(logs) ? logs.length : 0}건의 로컬 검색 로그를 저장했습니다.`);
    });
    window.addEventListener("wiki:asset-registered", (event) => {
        const card = event.detail?.card;
        if (!card?.id || allEntries.some((entry) => entry.id === card.id)) return;
        allEntries.unshift(card);
        refreshIncomingReuseCounts();
        selectedId = card.id;
        currentPage = 1;
        renderMetrics();
        renderWiki();
        selectEntry(card.id, true, false);
        showToast(`${card.title} Wiki 등록 완료 · 팀 공유 검색 반영 중`);
    });
    list.addEventListener("click", (event) => {
        const button = event.target.closest("[data-wiki-entry]");
        if (button) selectEntry(button.dataset.wikiEntry);
    });
    pagination.addEventListener("click", (event) => {
        const button = event.target.closest("[data-wiki-page]");
        if (!button || button.disabled) return;
        currentPage = Number(button.dataset.wikiPage) || 1;
        renderList();
        document.getElementById("wiki-results-title")?.focus({ preventScroll: true });
    });
    document.getElementById("close-wiki-detail").addEventListener("click", closeDetail);
    detailDialog.addEventListener("cancel", () => window.setTimeout(syncBodyDialogState));
    detailDialog.addEventListener("close", syncBodyDialogState);
    article.addEventListener("click", async (event) => {
        const syncButton = event.target.closest("[data-sync-comments]");
        if (syncButton) {
            const form = syncButton.closest("[data-comment-entry]");
            const entry = allEntries.find((candidate) => candidate.id === form?.dataset.commentEntry);
            const token = text(new FormData(form).get("gitlabToken")) || gitlabDiscussionToken;
            if (!entry || !token) { showToast("GitLab Access Token을 입력하세요."); return; }
            syncButton.disabled = true;
            try {
                const result = await loadGitLabAssetDiscussionComments(entry, { ...gitlabDiscussionConfig, token });
                gitlabDiscussionToken = token;
                discussions = { ...discussions, [entry.id]: result.comments };
                renderArticle(entry);
                showToast(`${result.comments.length}개의 GitLab 댓글을 불러왔습니다.`);
            } catch (error) {
                showToast(error.message);
                syncButton.disabled = false;
            }
            return;
        }
        const related = event.target.closest("[data-related-entry]");
        if (related && allEntries.some((entry) => entry.id === related.dataset.relatedEntry)) {
            search.value = "";
            typeFilter.value = "all";
            clearFacetSelections();
            currentPage = 1;
            renderWiki();
            selectEntry(related.dataset.relatedEntry);
            return;
        }
        const copyButton = event.target.closest("[data-copy-markdown]");
        if (copyButton) {
            const entry = allEntries.find((candidate) => candidate.id === copyButton.dataset.copyMarkdown);
            if (!entry) return;
            try { await copyText(wikiEntryToMarkdown(entry)); showToast("GitLab Issue용 Markdown를 복사했습니다."); }
            catch { showToast("자동 복사가 되지 않았습니다. Markdown 저장을 사용해 주세요."); }
            return;
        }
        const downloadButton = event.target.closest("[data-download-markdown]");
        if (downloadButton) {
            const entry = allEntries.find((candidate) => candidate.id === downloadButton.dataset.downloadMarkdown);
            if (entry) downloadText(`${entry.id}.md`, wikiEntryToMarkdown(entry), "text/markdown;charset=utf-8");
        }
    });
    article.addEventListener("submit", async (event) => {
        const form = event.target.closest("[data-comment-entry]");
        if (!form) return;
        event.preventDefault();
        if (!form.reportValidity()) return;
        const values = Object.fromEntries(new FormData(form).entries());
        const entryId = form.dataset.commentEntry;
        const entry = allEntries.find((candidate) => candidate.id === entryId);
        if (gitlabDiscussionEnabled) {
            const token = text(values.gitlabToken) || gitlabDiscussionToken;
            if (!token) { showToast("GitLab Access Token을 입력하세요."); return; }
            const submitButton = form.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            try {
                const comment = await addGitLabAssetDiscussionComment(entry, values.message, { ...gitlabDiscussionConfig, token });
                gitlabDiscussionToken = token;
                discussions = { ...discussions, [entryId]: [...(discussions[entryId] ?? []), comment] };
                renderArticle(entry);
                showToast(`GitLab 댓글을 등록했습니다 · ${formatCommentDate(comment.createdAt)}`);
            } catch (error) {
                showToast(error.message);
                submitButton.disabled = false;
            }
            return;
        }
        const comment = { author: text(values.author), message: text(values.message), createdAt: new Date().toISOString() };
        const nextDiscussions = { ...discussions, [entryId]: [...(discussions[entryId] ?? []), comment] };
        if (!writeStorage(WIKI_DISCUSSION_KEY, nextDiscussions)) { showToast("브라우저 저장공간을 사용할 수 없어 댓글을 저장하지 못했습니다."); return; }
        discussions = nextDiscussions;
        renderArticle(allEntries.find((entry) => entry.id === entryId));
        showToast(`로컬 댓글을 등록했습니다 · ${formatCommentDate(comment.createdAt)}`);
    });

    const query = new URLSearchParams(window.location.search);
    search.value = text(query.get("q"));
    const queryDomain = normalizeDomainId(text(query.get("domain")));
    if (Object.hasOwn(DOMAIN_LABELS, queryDomain)) selectedDomains.add(queryDomain);
    const queryType = text(query.get("type"));
    if (CARD_TYPES.includes(queryType)) typeFilter.value = queryType;
    const hashId = decodeWikiHash(window.location.hash);
    selectedId = allEntries.some((entry) => entry.id === hashId) ? hashId : "";
    renderWiki();
    if (selectedId) selectEntry(selectedId, false);
}

if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", initializeWiki);
}
