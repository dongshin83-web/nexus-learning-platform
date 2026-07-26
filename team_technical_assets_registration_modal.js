import {
    SEARCH_DOMAIN_OPTIONS,
    WORKFLOW_STAGE_VALUES,
    RESPONSE_TARGET_VALUES,
    normalizeSearchDomain,
    normalizeSearchMetadata,
    resolveSearchMetadata,
    uniqueSearchValues,
    validateResolvedSearchMetadata
} from "./team_technical_assets_search_metadata.mjs";
import {
    buildGitLabWikiWebUrl,
    normalizeGitLabRegistrationConfig,
    registerCardInGitLabWiki,
    validateGitLabRegistrationConfig
} from "./team_technical_assets_gitlab.js";

export const REGISTRATION_CARD_TYPES = ["방법론", "BP", "VD Request", "CoR", "기술보고서", "외부 보고 자료", "노하우", "Tool Manual", "교육자료"];
export const REGISTRATION_PUBLICATION_STATUSES = ["초안", "검토 중", "게시", "개정 필요", "폐기"];
export const REGISTRATION_TYPE_STATUSES = {
    "방법론": ["방법론 후보", "정식 방법론", "승격 보류", "자격 해제"],
    "BP": ["BP 후보", "BP", "승격 보류", "자격 해제"],
    "VD Request": ["접수", "수행 중", "완료", "보류", "취소"],
    "CoR": ["제안", "선정·계획", "수행 중", "완료", "미선정", "중단"],
    "기술보고서": ["작성 중", "검토 중", "검토 완료", "보완 필요"],
    "외부 보고 자료": ["작성 중", "검토 중", "검토 완료", "보완 필요"],
    "노하우": ["작성 중", "검토 중", "검토 완료", "보완 필요"],
    "Tool Manual": ["작성 중", "검토 중", "검토 완료", "보완 필요"],
    "교육자료": ["작성 중", "검토 중", "검토 완료", "보완 필요"]
};

export const REGISTRATION_REQUIRED_CONTENT_FIELDS = {
    "방법론": ["problemAndPurpose", "technicalPrinciples", "inputsAndPrerequisites", "standardProcedure", "resultsAndCriteria", "scopeAndLimits", "validationAndReuse"],
    "BP": ["businessContext", "simulationResponse", "businessFeedback", "businessImpact", "reproductionConditions", "evidence"],
    "VD Request": ["context", "primaryQuestion", "inputsAndConstraints", "approach", "result", "judgmentScope", "limitations", "followUp", "requesterFeedback", "decisionImpact"],
    "CoR": ["backgroundAndGap", "objectiveAndSuccessCriteria", "scopeAndPlan", "validationDesign", "progressDecisions", "resultAndJudgment", "outputsAndFollowUp", "projectCompletionConfirmed", "goalAchievement", "businessContribution", "processChange", "relatedDocuments"],
    "기술보고서": ["questionAndPurpose", "scopeAndConditions", "methodAndEvidence", "findingsAndConclusion", "validConditionsAndDecisions", "limitations", "officialSource"],
    "외부 보고 자료": ["reportPurpose", "audienceAndDecision", "approvedMessages", "sourceAssetsAndEvidence", "disclosureScope", "versionAndValidity", "limitationsAndNotes"],
    "노하우": ["knowhowCategory", "symptomAndConditions", "causeAndDiagnosis", "resolution", "effectAndEvidence", "risksAndRecovery", "versionsAndSources"],
    "Tool Manual": ["purposeAndOutput", "prerequisites", "procedure", "completionCheck", "errorsAndWarnings", "versionsAndSources"],
    "교육자료": ["learningObjectives", "audienceAndPrerequisites", "outline", "activities", "completionCriteria", "sourcesAndVersion"]
};

const textValue = (value) => String(value ?? "").trim();
const dateValue = (value = new Date()) => (value instanceof Date ? value : new Date(value)).toISOString().slice(0, 10);
const PLACEHOLDER_VALUES = new Set(["확인 필요", "[확인 필요]", "미확인", "TBD", "N/A"]);
const hasValue = (value) => {
    if (Array.isArray(value)) return value.some(hasValue);
    if (value && typeof value === "object") return Object.values(value).some(hasValue);
    const normalized = textValue(value);
    return normalized.length > 0 && !PLACEHOLDER_VALUES.has(normalized);
};

export const CONTROLLED_VISIBLE_TAG_GROUPS = Object.freeze({
    "모델·해석": ["물성/재료모델", "경계조건", "접촉/계면", "비선형", "Mesh/요소", "수렴/안정화", "계산 효율화"],
    "검증·판단": ["실험 상관", "민감도 분석", "불확실성 검토", "설계안 비교", "원인 규명", "판단 기준", "최적화"],
    "재사용·확산": ["자동화/AI", "재사용 템플릿"]
});

export const CONTROLLED_VISIBLE_TAGS = Object.freeze(Object.values(CONTROLLED_VISIBLE_TAG_GROUPS).flat());

export const REGISTRATION_TYPE_TAG_FOCUS = Object.freeze({
    "VD Request": ["설계안 비교", "원인 규명", "판단 기준", "실험 상관", "불확실성 검토"],
    CoR: ["원인 규명", "판단 기준", "실험 상관", "최적화", "재사용 템플릿"],
    "방법론": ["물성/재료모델", "경계조건", "접촉/계면", "비선형", "Mesh/요소", "수렴/안정화", "계산 효율화", "실험 상관"],
    BP: ["설계안 비교", "원인 규명", "판단 기준", "최적화", "재사용 템플릿"],
    "기술보고서": ["원인 규명", "판단 기준", "실험 상관", "민감도 분석", "불확실성 검토"],
    "노하우": ["수렴/안정화", "계산 효율화", "자동화/AI", "재사용 템플릿", "판단 기준"],
    "Tool Manual": ["Mesh/요소", "수렴/안정화", "계산 효율화", "자동화/AI", "재사용 템플릿"],
    "교육자료": ["물성/재료모델", "경계조건", "접촉/계면", "비선형", "실험 상관", "판단 기준"],
    "외부 보고 자료": ["설계안 비교", "원인 규명", "판단 기준", "실험 상관", "불확실성 검토"]
});

const LEGACY_TAG_MIGRATIONS = new Map([
    ["계산시간", "계산 효율화"],
    ["수렴성", "수렴/안정화"],
    ["소재/물성 연계", "물성/재료모델"],
    ["실험/평가 연계", "실험 상관"],
    ["AI 연계", "자동화/AI"],
    ["고객/사업부 대응", ""],
    ["공정 연계", ""],
    ["교육/온보딩", ""],
    ["기존 자산 재사용", ""],
    ["신뢰성 연계", ""],
    ["외부 보고", ""],
    ["의사결정 반영", ""],
    ["타 Domain 연계", ""],
    ["개선사항", ""]
]);

const CONTROLLED_TAG_RULES = [
    ["물성/재료모델", ["물성", "재료 모델", "재료모델", "material model", "plasticity", "hyperelastic", "viscoelastic"]],
    ["경계조건", ["경계조건", "경계 조건", "구속조건", "하중조건", "boundary condition"]],
    ["접촉/계면", ["접촉", "계면", "마찰", "contact", "interface"]],
    ["비선형", ["비선형", "대변형", "nonlinear", "large deformation"]],
    ["Mesh/요소", ["mesh", "메시", "메쉬", "유한요소", "요소망", "element type"]],
    ["수렴/안정화", ["수렴", "안정화", "convergence", "time step", "stabilization"]],
    ["계산 효율화", ["계산시간", "해석시간", "runtime", "소요시간", "병렬", "submodel"]],
    ["실험 상관", ["실험 상관", "시험 상관", "실험 결과", "시험 결과", "correlation", "validation"]],
    ["민감도 분석", ["민감도", "sensitivity", "doe", "parameter study"]],
    ["불확실성 검토", ["불확실성", "산포", "오차 범위", "uncertainty", "variation"]],
    ["설계안 비교", ["설계안", "설계 비교", "후보 비교", "trade-off", "alternative"]],
    ["원인 규명", ["원인 규명", "원인 분석", "메커니즘", "root cause", "failure mechanism"]],
    ["판단 기준", ["판단 기준", "평가 기준", "합격 기준", "임계값", "criterion", "threshold"]],
    ["최적화", ["최적화", "최적 설계", "optimization", "optimum"]],
    ["자동화/AI", ["자동화", " ai ", "인공지능", "생성형 ai", "chatgpt", "gemini", "copilot"]],
    ["재사용 템플릿", ["재사용 템플릿", "공통 템플릿", "표준 양식", "template"]]
];

const RECOMMENDATION_CONTENT_KEYS = [
    "title", "workingTitle", "abstractContext", "primaryQuestion", "inputsAndConstraints",
    "approachOrContent", "observationsAndResult", "evidenceAvailable", "validConditions",
    "limitationsAndUnknowns", "reuseOrFollowUp", "summary", "useCase", "contents", "content", "typeSpecific"
];

function recommendationText(value) {
    if (Array.isArray(value)) return value.map(recommendationText).join(" ");
    if (value && typeof value === "object") return Object.values(value).map(recommendationText).join(" ");
    const normalized = textValue(value);
    if (!normalized || PLACEHOLDER_VALUES.has(normalized) || /^\[.*\]$/s.test(normalized)) return "";
    return normalized;
}

function recommendationHaystack(source = {}) {
    return ` ${RECOMMENDATION_CONTENT_KEYS.map((key) => recommendationText(source[key])).join(" ").toLocaleLowerCase("ko")} `;
}

function migratedAdditionalTag(tag) {
    const normalized = textValue(tag).replace(/^#/, "");
    return LEGACY_TAG_MIGRATIONS.has(normalized) ? LEGACY_TAG_MIGRATIONS.get(normalized) : normalized;
}

export function recommendControlledTags(source = {}) {
    const candidates = normalizeSearchMetadata(source);
    const direct = new Set(uniqueSearchValues([...(source.tags || []), ...candidates.visibleTags])
        .map(migratedAdditionalTag)
        .filter((tag) => CONTROLLED_VISIBLE_TAGS.includes(tag)));
    const haystack = recommendationHaystack(source);
    const type = textValue(source.cardTypeCandidate || source.type);
    const focused = new Set(REGISTRATION_TYPE_TAG_FOCUS[type] || []);
    const scored = CONTROLLED_TAG_RULES.map(([tag, keywords], index) => {
        const matches = keywords.filter((keyword) => haystack.includes(keyword.toLocaleLowerCase("ko"))).length;
        return { tag, index, score: (direct.has(tag) ? 100 : 0) + (matches * 10) + (matches && focused.has(tag) ? 2 : 0) };
    }).filter((item) => item.score > 0);
    return scored.sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 5).map((item) => item.tag);
}

function domainTagLabel(value) {
    const option = SEARCH_DOMAIN_OPTIONS.find((domain) => domain.id === normalizeSearchDomain(value));
    return option ? option.label.replace(/^\d+\.\s*/, "") : "";
}

function classificationTagKey(value) {
    let normalized = textValue(value)
        .replace(/^#/, "")
        .replace(/^(자료\s*유형|주?\s*기술\s*영역|보조\s*기술\s*영역|업무\s*단계|대응\s*대상)\s*[:：-]\s*/i, "")
        .replace(/^\d+\.\s*/, "")
        .trim();
    const domainLabel = domainTagLabel(normalized);
    if (domainLabel) normalized = domainLabel;
    normalized = normalized.replace(/\s*(자료\s*유형|기술\s*영역|업무\s*단계|대응\s*대상|단계|협업|대응)\s*$/i, "");
    return normalized.toLocaleLowerCase("ko").replace(/\s+/g, "");
}

export function matchingClassificationValues(values, allowedValues) {
    const allowedByKey = new Map(allowedValues.map((value) => [classificationTagKey(value), value]));
    return uniqueSearchValues(values)
        .map((value) => allowedByKey.get(classificationTagKey(value)))
        .filter(Boolean);
}

function excludesClassificationDuplicate(tag, classificationTags) {
    const classificationKeys = new Set(classificationTags.map(classificationTagKey));
    return !classificationKeys.has(classificationTagKey(tag));
}

export function buildClassificationTags({ type, domain, secondaryDomains = [], workflowStages = [], responseTargets = [] } = {}) {
    return uniqueSearchValues([
        textValue(type),
        domainTagLabel(domain),
        ...uniqueSearchValues(secondaryDomains).map(domainTagLabel),
        ...uniqueSearchValues(workflowStages).filter((value) => WORKFLOW_STAGE_VALUES.includes(value)),
        ...uniqueSearchValues(responseTargets).filter((value) => RESPONSE_TARGET_VALUES.includes(value))
    ]);
}

const FRAMEWORK_TARGETS = {
    technologyMap: { framework: "technology-map", targetType: "methodology" },
    learningPath: { framework: "learning-path", targetType: "capability" }
};
const FRAMEWORK_STATUSES = ["linked", "not_applicable", "target_missing"];
const FRAMEWORK_RELATION_TYPES = ["DEFINES", "TEACHES", "PRACTICES", "ENABLES", "EXAMPLE_OF", "APPLIES", "VALIDATES", "EVIDENCE_FOR", "REFERENCES"];

function normalizedRelations(relations, registrationId) {
    return (Array.isArray(relations) ? relations : []).map((relation) => ({
        ...relation,
        type: textValue(relation.type) || "RELATED_TO",
        targetId: textValue(relation.targetId),
        note: textValue(relation.note),
        confirmed: relation.confirmed === true,
        registrationId
    })).filter((relation) => relation.targetId);
}

function normalizedLinks(links, registrationId) {
    return (Array.isArray(links) ? links : []).map((link) => ({
        ...link,
        label: textValue(link.label) || "내부 자산",
        href: textValue(link.href),
        assetType: textValue(link.assetType || link.type) || "기타 사내 시스템",
        system: textValue(link.system) || "확인 필요",
        role: textValue(link.role) || "reference",
        accessScope: textValue(link.accessScope) || "권한 확인 필요",
        status: link.status === "verified" ? "verified" : "pending",
        verifiedAt: textValue(link.verifiedAt),
        registrationId
    })).filter((link) => link.href);
}

export function buildRegistrationCard(sourcePacket = {}, internal = {}, state = {}) {
    const original = sourcePacket?.schemaVersion && sourcePacket?.content ? sourcePacket : {};
    const now = state.now ? dateValue(state.now) : dateValue();
    const registrationId = textValue(state.registrationId || original.registrationId);
    const resolvedSearch = resolveSearchMetadata(sourcePacket, {
        domain: internal.domain,
        secondaryDomains: internal.secondaryDomains,
        workflowStages: internal.workflowStages,
        responseTargets: internal.responseTargets,
        tags: internal.tags,
        aliases: internal.aliases,
        expectedQueries: internal.expectedQueries,
        excludedTerms: internal.excludedTerms,
        confirmedInternally: internal.searchMetadataConfirmed === true
    });
    const internalTypeSpecific = internal.typeSpecific && typeof internal.typeSpecific === "object" && !Array.isArray(internal.typeSpecific)
        ? internal.typeSpecific
        : null;
    const sourceTypeSpecific = sourcePacket.typeSpecific && typeof sourcePacket.typeSpecific === "object" && !Array.isArray(sourcePacket.typeSpecific)
        ? sourcePacket.typeSpecific
        : null;
    const content = internalTypeSpecific || original.content || sourceTypeSpecific || {
        context: textValue(sourcePacket.abstractContext),
        primaryQuestion: textValue(sourcePacket.primaryQuestion),
        inputsAndConstraints: uniqueSearchValues(sourcePacket.inputsAndConstraints),
        approach: textValue(sourcePacket.approachOrContent),
        result: textValue(sourcePacket.observationsAndResult),
        limitations: uniqueSearchValues(sourcePacket.limitationsAndUnknowns),
        followUp: uniqueSearchValues(sourcePacket.reuseOrFollowUp)
    };
    const registrant = textValue(internal.registrant || original.registrant);
    const selectedRelations = normalizedRelations(state.selectedRelations ?? original.relations, registrationId);
    const internalLinks = normalizedLinks(state.internalLinks ?? original.links, registrationId);
    const relationSearchTerms = uniqueSearchValues(state.relationSearchTerms ?? original.searchReuse?.searchTerms);
    const frameworkLinks = Array.isArray(state.frameworkLinks ?? original.frameworkLinks)
        ? (state.frameworkLinks ?? original.frameworkLinks).map((link) => ({
            framework: textValue(link.framework),
            targetType: textValue(link.targetType),
            targetId: textValue(link.targetId),
            relationType: textValue(link.relationType),
            note: textValue(link.note)
        })).filter((link) => link.targetId)
        : [];
    const frameworkLinkDecisions = state.frameworkLinkDecisions ?? original.frameworkLinkDecisions ?? {};
    const searchMetadata = {
        ...resolvedSearch.searchMetadata,
        primaryDomain: resolvedSearch.domain,
        secondaryDomains: resolvedSearch.secondaryDomains,
        confirmedBy: internal.searchMetadataConfirmed === true ? registrant : "",
        confirmedAt: internal.searchMetadataConfirmed === true ? now : ""
    };

    return {
        ...original,
        schemaVersion: original.schemaVersion || "1.0",
        registrationId,
        id: textValue(internal.id || original.id),
        type: textValue(internal.type || original.type || sourcePacket.cardTypeCandidate),
        title: textValue(internal.title || original.title || sourcePacket.actualTitle || sourcePacket.workingTitle),
        domain: resolvedSearch.domain,
        secondaryDomains: resolvedSearch.secondaryDomains,
        contexts: resolvedSearch.contexts,
        publicationStatus: textValue(internal.publicationStatus || original.publicationStatus || "초안"),
        status: textValue(internal.status || original.status),
        owner: textValue(internal.owner || original.owner || registrant),
        registrant,
        reviewer: textValue(internal.reviewer || original.reviewer),
        contributors: uniqueSearchValues(original.contributors || sourcePacket.contributors),
        createdAt: textValue(original.createdAt) || now,
        updatedAt: now,
        summary: textValue(internal.summary || original.summary || sourcePacket.abstractContext || sourcePacket.observationsAndResult),
        useCase: textValue(internal.useCase || original.useCase || sourcePacket.primaryQuestion),
        contents: textValue(internal.contents || original.contents || sourcePacket.approachOrContent || sourcePacket.observationsAndResult),
        tags: resolvedSearch.tags,
        aliases: resolvedSearch.aliases,
        searchMetadata,
        sourceIds: uniqueSearchValues(original.sourceIds || sourcePacket.sourceIds),
        links: internalLinks,
        relations: selectedRelations,
        frameworkLinks,
        frameworkLinkDecisions,
        searchReuse: {
            ...(original.searchReuse || {}),
            performed: state.relationSearchPerformed === true || original.searchReuse?.performed === true,
            searchedAt: now,
            searchedBy: registrant,
            searchTerms: relationSearchTerms,
            foundAssetIds: selectedRelations.map((relation) => relation.targetId),
            decision: selectedRelations.length ? "linked" : (state.noRelationFound === true ? "no-candidate" : "pending"),
            reason: selectedRelations.length ? selectedRelations.map((relation) => relation.note).filter(Boolean).join("; ") : textValue(state.noRelationReason),
            reviewerConfirmed: original.searchReuse?.reviewerConfirmed === true
        },
        aiAssistance: {
            ...(original.aiAssistance || {}),
            externalStructured: sourcePacket.packetVersion === "0.2" || original.aiAssistance?.externalStructured === true,
            internalClineStructured: original.aiAssistance?.internalClineStructured === true,
            humanConfirmed: internal.searchMetadataConfirmed === true
        },
        changeLog: [
            ...(Array.isArray(original.changeLog) ? original.changeLog : []),
            { changedAt: now, changedBy: registrant, changeType: "생성·보완", reason: "Wiki 등록 화면에서 내부정보와 검색 분류 확정" }
        ],
        content,
        registrationSource: {
            ...(original.registrationSource || {}),
            registrationId,
            fileName: textValue(state.sourceFileName),
            importedAt: state.importedAt || new Date().toISOString(),
            originalPreservedInContent: Boolean(sourceTypeSpecific),
            typeSpecificJsonValid: state.typeSpecificJsonValid !== false,
            groupedSections: ["basicInformation", "typeSpecific", "searchMetadata", "relations", "internalLinks", "frameworkLinks", "validationHistory"]
        }
    };
}

export function validateRegistrationCard(card, sourcePacket = {}) {
    const errors = [];
    if (!/^REG-\d{14}-[A-Z0-9]{4}$/.test(textValue(card.registrationId))) errors.push("유효한 등록 ID가 필요합니다.");
    [["id", "자산 ID"], ["title", "자산 제목"], ["type", "자료 유형"], ["domain", "기술영역"], ["status", "유형별 상태"], ["owner", "담당자"], ["registrant", "등록자"], ["summary", "요약"], ["useCase", "활용 상황"], ["contents", "핵심 내용"]]
        .forEach(([key, label]) => { if (!textValue(card[key])) errors.push(`${label}을(를) 입력하세요.`); });
    if (!/^[a-z0-9][a-z0-9-]*$/.test(textValue(card.id))) errors.push("자산 ID는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.");
    if (!REGISTRATION_CARD_TYPES.includes(card.type)) errors.push("지원하는 자료 유형을 선택하세요.");
    if (!REGISTRATION_PUBLICATION_STATUSES.includes(card.publicationStatus)) errors.push("지원하는 게시 상태를 선택하세요.");
    if (!(REGISTRATION_TYPE_STATUSES[card.type] || []).includes(card.status)) errors.push(`${card.type || "선택 유형"}의 유형별 상태를 목록에서 선택하세요.`);
    errors.push(...validateResolvedSearchMetadata({
        domain: card.domain,
        secondaryDomains: card.secondaryDomains,
        contexts: card.contexts,
        searchMetadata: card.searchMetadata
    }));
    if (sourcePacket.cardTypeCandidate && sourcePacket.cardTypeCandidate !== card.type) errors.push("AI Handoff의 자산유형 후보와 사내에서 선택한 최종 유형이 다릅니다.");
    if (!sourcePacket.schemaVersion && sourcePacket.securitySelfCheck !== "pass") errors.push("외부 Handoff JSON은 securitySelfCheck가 pass여야 합니다.");
    if (!Array.isArray(card.tags) || !Array.isArray(card.aliases)) errors.push("검색 태그와 검색 별칭은 배열이어야 합니다.");
    if (!card.tags?.length) errors.push("검색 태그(자동 분류 + 선택 추가)를 1개 이상 입력하세요.");
    if (!card.aliases?.length && !card.searchMetadata?.expectedQueries?.length) errors.push("검색 별칭 또는 예상 검색문장을 1개 이상 입력하세요.");
    if (card.registrationSource?.typeSpecificJsonValid === false) errors.push("유형별 상세 내용 JSON을 올바른 객체로 수정하세요.");
    if (!card.searchReuse?.performed) errors.push("기존 Wiki 자산 검색을 수행하세요.");
    if (!card.relations?.length && card.searchReuse?.decision !== "no-candidate") errors.push("연결 자산을 선택하거나 '연결할 기존 자산 없음'을 확인하세요.");
    if (card.searchReuse?.decision === "no-candidate" && !textValue(card.searchReuse.reason)) errors.push("연결 후보가 없는 경우 검색 범위와 판단 사유를 입력하세요.");
    if (card.relations?.some((relation) => !textValue(relation.note))) errors.push("모든 연결 자산에 활용 내용을 입력하세요.");
    if (card.relations?.some((relation) => relation.confirmed !== true)) errors.push("모든 연결 관계를 확인하세요.");
    if (card.links?.some((link) => !/^https:\/\//i.test(link.href))) errors.push("회사 내부 자산 링크는 https:// 주소여야 합니다.");
    if (!Array.isArray(card.frameworkLinks)) errors.push("Technology Map·Learning Path 연결 목록이 필요합니다.");
    Object.entries(FRAMEWORK_TARGETS).forEach(([key, target]) => {
        const decision = card.frameworkLinkDecisions?.[key];
        if (!decision || !FRAMEWORK_STATUSES.includes(decision.status)) {
            errors.push(`${key === "technologyMap" ? "Technology Map" : "Learning Path"} 연결 여부를 선택하세요.`);
            return;
        }
        const matching = (card.frameworkLinks || []).filter((link) => link.framework === target.framework && link.targetType === target.targetType);
        if (decision.status === "linked") {
            if (!matching.length) errors.push(`${key === "technologyMap" ? "Technology Map" : "Learning Path"} 연결 대상을 입력하세요.`);
            if (matching.some((link) => !textValue(link.targetId) || !FRAMEWORK_RELATION_TYPES.includes(link.relationType) || !textValue(link.note))) {
                errors.push(`${key === "technologyMap" ? "Technology Map" : "Learning Path"} 연결 ID·관계 유형·근거를 모두 입력하세요.`);
            }
        } else if (!textValue(decision.reason)) {
            errors.push(`${key === "technologyMap" ? "Technology Map" : "Learning Path"} 미연결 사유를 입력하세요.`);
        }
    });
    if (card.publicationStatus === "게시") {
        if (!card.links?.length) errors.push("게시 자산은 내부 원본 또는 근거 링크가 필요합니다.");
        if (card.links?.some((link) => link.status !== "verified" || !/^\d{4}-\d{2}-\d{2}$/.test(link.verifiedAt))) errors.push("게시 전 모든 내부 링크의 접근 가능 여부와 확인일을 기록하세요.");
        const missingContent = (REGISTRATION_REQUIRED_CONTENT_FIELDS[card.type] || []).filter((field) => !hasValue(card.content?.[field]));
        if (missingContent.length) errors.push(`유형별 게시 필드 누락: ${missingContent.join(", ")}`);
    }
    return [...new Set(errors)];
}

if (typeof document !== "undefined") (() => {
    const TYPES = REGISTRATION_CARD_TYPES;
    const DOMAINS = SEARCH_DOMAIN_OPTIONS.map((domain) => [domain.id, domain.label]);
    const PUBLICATION_STATUSES = REGISTRATION_PUBLICATION_STATUSES;
    const RELATION_TYPES = ["USES", "EVIDENCE_FOR", "DERIVED_FROM", "IMPROVES", "RELATED_TO", "SUPERSEDES", "REQUESTED_BY", "RESULTED_IN", "REFERENCES"];
    const LINK_TYPES = ["VD Request 원문", "Simulation 결과보고서", "기술보고서", "BP", "CoR", "모델·해석 파일", "시험 결과", "요구사항·회의체 결정", "교육자료", "기타 사내 시스템"];
    const LINK_ROLES = [["source", "원본"], ["evidence", "검증 근거"], ["deliverable", "결과물"], ["model", "모델·해석 파일"], ["decision", "의사결정 기록"], ["reference", "참고자료"]];
    const ACCESS_SCOPES = ["VDE 내부", "CTO 내부", "사업부 협업", "회사 전체", "권한 확인 필요"];

    const dialog = document.getElementById("asset-registration-dialog");
    const form = document.getElementById("asset-registration-form");
    if (!dialog || !form) return;

    const fileInput = document.getElementById("registration-json-file");
    const dropZone = document.getElementById("registration-drop-zone");
    const nextButton = document.getElementById("registration-next");
    const previousButton = document.getElementById("registration-previous");
    const publishButton = document.getElementById("registration-publish");
    const importMessage = document.getElementById("registration-import-message");
    const preview = document.getElementById("registration-json-preview");
    const validation = document.getElementById("registration-validation");
    let currentStep = 1;
    let sourcePacket = null;
    let sourceFileName = "";
    let returnFocus = null;
    let selectedRelations = [];
    let internalLinks = [];
    let relationSearchPerformed = false;
    let additionalTagCandidates = [];
    let registrationId = "";

    const field = (name) => form.elements.namedItem(name);
    const text = (value) => String(value ?? "").trim();
    const list = (value) => Array.isArray(value) ? value : text(value).split(",").map((item) => item.trim()).filter(Boolean);
    const today = () => new Date().toISOString().slice(0, 10);

    function selectedValues(select) {
        return select ? [...select.selectedOptions].map((option) => option.value) : [];
    }

    function selectValues(select, values) {
        const selected = new Set(uniqueSearchValues(values));
        [...select.options].forEach((option) => { option.selected = selected.has(option.value); });
    }

    function createRegistrationId() {
        const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
        const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
        return `REG-${timestamp}-${suffix}`;
    }

    function setOptions(select, options) {
        select.innerHTML = options.map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
    }

    const frameworkConfigs = {
        technologyMap: { framework: "technology-map", targetType: "methodology" },
        learningPath: { framework: "learning-path", targetType: "capability" }
    };

    function updateFrameworkFields(key) {
        const linked = field(`${key}Status`).value === "linked";
        document.querySelector(`[data-framework-linked-fields="${key}"]`).hidden = !linked;
        document.querySelector(`[data-framework-reason-field="${key}"]`).hidden = linked;
    }

    function populateFrameworkFields(packet) {
        Object.entries(frameworkConfigs).forEach(([key, config]) => {
            const decision = packet.frameworkLinkDecisions?.[key] || {};
            const link = (packet.frameworkLinks || []).find((item) => item?.framework === config.framework && item?.targetType === config.targetType) || {};
            field(`${key}Status`).value = FRAMEWORK_STATUSES.includes(decision.status) ? decision.status : "";
            field(`${key}TargetId`).value = text(link.targetId);
            field(`${key}RelationType`).value = FRAMEWORK_RELATION_TYPES.includes(link.relationType) ? link.relationType : "REFERENCES";
            field(`${key}Note`).value = text(link.note);
            field(`${key}Reason`).value = text(decision.reason);
            updateFrameworkFields(key);
        });
    }

    function readTypeSpecificJson() {
        try {
            const parsed = JSON.parse(field("typeSpecificJson").value);
            return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? { value: parsed, valid: true } : { value: null, valid: false };
        } catch {
            return { value: null, valid: false };
        }
    }

    function validateTypeSpecificInput() {
        const editor = field("typeSpecificJson");
        const valid = readTypeSpecificJson().valid;
        editor.setCustomValidity(valid ? "" : "유형별 상세 내용은 유효한 JSON 객체여야 합니다.");
        return valid;
    }

    function validateRequiredClassificationInput() {
        const controls = [
            {
                control: field("type"),
                valid: REGISTRATION_CARD_TYPES.includes(field("type").value),
                message: "자료 유형을 사내에서 선택하세요."
            },
            {
                control: field("domain"),
                valid: Boolean(normalizeSearchDomain(field("domain").value)),
                message: "주 기술영역을 사내에서 선택하세요."
            },
            {
                control: field("workflowStages"),
                valid: selectedValues(field("workflowStages")).length > 0,
                message: "업무 단계를 하나 이상 사내에서 선택하세요."
            },
            {
                control: field("responseTargets"),
                valid: selectedValues(field("responseTargets")).length > 0,
                message: "대응 대상을 하나 이상 사내에서 선택하세요."
            },
            {
                control: field("searchMetadataConfirmed"),
                valid: field("searchMetadataConfirmed").checked,
                message: "답변 근거와 사내 분류체계를 비교해 검색 분류를 확인하세요."
            }
        ];
        controls.forEach(({ control, valid, message }) => control.setCustomValidity(valid ? "" : message));
        const firstInvalid = controls.find(({ valid }) => !valid);
        if (firstInvalid) {
            firstInvalid.control.reportValidity();
            setMessage("AI 후보가 비어 있거나 근거가 충분하지 않으면 자료유형·주 기술영역·업무단계·대응대상을 사내에서 직접 확정해야 합니다.", "error");
            return false;
        }
        setMessage("");
        return true;
    }

    function buildFrameworkRegistration() {
        const links = [];
        const decisions = {};
        Object.entries(frameworkConfigs).forEach(([key, config]) => {
            const status = field(`${key}Status`).value;
            const note = text(field(`${key}Note`).value);
            decisions[key] = {
                status,
                reason: status === "linked" ? note : text(field(`${key}Reason`).value)
            };
            if (status === "linked") {
                links.push({
                    ...config,
                    targetId: text(field(`${key}TargetId`).value),
                    relationType: field(`${key}RelationType`).value,
                    note
                });
            }
        });
        return { links, decisions };
    }

    function refreshStatusOptions(preferred = "") {
        const selectedType = field("type").value;
        const statuses = REGISTRATION_TYPE_STATUSES[selectedType] || [];
        setOptions(field("status"), statuses.map((status) => [status, status]));
        field("status").value = statuses.includes(preferred) ? preferred : (statuses[0] || "");
    }

    function slugify(value) {
        return text(value).normalize("NFKD").toLowerCase()
            .replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-+|-+$/g, "") || `asset-${Date.now()}`;
    }

    function setMessage(message, type = "") {
        importMessage.textContent = message;
        importMessage.className = `registration-message${type ? ` is-${type}` : ""}`;
    }

    function populateForm(packet) {
        const isCard = packet && packet.schemaVersion && packet.content;
        const candidates = normalizeSearchMetadata(packet);
        const hasAnswerEvidence = (category, value) => candidates.candidateRationale.some((item) => (
            item.category === category
            && text(item.value) === text(value)
            && Boolean(text(item.answerEvidence))
        ));
        const controlledTags = recommendControlledTags(packet);
        const cardContexts = uniqueSearchValues(packet.contexts);
        if (text(packet.registrationId)) {
            registrationId = text(packet.registrationId);
            document.getElementById("registration-id-display").textContent = registrationId;
        }
        const title = isCard ? packet.title : packet.actualTitle || packet.workingTitle;
        field("title").value = text(title);
        field("id").value = text(packet.id || packet.cardId || slugify(title));
        field("type").value = text(packet.type || packet.cardTypeCandidate);
        const evidenceBackedPrimaryDomain = hasAnswerEvidence("primaryDomainCandidate", candidates.primaryDomainCandidate)
            ? candidates.primaryDomainCandidate
            : "";
        field("domain").value = normalizeSearchDomain(isCard ? packet.domain : evidenceBackedPrimaryDomain);
        field("publicationStatus").value = text(packet.publicationStatus || "초안");
        refreshStatusOptions(text(packet.status));
        field("owner").value = text(packet.owner);
        field("registrant").value = text(packet.registrant);
        field("reviewer").value = text(packet.reviewer);
        const evidenceBackedSecondaryDomains = candidates.secondaryDomainCandidates
            .filter((value) => hasAnswerEvidence("secondaryDomainCandidates", value));
        selectValues(
            field("secondaryDomains"),
            uniqueSearchValues(isCard ? packet.secondaryDomains : evidenceBackedSecondaryDomains).map(normalizeSearchDomain)
        );
        const cardWorkflowStages = matchingClassificationValues(cardContexts, WORKFLOW_STAGE_VALUES);
        const cardResponseTargets = matchingClassificationValues(cardContexts, RESPONSE_TARGET_VALUES);
        const evidenceBackedWorkflowStages = candidates.workflowStageCandidates
            .filter((value) => hasAnswerEvidence("workflowStageCandidates", value));
        const evidenceBackedResponseTargets = candidates.responseTargetCandidates
            .filter((value) => hasAnswerEvidence("responseTargetCandidates", value));
        selectValues(field("workflowStages"), isCard ? cardWorkflowStages : evidenceBackedWorkflowStages);
        selectValues(field("responseTargets"), isCard ? cardResponseTargets : evidenceBackedResponseTargets);
        const classificationTags = currentClassificationTags();
        const normalizedVisibleTags = uniqueSearchValues(candidates.visibleTags)
            .map((tag) => isCard ? text(tag) : migratedAdditionalTag(tag))
            .filter(Boolean);
        additionalTagCandidates = uniqueSearchValues([...normalizedVisibleTags, ...controlledTags])
            .filter((tag) => excludesClassificationDuplicate(tag, classificationTags));
        const migratedRationale = candidates.candidateRationale.map((item) => item.category === "visibleTags"
            ? { ...item, value: isCard ? item.value : migratedAdditionalTag(item.value) }
            : item).filter((item) => item.value);
        const rationaleTags = new Set(migratedRationale.filter((item) => item.category === "visibleTags").map((item) => item.value));
        const candidateRationale = [...migratedRationale];
        additionalTagCandidates.forEach((tag) => {
            if (rationaleTags.has(tag)) return;
            candidateRationale.push({
                category: "visibleTags",
                value: tag,
                answerEvidence: controlledTags.includes(tag)
                    ? "등록 화면이 유형별 본문에서 동일한 표준 기술 표현을 감지함"
                    : "외부 AI Handoff의 내용 기반 추가 태그 후보",
                reason: controlledTags.includes(tag)
                    ? "등록 화면이 본문에서 감지한 표준 추가 태그 · 사내 확인 필요"
                    : "AI가 제안한 추가 태그 · 사내 확인 필요"
            });
        });
        const controlledCandidates = { ...candidates, visibleTags: additionalTagCandidates, candidateRationale };
        field("summary").value = text(packet.summary || packet.abstractContext || packet.observationsAndResult);
        field("useCase").value = text(packet.useCase || packet.primaryQuestion);
        field("contents").value = text(packet.contents || packet.approachOrContent || packet.observationsAndResult);
        field("typeSpecificJson").value = JSON.stringify(isCard ? packet.content : (packet.typeSpecific || {}), null, 2);
        field("tags").value = isCard ? additionalTagCandidates.join(", ") : "";
        field("aliases").value = uniqueSearchValues(packet.aliases?.length ? packet.aliases : candidates.aliases).join(", ");
        field("expectedQueries").value = uniqueSearchValues(packet.searchMetadata?.expectedQueries ?? candidates.expectedQueries).join("\n");
        field("excludedTerms").value = uniqueSearchValues(packet.searchMetadata?.excludedTerms ?? candidates.excludedTerms).join(", ");
        field("searchMetadataConfirmed").checked = packet.searchMetadata?.confirmedInternally === true;
        renderSearchProposal(controlledCandidates);
        renderTagCandidates(controlledCandidates);
        renderClassificationTags();
        selectedRelations = Array.isArray(packet.relations) ? packet.relations.map((relation) => ({ ...relation, confirmed: relation.confirmed === true })) : [];
        internalLinks = Array.isArray(packet.links) ? packet.links.filter((link) => link?.href).map((link) => ({
            label: link.label || "내부 자산",
            href: link.href,
            assetType: link.assetType || link.type || "기타 사내 시스템",
            system: link.system || "확인 필요",
            role: link.role || "reference",
            accessScope: link.accessScope || "권한 확인 필요",
            status: link.status === "verified" ? "verified" : "pending",
            verifiedAt: link.verifiedAt || ""
        })) : [];
        relationSearchPerformed = packet.searchReuse?.performed === true;
        field("relationSearch").value = list(packet.searchReuse?.searchTerms).join(", ");
        populateFrameworkFields(packet);
        renderSelectedRelations();
        renderInternalLinks();
    }

    function renderSearchProposal(candidates) {
        const domainMap = Object.fromEntries(SEARCH_DOMAIN_OPTIONS.map((domain) => [domain.id, domain.label]));
        const status = document.getElementById("proposal-candidate-status");
        if (status) status.textContent = candidates.candidateStatus === "user_confirmed_candidate" ? "외부 후보 확인됨 · 사내 확정 필요" : "외부 후보 미확인 · 사내 확정 필요";
        const setProposal = (id, values, mapper = (value) => value) => {
            const element = document.getElementById(id);
            if (!element) return;
            const normalized = uniqueSearchValues(values).map(mapper).filter(Boolean);
            element.textContent = normalized.join(", ") || "제안 없음";
        };
        setProposal("proposal-primary-domain", candidates.primaryDomainCandidate, (value) => domainMap[value] || value);
        setProposal("proposal-secondary-domains", candidates.secondaryDomainCandidates, (value) => domainMap[value] || value);
        setProposal("proposal-workflow-stages", candidates.workflowStageCandidates);
        setProposal("proposal-response-targets", candidates.responseTargetCandidates);
        setProposal("proposal-visible-tags", candidates.visibleTags);
        setProposal("proposal-aliases", candidates.aliases);
        setProposal("proposal-expected-queries", candidates.expectedQueries);
        setProposal("proposal-excluded-terms", candidates.excludedTerms);
        setProposal("proposal-legacy-terms", candidates.legacyUnclassifiedTerms);
        const rationale = document.getElementById("proposal-rationale-list");
        if (rationale) {
            const categoryLabels = {
                primaryDomainCandidate: "주 기술영역",
                secondaryDomainCandidates: "보조 기술영역",
                workflowStageCandidates: "업무 단계",
                responseTargetCandidates: "대응 대상",
                visibleTags: "자동 분류·추가 태그",
                aliases: "검색 별칭",
                expectedQueries: "예상 검색문장",
                excludedTerms: "검색 제외어"
            };
            rationale.innerHTML = candidates.candidateRationale.length
                ? candidates.candidateRationale.map((item) => {
                    const evidence = item.answerEvidence
                        ? `답변 근거: ${item.answerEvidence}`
                        : "답변 근거 없음 · 사내 직접 선택 필요";
                    return `<li><strong>${escapeHtml(item.value)}</strong><span>${escapeHtml(categoryLabels[item.category] || item.category)} · ${escapeHtml(evidence)} · ${escapeHtml(item.reason)}</span></li>`;
                }).join("")
                : '<li><span>AI가 제안 이유를 제공하지 않았습니다. 사내 분류체계와 비교해 직접 확정하세요.</span></li>';
        }
    }

    function renderTagCandidates(candidates = { ...normalizeSearchMetadata(sourcePacket || {}), visibleTags: recommendControlledTags(sourcePacket || {}) }) {
        const container = document.getElementById("registration-tag-candidates");
        if (!container) return;
        const selected = new Set(uniqueSearchValues(field("tags").value));
        const reasons = new Map((candidates.candidateRationale || [])
            .filter((item) => item.category === "visibleTags")
            .map((item) => [text(item.value), [
                item.answerEvidence ? `답변 근거: ${text(item.answerEvidence)}` : "답변 근거 없음",
                text(item.reason)
            ].filter(Boolean).join(" · ")]));
        const classificationTags = currentClassificationTags();
        const tags = uniqueSearchValues(candidates.visibleTags).filter((tag) => excludesClassificationDuplicate(tag, classificationTags));
        container.innerHTML = tags.length
            ? tags.map((tag) => `<label class="registration-tag-candidate"><input type="checkbox" value="${escapeHtml(tag)}"${selected.has(tag) ? " checked" : ""}><span><strong>#${escapeHtml(tag)}</strong>${reasons.get(tag) ? `<small>${escapeHtml(reasons.get(tag))}</small>` : ""}</span></label>`).join("")
            : '<p class="registration-tag-empty">추가 추천 태그가 없습니다. 필요한 경우 아래 입력란에 사내 용어를 직접 추가하세요.</p>';
    }

    function currentClassificationTags() {
        return buildClassificationTags({
            type: field("type").value,
            domain: field("domain").value,
            secondaryDomains: selectedValues(field("secondaryDomains")),
            workflowStages: selectedValues(field("workflowStages")),
            responseTargets: selectedValues(field("responseTargets"))
        });
    }

    function renderClassificationTags() {
        const container = document.getElementById("registration-classification-tag-list");
        if (!container) return;
        const tags = currentClassificationTags();
        container.innerHTML = tags.length
            ? tags.map((tag) => `<span>#${escapeHtml(tag)}</span>`).join("")
            : '<span>분류를 선택하면 자동 생성됩니다.</span>';
    }

    function refreshTagConfirmation() {
        renderClassificationTags();
        renderTagCandidates({ ...normalizeSearchMetadata(sourcePacket || {}), visibleTags: additionalTagCandidates });
    }

    function syncSelectedTagCandidates() {
        const selected = uniqueSearchValues(field("tags").value);
        document.querySelectorAll("#registration-tag-candidates input[type='checkbox']").forEach((checkbox) => {
            checkbox.checked = selected.includes(checkbox.value);
        });
    }

    function applyTagCandidateSelection() {
        const candidateTags = [...document.querySelectorAll("#registration-tag-candidates input[type='checkbox']")];
        const allCandidateValues = new Set(candidateTags.map((checkbox) => checkbox.value));
        const manualTags = uniqueSearchValues(field("tags").value).filter((tag) => !allCandidateValues.has(tag));
        const selectedCandidates = candidateTags.filter((checkbox) => checkbox.checked).map((checkbox) => checkbox.value);
        field("tags").value = uniqueSearchValues([...selectedCandidates, ...manualTags]).join(", ");
    }

    function escapeHtml(value) {
        return text(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
    }

    function libraryCards() {
        return Array.isArray(window.TECHNICAL_ASSET_LIBRARY?.cards) ? window.TECHNICAL_ASSET_LIBRARY.cards : [];
    }

    function relationMatches(terms) {
        return libraryCards().filter((card) => card.id !== text(field("id").value)).map((card) => {
            const haystack = [card.title, card.summary, card.useCase, card.contents, JSON.stringify(card.content || {}), card.domain, card.type, ...(card.secondaryDomains || []), ...(card.tags || []), ...(card.aliases || []), ...(card.contexts || [])].join(" ").toLocaleLowerCase("ko");
            const score = terms.reduce((total, term) => total + (haystack.includes(term) ? (card.title?.toLocaleLowerCase("ko").includes(term) ? 3 : 1) : 0), 0);
            return { card, score };
        }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score || String(b.card.updatedAt || "").localeCompare(String(a.card.updatedAt || ""))).slice(0, 6);
    }

    function relationResultMarkup(matches, emptyMessage) {
        return matches.length ? matches.map(({ card }) => `
            <div class="relation-result">
                <div class="relation-result-main"><strong>${escapeHtml(card.title)}</strong><small>${escapeHtml(card.type)} · ${escapeHtml(card.domain)} · ${escapeHtml(card.publicationStatus)}</small></div>
                <button type="button" data-add-relation="${escapeHtml(card.id)}">연결</button>
            </div>`).join("") : `<div class="connection-empty">${emptyMessage}</div>`;
    }

    function renderRelationRecommendations() {
        const container = document.getElementById("relation-recommendations");
        if (!container) return;
        const terms = uniqueSearchValues([
            field("title").value,
            field("summary").value,
            field("useCase").value,
            ...currentClassificationTags(),
            ...uniqueSearchValues(field("tags").value),
            ...uniqueSearchValues(field("aliases").value)
        ]).flatMap((value) => text(value).toLocaleLowerCase("ko").split(/\s+/)).filter((value) => value.length > 1);
        container.innerHTML = relationResultMarkup(relationMatches(terms), "등록 내용과 가까운 기존 자산이 없습니다. 아래에서 직접 검색해 주세요.");
    }

    function renderRelationCandidates() {
        const container = document.getElementById("relation-search-results");
        const query = text(field("relationSearch").value).toLocaleLowerCase("ko");
        if (!query) {
            container.innerHTML = '<div class="connection-empty">검색어를 입력하면 제목·본문·태그·활용 상황을 함께 검색합니다.</div>';
            return;
        }
        relationSearchPerformed = true;
        const terms = query.split(/\s+/).filter(Boolean);
        container.innerHTML = relationResultMarkup(relationMatches(terms), "일치하는 기존 카드가 없습니다. 다른 검색어도 확인해 주세요.");
    }

    function addRelation(cardId) {
        const card = libraryCards().find((item) => item.id === cardId);
        if (!card || selectedRelations.some((relation) => relation.targetId === cardId)) return;
        relationSearchPerformed = true;
        selectedRelations.push({ type: "RELATED_TO", targetId: card.id, note: "", confirmed: false });
        field("noRelationFound").checked = false;
        document.getElementById("no-relation-reason-field").hidden = true;
        renderSelectedRelations();
    }

    function renderSelectedRelations() {
        const container = document.getElementById("selected-relations");
        if (!container) return;
        container.innerHTML = selectedRelations.length ? selectedRelations.map((relation, index) => {
            const card = libraryCards().find((item) => item.id === relation.targetId);
            return `<div class="connection-record" data-relation-index="${index}">
                <div class="connection-record-main"><strong>${escapeHtml(card?.title || relation.targetId)}</strong><small>${escapeHtml(relation.targetId)}</small>
                    <div class="connection-record-fields">
                        <select aria-label="관계 유형">${RELATION_TYPES.map((type) => `<option value="${type}"${relation.type === type ? " selected" : ""}>${type}</option>`).join("")}</select>
                        <input value="${escapeHtml(relation.note)}" aria-label="활용 내용" placeholder="이 자산을 어떻게 활용했는지 입력">
                    </div>
                    <label class="connection-none-option"><input type="checkbox" data-confirm-relation${relation.confirmed ? " checked" : ""}>관계와 활용 내용을 확인함</label>
                </div><button type="button" data-remove-relation aria-label="연결 삭제"><i class="bx bx-trash"></i></button>
            </div>`;
        }).join("") : '<div class="connection-empty">선택된 연결 자산이 없습니다.</div>';
    }

    function renderInternalLinks() {
        const container = document.getElementById("selected-links");
        if (!container) return;
        container.innerHTML = internalLinks.length ? internalLinks.map((link, index) => `<div class="connection-record" data-link-index="${index}">
            <div class="connection-record-main"><strong>${escapeHtml(link.label)}</strong><small>${escapeHtml(link.assetType)} · ${escapeHtml(link.system)} · ${escapeHtml(link.accessScope)}<br>${escapeHtml(link.href)}</small>
                <label class="connection-none-option"><input type="checkbox" data-verify-link${link.status === "verified" ? " checked" : ""}>링크 접근 가능 여부를 확인함</label>
            </div><button type="button" data-remove-link aria-label="링크 삭제"><i class="bx bx-trash"></i></button>
        </div>`).join("") : '<div class="connection-empty">등록된 회사 내부 자산 링크가 없습니다.</div>';
    }

    function addInternalLink() {
        const label = text(document.getElementById("internal-link-label").value);
        const href = text(document.getElementById("internal-link-url").value);
        const system = text(document.getElementById("internal-link-system").value);
        if (!label || !/^https:\/\//i.test(href) || !system) {
            document.getElementById("internal-link-label").reportValidity();
            alert("링크 이름, https:// URL, 원본 시스템을 모두 입력하세요.");
            return;
        }
        internalLinks.push({
            label, href, system,
            assetType: document.getElementById("internal-link-type").value,
            role: document.getElementById("internal-link-role").value,
            accessScope: document.getElementById("internal-link-scope").value,
            status: "pending", verifiedAt: ""
        });
        ["internal-link-label", "internal-link-url", "internal-link-system"].forEach((id) => { document.getElementById(id).value = ""; });
        renderInternalLinks();
    }

    function buildCard() {
        const typeSpecific = readTypeSpecificJson();
        const framework = buildFrameworkRegistration();
        return buildRegistrationCard(sourcePacket || {}, {
            id: field("id").value,
            type: field("type").value,
            title: field("title").value,
            domain: field("domain").value,
            secondaryDomains: selectedValues(field("secondaryDomains")),
            workflowStages: selectedValues(field("workflowStages")),
            responseTargets: selectedValues(field("responseTargets")),
            publicationStatus: field("publicationStatus").value,
            status: field("status").value,
            owner: field("owner").value,
            registrant: field("registrant").value,
            reviewer: field("reviewer").value,
            summary: field("summary").value,
            useCase: field("useCase").value,
            contents: field("contents").value,
            typeSpecific: typeSpecific.value,
            tags: uniqueSearchValues([...currentClassificationTags(), ...uniqueSearchValues(field("tags").value)]),
            aliases: field("aliases").value,
            expectedQueries: field("expectedQueries").value,
            excludedTerms: field("excludedTerms").value,
            searchMetadataConfirmed: field("searchMetadataConfirmed").checked
        }, {
            registrationId,
            sourceFileName,
            selectedRelations,
            internalLinks,
            relationSearchPerformed,
            relationSearchTerms: field("relationSearch").value,
            noRelationFound: field("noRelationFound").checked,
            noRelationReason: field("noRelationReason").value,
            frameworkLinks: framework.links,
            frameworkLinkDecisions: framework.decisions,
            typeSpecificJsonValid: typeSpecific.valid
        });
    }

    function renderReview() {
        const card = buildCard();
        const errors = validateRegistrationCard(card, sourcePacket || {});
        validation.innerHTML = errors.length
            ? errors.map((error) => `<div class="registration-validation-item is-error"><i class="bx bx-error-circle"></i><span>${error}</span></div>`).join("")
            : `<div class="registration-validation-item is-success"><i class="bx bx-check-circle"></i><span>필수 등록정보 검증을 통과했습니다. GitLab Wiki에 바로 등록할 수 있습니다.</span></div>`;
        preview.textContent = JSON.stringify(card, null, 2);
        const tagList = document.getElementById("registration-final-tag-list");
        if (tagList) tagList.innerHTML = card.tags.length
            ? card.tags.map((tag) => `<span>#${escapeHtml(tag)}</span>`).join("")
            : '<span>확정 태그 없음</span>';
        publishButton.disabled = errors.length > 0;
    }

    function setStep(step) {
        currentStep = step;
        form.querySelectorAll("[data-registration-step]").forEach((section) => {
            const active = Number(section.dataset.registrationStep) === step;
            section.classList.toggle("is-active", active);
            section.hidden = !active;
        });
        form.querySelectorAll("[data-registration-step-indicator]").forEach((item) => {
            const itemStep = Number(item.dataset.registrationStepIndicator);
            item.classList.toggle("is-active", itemStep === step);
            item.classList.toggle("is-complete", itemStep < step);
        });
        previousButton.hidden = step === 1;
        nextButton.hidden = step === 4;
        publishButton.hidden = step !== 4;
        nextButton.textContent = step === 3 ? "검증하기" : "다음";
        nextButton.disabled = step === 1 && !sourcePacket;
        if (step === 3) {
            renderRelationRecommendations();
            renderRelationCandidates();
            renderSelectedRelations();
            renderInternalLinks();
        }
        if (step === 4) renderReview();
    }

    async function loadFile(file) {
        if (!file) return;
        try {
            const source = await file.text();
            const parsed = JSON.parse(source.replace(/^\uFEFF/, ""));
            if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") throw new Error("JSON 객체가 아닙니다.");
            const isCard = Boolean(parsed.schemaVersion && parsed.content);
            if (!isCard && parsed.securitySelfCheck !== "pass") throw new Error("외부 Handoff JSON은 securitySelfCheck가 pass여야 합니다.");
            if (!isCard && !REGISTRATION_CARD_TYPES.includes(text(parsed.cardTypeCandidate))) throw new Error("지원하는 cardTypeCandidate가 없습니다.");
            sourcePacket = parsed;
            sourceFileName = file.name;
            populateForm(parsed);
            document.getElementById("registration-file-name").textContent = file.name;
            setMessage("JSON을 불러왔습니다. 다음 단계에서 내부 등록정보를 확인하세요.", "success");
            nextButton.disabled = false;
        } catch (error) {
            sourcePacket = null;
            selectedRelations = [];
            internalLinks = [];
            relationSearchPerformed = false;
            form.reset();
            refreshStatusOptions();
            renderSearchProposal(normalizeSearchMetadata({}));
            renderSelectedRelations();
            renderInternalLinks();
            setMessage(`파일을 읽지 못했습니다: ${error.message}`, "error");
            nextButton.disabled = true;
        }
    }

    function openDialog(trigger) {
        returnFocus = trigger;
        form.reset();
        registrationId = createRegistrationId();
        sourcePacket = null;
        sourceFileName = "";
        selectedRelations = [];
        internalLinks = [];
        relationSearchPerformed = false;
        additionalTagCandidates = [];
        document.getElementById("registration-file-name").textContent = "선택된 파일 없음";
        document.getElementById("registration-id-display").textContent = registrationId;
        document.getElementById("no-relation-reason-field").hidden = true;
        Object.keys(frameworkConfigs).forEach((key) => {
            field(`${key}Status`).value = "";
            updateFrameworkFields(key);
        });
        renderSearchProposal(normalizeSearchMetadata({}));
        renderTagCandidates(normalizeSearchMetadata({}));
        renderClassificationTags();
        const gitlabDefaults = normalizeGitLabRegistrationConfig(window.TECHNICAL_ASSET_GITLAB_CONFIG || {});
        field("gitlabBaseUrl").value = gitlabDefaults.baseUrl;
        field("gitlabProjectId").value = gitlabDefaults.projectId;
        field("gitlabToken").value = "";
        document.getElementById("registration-publish-status").textContent = "";
        publishButton.disabled = false;
        publishButton.innerHTML = '<i class="bx bx-cloud-upload"></i>Wiki에 바로 등록';
        setMessage("");
        dialog.showModal();
        document.body.classList.add("asset-registration-open");
        setStep(1);
        document.getElementById("asset-registration-title").focus({ preventScroll: true });
    }

    function closeDialog() { if (dialog.open) dialog.close(); }

    setOptions(field("type"), [["", "사내에서 자료 유형 선택"], ...TYPES.map((item) => [item, item])]);
    setOptions(field("domain"), [["", "사내에서 주 기술영역 선택"], ...DOMAINS]);
    setOptions(field("secondaryDomains"), DOMAINS);
    setOptions(field("workflowStages"), WORKFLOW_STAGE_VALUES.map((item) => [item, item]));
    setOptions(field("responseTargets"), RESPONSE_TARGET_VALUES.map((item) => [item, item]));
    setOptions(field("publicationStatus"), PUBLICATION_STATUSES.map((item) => [item, item]));
    Object.keys(frameworkConfigs).forEach((key) => {
        setOptions(field(`${key}Status`), [["", "선택하세요"], ["linked", "연결됨"], ["not_applicable", "해당 없음"], ["target_missing", "연결 대상 미등록"]]);
        setOptions(field(`${key}RelationType`), FRAMEWORK_RELATION_TYPES.map((item) => [item, item]));
        field(`${key}RelationType`).value = "REFERENCES";
        field(`${key}Status`).addEventListener("change", () => updateFrameworkFields(key));
        updateFrameworkFields(key);
    });
    refreshStatusOptions();
    setOptions(document.getElementById("internal-link-type"), LINK_TYPES.map((item) => [item, item]));
    setOptions(document.getElementById("internal-link-role"), LINK_ROLES);
    setOptions(document.getElementById("internal-link-scope"), ACCESS_SCOPES.map((item) => [item, item]));

    const wikiHomeLink = document.getElementById("gitlab-wiki-home-link");
    if (wikiHomeLink) {
        const wikiHomeUrl = buildGitLabWikiWebUrl("home", window.TECHNICAL_ASSET_GITLAB_CONFIG || {});
        wikiHomeLink.hidden = !wikiHomeUrl;
        if (wikiHomeUrl) wikiHomeLink.href = wikiHomeUrl;
    }

    document.getElementById("open-asset-registration")?.addEventListener("click", (event) => openDialog(event.currentTarget));
    field("type").addEventListener("change", () => refreshStatusOptions());
    [field("type"), field("domain"), field("secondaryDomains"), field("workflowStages"), field("responseTargets")].forEach((control) => control.addEventListener("change", refreshTagConfirmation));
    field("typeSpecificJson").addEventListener("input", validateTypeSpecificInput);
    field("tags").addEventListener("input", syncSelectedTagCandidates);
    document.getElementById("registration-tag-candidates").addEventListener("change", applyTagCandidateSelection);
    document.getElementById("close-asset-registration")?.addEventListener("click", closeDialog);
    document.getElementById("registration-cancel")?.addEventListener("click", closeDialog);
    fileInput.addEventListener("change", () => loadFile(fileInput.files?.[0]));
    ["dragenter", "dragover"].forEach((name) => dropZone.addEventListener(name, (event) => { event.preventDefault(); dropZone.classList.add("is-dragging"); }));
    ["dragleave", "drop"].forEach((name) => dropZone.addEventListener(name, (event) => { event.preventDefault(); dropZone.classList.remove("is-dragging"); }));
    dropZone.addEventListener("drop", (event) => loadFile(event.dataTransfer?.files?.[0]));
    document.getElementById("relation-search").addEventListener("input", renderRelationCandidates);
    [document.getElementById("relation-recommendations"), document.getElementById("relation-search-results")].forEach((container) => container.addEventListener("click", (event) => {
        const button = event.target.closest("[data-add-relation]");
        if (button) addRelation(button.dataset.addRelation);
    }));
    document.getElementById("selected-relations").addEventListener("input", (event) => {
        const record = event.target.closest("[data-relation-index]");
        if (!record) return;
        const relation = selectedRelations[Number(record.dataset.relationIndex)];
        if (event.target.matches("select")) relation.type = event.target.value;
        if (event.target.matches("input[aria-label='활용 내용']")) relation.note = text(event.target.value);
        if (event.target.matches("[data-confirm-relation]")) relation.confirmed = event.target.checked;
    });
    document.getElementById("selected-relations").addEventListener("click", (event) => {
        const record = event.target.closest("[data-relation-index]");
        if (record && event.target.closest("[data-remove-relation]")) {
            selectedRelations.splice(Number(record.dataset.relationIndex), 1);
            renderSelectedRelations();
        }
    });
    document.getElementById("no-relation-found").addEventListener("change", (event) => {
        document.getElementById("no-relation-reason-field").hidden = !event.target.checked;
        if (event.target.checked) {
            relationSearchPerformed = true;
            selectedRelations = [];
        }
        renderSelectedRelations();
    });
    document.getElementById("add-internal-link").addEventListener("click", addInternalLink);
    document.getElementById("selected-links").addEventListener("change", (event) => {
        const record = event.target.closest("[data-link-index]");
        if (!record || !event.target.matches("[data-verify-link]")) return;
        const link = internalLinks[Number(record.dataset.linkIndex)];
        link.status = event.target.checked ? "verified" : "pending";
        link.verifiedAt = event.target.checked ? today() : "";
    });
    document.getElementById("selected-links").addEventListener("click", (event) => {
        const record = event.target.closest("[data-link-index]");
        if (record && event.target.closest("[data-remove-link]")) {
            internalLinks.splice(Number(record.dataset.linkIndex), 1);
            renderInternalLinks();
        }
    });
    previousButton.addEventListener("click", () => setStep(Math.max(1, currentStep - 1)));
    nextButton.addEventListener("click", () => {
        if (currentStep === 2 && (!validateTypeSpecificInput() || !validateRequiredClassificationInput())) return;
        setStep(Math.min(4, currentStep + 1));
    });
    publishButton.addEventListener("click", async () => {
        const card = buildCard();
        const cardErrors = validateRegistrationCard(card, sourcePacket || {});
        const config = {
            ...(window.TECHNICAL_ASSET_GITLAB_CONFIG || {}),
            baseUrl: field("gitlabBaseUrl").value,
            projectId: field("gitlabProjectId").value,
            token: field("gitlabToken").value
        };
        const configErrors = validateGitLabRegistrationConfig(config);
        const status = document.getElementById("registration-publish-status");
        if (cardErrors.length || configErrors.length) {
            status.className = "registration-publish-status is-error";
            status.textContent = [...cardErrors, ...configErrors].join(" ");
            return;
        }
        publishButton.disabled = true;
        publishButton.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i>GitLab 등록 중';
        status.className = "registration-publish-status";
        status.textContent = "GitLab 저장소에 Wiki 카드를 등록하고 있습니다.";
        try {
            const result = await registerCardInGitLabWiki(card, config);
            field("gitlabToken").value = "";
            status.className = "registration-publish-status is-success";
            status.innerHTML = result.wikiUrl
                ? `GitLab Wiki 등록 완료 · <a href="${escapeHtml(result.wikiUrl)}" target="_blank" rel="noopener">등록 문서 열기</a>`
                : `GitLab Wiki 등록 완료 · 문서 slug: ${escapeHtml(result.slug)}`;
            publishButton.innerHTML = '<i class="bx bx-check"></i>Wiki 등록 완료';
            window.dispatchEvent(new CustomEvent("wiki:asset-registered", { detail: { card, result } }));
        } catch (error) {
            status.className = "registration-publish-status is-error";
            status.textContent = error.message;
            publishButton.disabled = false;
            publishButton.innerHTML = '<i class="bx bx-cloud-upload"></i>Wiki에 바로 등록';
        }
    });
    dialog.addEventListener("click", (event) => { if (event.target === dialog) closeDialog(); });
    dialog.addEventListener("close", () => {
        document.body.classList.remove("asset-registration-open");
        window.setTimeout(() => returnFocus?.isConnected && returnFocus.focus({ preventScroll: true }), 0);
    });
    if (window.location.hash === "#register") openDialog(document.getElementById("open-asset-registration"));
})();
