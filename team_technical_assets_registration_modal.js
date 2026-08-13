import {
    SEARCH_DOMAIN_OPTIONS,
    WORKFLOW_STAGE_VALUES,
    RESPONSE_TARGET_VALUES,
    normalizeSearchDomain,
    normalizeSearchFacets,
    normalizeSearchMetadata,
    resolveSearchMetadata,
    uniqueSearchValues,
    validateResolvedSearchMetadata
} from "./team_technical_assets_search_metadata.mjs";
import {
    buildGitLabWikiWebUrl,
    cardToGitLabWikiMarkdown,
    nextAssetId,
    registerCardInGitLabWiki
} from "./team_technical_assets_gitlab.js?v=20260731-links-status-1";
import {
    buildFixedGitLabRegistrationConfig,
    fixedGitLabTargetErrors,
    resolveCurrentGitLabRegistrant,
    validateFixedGitLabRegistrationConfig
} from "./team_technical_assets_registration_identity.mjs";
import {
    clearGitLabUserSession,
    loadGitLabUserSession,
    saveGitLabUserSession
} from "./team_technical_assets_user_session.mjs";
import {
    deriveLeanAssetDisplayFields,
    handoffCardType,
    isLeanCorPacket,
    isLeanVdRequestPacket,
    LEAN_V03_CONTENT_LABELS,
    legacyVdRequestMigrationWarnings,
    normalizeCorContent,
    normalizeLeanAssetContent,
    normalizeMethodologyContent as normalizeMethodologyHandoffContent,
    normalizeVdRequestContent,
    validateLeanHandoffPacket
} from "./team_technical_assets_handoff.mjs";
import {
    ACCESS_SCOPES,
    CONTROLLED_VISIBLE_TAG_GROUPS,
    CONTROLLED_VISIBLE_TAGS,
    FRAMEWORK_RELATION_TYPES,
    FRAMEWORK_STATUSES,
    FRAMEWORK_TARGETS,
    LINK_ROLES,
    LINK_TYPES,
    LEARNING_PATH_STATUSES,
    REGISTRATION_CARD_TYPES,
    REGISTRATION_INITIAL_TYPE_STATUSES,
    REGISTRATION_PUBLICATION_STATUSES,
    REGISTRATION_REQUIRED_CONTENT_FIELDS,
    REGISTRATION_TYPE_STATUSES,
    REGISTRATION_TYPE_TAG_FOCUS,
    RELATION_TYPES,
    REQUIRED_EVIDENCE_STATUS_OPTIONS,
    SOURCE_LINK_DECISION_STATUSES,
    TECHNOLOGY_MAP_STATUSES,
    VD_CONTENT_FIELD_NAMES,
    VD_RELATION_USAGE_OPTIONS,
    VD_REQUEST_REQUIRED_EVIDENCE_FIELDS,
    VD_REQUEST_REQUIRED_EVIDENCE_STATUSES
} from "./team_technical_assets_registration_contract.mjs?v=20260731-links-status-1";

export {
    CONTROLLED_VISIBLE_TAG_GROUPS,
    CONTROLLED_VISIBLE_TAGS,
    REGISTRATION_CARD_TYPES,
    REGISTRATION_PUBLICATION_STATUSES,
    REGISTRATION_REQUIRED_CONTENT_FIELDS,
    REGISTRATION_TYPE_STATUSES,
    REGISTRATION_TYPE_TAG_FOCUS,
    SOURCE_LINK_DECISION_STATUSES,
    VD_REQUEST_REQUIRED_EVIDENCE_STATUSES
} from "./team_technical_assets_registration_contract.mjs?v=20260731-links-status-1";

const textValue = (value) => String(value ?? "").trim();
const dateValue = (value = new Date()) => (value instanceof Date ? value : new Date(value)).toISOString().slice(0, 10);
const PLACEHOLDER_VALUES = new Set(["확인 필요", "[확인 필요]", "미확인", "TBD", "N/A"]);
const hasValue = (value) => {
    if (Array.isArray(value)) return value.some(hasValue);
    if (value && typeof value === "object") return Object.values(value).some(hasValue);
    const normalized = textValue(value);
    return normalized.length > 0 && !PLACEHOLDER_VALUES.has(normalized);
};
const valueAtPath = (source, path) => String(path).split(".").reduce(
    (current, key) => current && typeof current === "object" ? current[key] : undefined,
    source
);
const COR_CONTENT_FIELD_NAMES = Object.freeze([
    "corBackgroundAndGap",
    "corObjectiveAndSuccessCriteria",
    "corScopeAndPlan",
    "corValidationDesign",
    "corProgressDecisions",
    "corResultAndJudgment",
    "corOutputsAndFollowUp"
]);
const COR_REQUIRED_CONTENT_FIELDS = Object.freeze([
    "backgroundAndGap",
    "objectiveAndSuccessCriteria",
    "scopeAndPlan",
    "validationDesign",
    "progressDecisions",
    "resultAndJudgment",
    "outputsAndFollowUp"
]);
const COR_COMPLETION_LINK_ROLES = new Set(["evidence", "deliverable", "decision"]);
const METHODOLOGY_CONTENT_FIELD_NAMES = Object.freeze([
    "methodologyProblemAndPurpose",
    "methodologyTechnicalPrinciples",
    "methodologyInputsAndPrerequisites",
    "methodologyStandardProcedure",
    "methodologyResultsAndCriteria",
    "methodologyScopeAndLimits",
    "methodologyValidationAndReuse"
]);
const GENERIC_CONTENT_FIELD_CONFIG = Object.freeze({
    ...Object.fromEntries(Object.entries(LEAN_V03_CONTENT_LABELS).map(([cardType, labels]) => [
        cardType,
        Object.freeze(Object.entries(labels))
    ]))
});
const GENERIC_CONTENT_CARD_TYPES = Object.freeze(Object.keys(GENERIC_CONTENT_FIELD_CONFIG));
const GENERIC_CONTENT_CARD_TYPE_SET = new Set(GENERIC_CONTENT_CARD_TYPES);
const REGISTRATION_ASSET_KEY_TO_TYPE = Object.freeze({
    "vd-request": "VD Request",
    cor: "CoR",
    methodology: "방법론",
    bp: "BP",
    "technical-report": "기술보고서",
    "external-report": "외부 보고 자료",
    knowhow: "노하우",
    "tool-manual": "Tool Manual",
    training: "교육자료"
});
const isSupportedLeanV03Packet = (packet = {}) => textValue(packet.packetVersion) === "0.3"
    && REGISTRATION_CARD_TYPES.includes(handoffCardType(packet));
export const METHODOLOGY_LEVELS = Object.freeze(["미평가", "L1", "L2", "L3", "L4", "L5"]);
const METHODOLOGY_LEVEL_CHANGE_LABELS = Object.freeze({
    unassessed: "미평가 유지",
    initial: "최초 판정",
    maintain: "Level 유지",
    upgrade: "Level 승격",
    downgrade: "Level 하향"
});
const TECHNOLOGY_MAP_STATUS_OPTIONS = Object.freeze([
    ["linked", "기존 Map 연결"],
    ["unlisted_new", "신규·미등재"],
    ["unlisted_omitted", "기존 분류 누락"],
    ["pending", "연결 확인 필요"]
]);
const LEARNING_PATH_STATUS_OPTIONS = Object.freeze([
    ["linked", "연결됨"],
    ["not_applicable", "해당 없음"],
    ["target_missing", "연결 대상 미등록"]
]);
const TECHNOLOGY_MAP_DEFAULT_NOTES = Object.freeze({
    linked: "기존 Technology Map 항목과 연결",
    unlisted_new: "신규 방법론으로 아직 Technology Map에 미등재",
    unlisted_omitted: "기존 Technology Map 분류에서 생략·누락",
    pending: "기존 Technology Map 항목 연결 확인 필요"
});

export function normalizeMethodologyLevel(value, fallback = "") {
    const normalized = textValue(value).toUpperCase().replace(/\s+/g, "");
    if (["미평가", "UNASSESSED", "NOTASSESSED"].includes(normalized)) return "미평가";
    const matched = normalized.match(/^L?([1-5])$/);
    return matched ? `L${matched[1]}` : fallback;
}

export function methodologyLevelChangeType(previousLevel, confirmedLevel) {
    const previous = normalizeMethodologyLevel(previousLevel, "미평가");
    const confirmed = normalizeMethodologyLevel(confirmedLevel, "미평가");
    if (confirmed === "미평가") return "unassessed";
    if (previous === "미평가") return "initial";
    if (previous === confirmed) return "maintain";
    return METHODOLOGY_LEVELS.indexOf(confirmed) > METHODOLOGY_LEVELS.indexOf(previous)
        ? "upgrade"
        : "downgrade";
}

export function normalizeMethodologyContent(content = {}) {
    const source = content && typeof content === "object" && !Array.isArray(content) ? content : {};
    const validationSource = source.validationAndReuse;
    const evidence = validationSource && typeof validationSource === "object" && !Array.isArray(validationSource)
        ? validationSource.evidence
        : validationSource;
    return {
        problemAndPurpose: textValue(source.problemAndPurpose),
        technicalPrinciples: textValue(source.technicalPrinciples),
        inputsAndPrerequisites: uniqueSearchValues(source.inputsAndPrerequisites),
        standardProcedure: uniqueSearchValues(source.standardProcedure),
        resultsAndCriteria: textValue(source.resultsAndCriteria),
        scopeAndLimits: uniqueSearchValues(source.scopeAndLimits),
        validationAndReuse: {
            evidence: uniqueSearchValues(evidence)
        }
    };
}

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
    const type = textValue(source.cardType || source.cardTypeCandidate || source.type);
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

export function resolveRegistrationSearchFacets(packet = {}, internalFacets = {}) {
    const packetSearchFacets = normalizeSearchFacets(packet);
    const hasInternal = (key) => Object.hasOwn(internalFacets, key) && internalFacets[key] !== undefined;
    const value = (key) => uniqueSearchValues(
        hasInternal(key)
            ? internalFacets[key]
            : packetSearchFacets[key]
    );

    return {
        problemPhenomena: value("problemPhenomena").slice(0, 3),
        productStructureProcess: value("productStructureProcess"),
        toolModelData: value("toolModelData")
    };
}

export function handoffFactsToConfirm(packet = {}) {
    return uniqueSearchValues(
        packet.internalCompletion?.factsToConfirm
        ?? packet.itemsToConfirm
        ?? packet.registrationSource?.factsToConfirm
    );
}

function normalizedRequiredEvidence(value = {}, registrant = "", decidedAt = "") {
    return Object.fromEntries(Object.keys(VD_REQUEST_REQUIRED_EVIDENCE_FIELDS).map((key) => {
        const source = value?.[key] && typeof value[key] === "object" && !Array.isArray(value[key])
            ? value[key]
            : {};
        return [key, {
            status: VD_REQUEST_REQUIRED_EVIDENCE_STATUSES.includes(textValue(source.status)) ? textValue(source.status) : "",
            note: textValue(source.note),
            decidedBy: textValue(source.decidedBy || registrant),
            decidedAt: textValue(source.decidedAt || decidedAt)
        }];
    }));
}

function normalizedRelations(relations, registrationId) {
    return (Array.isArray(relations) ? relations : []).map((relation) => ({
        ...relation,
        type: textValue(relation.type) || "RELATED_TO",
        usageType: textValue(relation.usageType),
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
        sourceVersion: textValue(link.sourceVersion),
        role: textValue(link.role) || "reference",
        accessScope: textValue(link.accessScope) || "권한 확인 필요",
        status: link.status === "verified" ? "verified" : "pending",
        verifiedAt: textValue(link.verifiedAt),
        registrationId
    })).filter((link) => link.href);
}

function normalizedSourceLinkDecision(originalDecision, state, links, registrant, now) {
    const original = originalDecision && typeof originalDecision === "object" && !Array.isArray(originalDecision)
        ? originalDecision
        : {};
    const hasUiDecision = Object.prototype.hasOwnProperty.call(state, "noInternalLink");
    const status = links.length
        ? "linked"
        : (state.noInternalLink === true
            ? "no_internal_asset"
            : (hasUiDecision ? "pending" : textValue(original.status) || "pending"));
    const isDecided = SOURCE_LINK_DECISION_STATUSES.includes(status);
    const decisionChanged = links.length || state.noInternalLink === true;
    return {
        status,
        reason: status === "no_internal_asset"
            ? textValue(state.noInternalLinkReason || original.reason)
            : "",
        decidedBy: isDecided
            ? textValue(decisionChanged ? registrant : original.decidedBy || registrant)
            : "",
        decidedAt: isDecided
            ? textValue(decisionChanged ? now : original.decidedAt || now)
            : ""
    };
}

export function buildRegistrationCard(sourcePacket = {}, internal = {}, state = {}) {
    const original = sourcePacket?.schemaVersion && sourcePacket?.content ? sourcePacket : {};
    const sourceType = handoffCardType(sourcePacket);
    const normalizedLeanContent = isSupportedLeanV03Packet(sourcePacket)
        ? normalizeLeanAssetContent(sourcePacket)
        : null;
    const normalizedVdRequestContent = sourceType === "VD Request"
        ? normalizeVdRequestContent(sourcePacket)
        : null;
    const normalizedCorContent = sourceType === "CoR"
        ? normalizeCorContent(sourcePacket)
        : null;
    const contentDisplay = sourceType
        ? deriveLeanAssetDisplayFields(sourcePacket)
        : { summary: "", useCase: "", contents: "" };
    const now = state.now ? dateValue(state.now) : dateValue();
    const registrationId = textValue(state.registrationId || original.registrationId);
    const searchFacets = resolveRegistrationSearchFacets(sourcePacket, internal.searchFacets || {});
    const resolvedSearch = resolveSearchMetadata(sourcePacket, {
        domain: internal.domain,
        secondaryDomains: internal.secondaryDomains,
        workflowStages: internal.workflowStages,
        responseTargets: internal.responseTargets,
        tags: internal.tags,
        aliases: internal.aliases,
        expectedQueries: internal.expectedQueries,
        confirmedInternally: internal.searchMetadataConfirmed === true
    });
    const facetTags = uniqueSearchValues([
        ...searchFacets.problemPhenomena,
        ...searchFacets.productStructureProcess,
        ...searchFacets.toolModelData
    ]);
    const finalTags = uniqueSearchValues([...resolvedSearch.tags, ...facetTags]);
    const internalTypeSpecific = internal.typeSpecific && typeof internal.typeSpecific === "object" && !Array.isArray(internal.typeSpecific)
        ? internal.typeSpecific
        : null;
    const sourceTypeSpecific = sourcePacket.typeSpecific && typeof sourcePacket.typeSpecific === "object" && !Array.isArray(sourcePacket.typeSpecific)
        ? sourcePacket.typeSpecific
        : null;
    let content = internalTypeSpecific
        || original.content
        || normalizedLeanContent
        || normalizedVdRequestContent
        || normalizedCorContent
        || (sourcePacket.content && typeof sourcePacket.content === "object" && !Array.isArray(sourcePacket.content)
            ? sourcePacket.content
            : null)
        || sourceTypeSpecific
        || {
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
    const sourceLinkDecision = normalizedSourceLinkDecision(
        original.internalCompletion?.sourceLinkDecision,
        state,
        internalLinks,
        registrant,
        now
    );
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
    const sourceFactsToConfirm = handoffFactsToConfirm(sourcePacket);
    const factResolutions = (Array.isArray(state.factResolutions)
        ? state.factResolutions
        : (original.internalCompletion?.factResolutions || []))
        .map((item) => ({
            question: textValue(item?.question),
            answer: textValue(item?.answer),
            resolvedBy: textValue(item?.resolvedBy || registrant),
            resolvedAt: textValue(item?.resolvedAt || now)
        }))
        .filter((item) => item.question);
    const resolutionByQuestion = new Map(factResolutions.map((item) => [item.question, item.answer]));
    const unresolvedFacts = sourceFactsToConfirm.filter((question) => !textValue(resolutionByQuestion.get(question)));
    const resolvedType = textValue(internal.type || original.type || sourceType);
    const externalContentConfirmedNow = resolvedType === "VD Request"
        ? internal.vdContentConfirmed === true
        : (resolvedType === "CoR"
            ? internal.corContentConfirmed === true
            : (resolvedType === "방법론"
                ? internal.methodologyContentConfirmed === true
                : (GENERIC_CONTENT_CARD_TYPE_SET.has(resolvedType) && internal.genericContentConfirmed === true)));
    const projectCompletionConfirmedNow = resolvedType === "CoR"
        && ["완료", "Drop"].includes(textValue(internal.status || original.status || sourcePacket.status || "완료"));
    const requiredEvidence = resolvedType === "VD Request"
        ? normalizedRequiredEvidence(
            state.requiredEvidence ?? original.internalCompletion?.requiredEvidence,
            registrant,
            now
        )
        : null;
    if (requiredEvidence) {
        content = {
            ...content,
            requesterFeedback: ["deferred", "not_applicable"].includes(requiredEvidence.requesterFeedback.status)
                ? null
                : content?.requesterFeedback,
            decisionImpact: ["deferred", "not_applicable"].includes(requiredEvidence.decisionImpact.status)
                ? null
                : content?.decisionImpact
        };
    }
    const searchMetadata = {
        ...resolvedSearch.searchMetadata,
        visibleTags: finalTags,
        primaryDomain: resolvedSearch.domain,
        secondaryDomains: resolvedSearch.secondaryDomains,
        searchFacets,
        confirmedBy: internal.searchMetadataConfirmed === true ? registrant : "",
        confirmedAt: internal.searchMetadataConfirmed === true ? now : ""
    };
    const methodologySource = internal.methodology && typeof internal.methodology === "object" && !Array.isArray(internal.methodology)
        ? internal.methodology
        : null;
    const originalMethodology = original.internalCompletion?.methodology && typeof original.internalCompletion.methodology === "object"
        ? original.internalCompletion.methodology
        : null;
    const methodology = resolvedType === "방법론" && (methodologySource || originalMethodology)
        ? (() => {
            const source = methodologySource || originalMethodology || {};
            const previousLevel = normalizeMethodologyLevel(source.previousLevel, "미평가");
            const proposedLevel = normalizeMethodologyLevel(source.proposedLevel);
            const confirmedLevel = normalizeMethodologyLevel(source.confirmedLevel, previousLevel);
            const mapSource = source.technologyMap && typeof source.technologyMap === "object"
                ? source.technologyMap
                : {};
            const mapStatus = TECHNOLOGY_MAP_STATUSES.includes(textValue(mapSource.status))
                ? textValue(mapSource.status)
                : "pending";
            const evidenceRefs = uniqueSearchValues([
                ...uniqueSearchValues(source.evidenceRefs),
                ...internalLinks.map((link) => link.href)
            ]);
            return {
                previousLevel,
                proposedLevel,
                confirmedLevel,
                changeType: methodologyLevelChangeType(previousLevel, confirmedLevel),
                rationale: textValue(source.rationale),
                evidenceRefs,
                technologyMap: {
                    status: mapStatus,
                    targetId: mapStatus === "linked" ? textValue(mapSource.targetId) : "",
                    note: textValue(mapSource.note) || TECHNOLOGY_MAP_DEFAULT_NOTES[mapStatus]
                }
            };
        })()
        : null;

    return {
        ...original,
        schemaVersion: original.schemaVersion || "1.0",
        registrationId,
        id: textValue(internal.id || original.id),
        type: resolvedType,
        title: textValue(internal.title || original.title || sourcePacket.actualTitle || sourcePacket.workingTitle),
        domain: resolvedSearch.domain,
        secondaryDomains: resolvedSearch.secondaryDomains,
        contexts: resolvedSearch.contexts,
        publicationStatus: textValue(internal.publicationStatus || original.publicationStatus || "초안"),
        status: textValue(internal.status || original.status || (resolvedType === "CoR" ? "완료" : "")),
        owner: textValue(internal.owner || original.owner || registrant),
        registrant,
        reviewer: textValue(internal.reviewer || original.reviewer),
        contributors: uniqueSearchValues(internal.contributors ?? original.contributors ?? sourcePacket.contributors),
        createdAt: textValue(original.createdAt) || now,
        updatedAt: now,
        summary: textValue(internal.summary || original.summary || contentDisplay.summary || sourcePacket.abstractContext || sourcePacket.observationsAndResult),
        useCase: textValue(internal.useCase || original.useCase || contentDisplay.useCase || sourcePacket.primaryQuestion),
        contents: textValue(internal.contents || original.contents || contentDisplay.contents || sourcePacket.approachOrContent || sourcePacket.observationsAndResult),
        tags: finalTags,
        aliases: resolvedSearch.aliases,
        searchMetadata,
        sourceIds: uniqueSearchValues(original.sourceIds || sourcePacket.sourceIds),
        links: internalLinks,
        relations: selectedRelations,
        frameworkLinks,
        frameworkLinkDecisions,
        internalCompletion: {
            sourceFactsToConfirm,
            factResolutions,
            unresolvedFacts,
            ...(REGISTRATION_CARD_TYPES.includes(resolvedType) ? {
                externalContentConfirmed: externalContentConfirmedNow || original.internalCompletion?.externalContentConfirmed === true,
                externalContentConfirmedBy: externalContentConfirmedNow
                    ? registrant
                    : textValue(original.internalCompletion?.externalContentConfirmedBy),
                externalContentConfirmedAt: externalContentConfirmedNow
                    ? now
                    : textValue(original.internalCompletion?.externalContentConfirmedAt)
            } : {}),
            ...(resolvedType === "CoR" ? {
                projectCompletionConfirmed: projectCompletionConfirmedNow || original.internalCompletion?.projectCompletionConfirmed === true,
                projectCompletionConfirmedBy: projectCompletionConfirmedNow
                    ? registrant
                    : textValue(original.internalCompletion?.projectCompletionConfirmedBy),
                projectCompletionConfirmedAt: projectCompletionConfirmedNow
                    ? now
                    : textValue(original.internalCompletion?.projectCompletionConfirmedAt)
            } : {}),
            ...(requiredEvidence ? { requiredEvidence } : {}),
            ...(methodology ? { methodology } : {}),
            sourceLinkDecision,
            automaticallyFilled: ["registrationId", "id", "owner", "registrant", "createdAt", "updatedAt"],
            requiresInternalInput: [
                "reviewer",
                ...(requiredEvidence ? ["requesterFeedback", "decisionImpact"] : []),
                ...(resolvedType === "CoR" ? ["completionEvidence"] : []),
                ...(resolvedType === "방법론" ? ["methodologyQualification", "methodologyLevel", "technologyMap"] : []),
                "relations",
                "sourceLinkDecision",
                "links",
                "frameworkLinks"
            ]
        },
        searchReuse: {
            ...(original.searchReuse || {}),
            performed: state.relationSearchPerformed === true || original.searchReuse?.performed === true,
            searchedAt: now,
            searchedBy: registrant,
            indexVersion: textValue(state.relationIndexVersion || original.searchReuse?.indexVersion),
            searchTerms: relationSearchTerms,
            foundAssetIds: selectedRelations.map((relation) => relation.targetId),
            decision: selectedRelations.length ? "linked" : (state.noRelationFound === true ? "no-candidate" : "pending"),
            usageType: selectedRelations.length
                ? uniqueSearchValues(selectedRelations.map((relation) => relation.usageType || relation.type)).join(", ")
                : (state.noRelationFound === true ? "적합 자산 없음" : ""),
            reason: selectedRelations.length ? selectedRelations.map((relation) => relation.note).filter(Boolean).join("; ") : textValue(state.noRelationReason),
            reviewerConfirmed: original.searchReuse?.reviewerConfirmed === true
        },
        aiAssistance: {
            ...(original.aiAssistance || {}),
            externalStructured: ["0.2", "0.3"].includes(textValue(sourcePacket.packetVersion)) || original.aiAssistance?.externalStructured === true,
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
            originalPreservedInContent: Boolean(sourceTypeSpecific || normalizedLeanContent || sourcePacket.content),
            typeSpecificJsonValid: state.typeSpecificJsonValid !== false,
            migrationWarnings: legacyVdRequestMigrationWarnings(sourcePacket),
            groupedSections: ["basicInformation", "typeSpecific", "searchMetadata", "relations", "internalLinks", "frameworkLinks", "validationHistory"]
        }
    };
}

function validateSourceLinkDecision(card, errors) {
    const links = Array.isArray(card.links) ? card.links : [];
    const decision = card.internalCompletion?.sourceLinkDecision ?? {};
    const status = textValue(decision.status);
    if (links.length) {
        if (status === "no_internal_asset") {
            errors.push("회사 내부 자산 링크와 '연결할 회사 내부 자산 없음'을 동시에 선택할 수 없습니다.");
        } else if (status !== "linked") {
            errors.push("추가한 회사 내부 자산 링크를 연결됨 상태로 확정하세요.");
        }
    } else if (status !== "no_internal_asset") {
        errors.push("회사 내부 자산 링크를 추가하거나 '연결할 회사 내부 자산 없음'을 선택하세요.");
    }
    if (status === "no_internal_asset" && !textValue(decision.reason)) {
        errors.push("회사 내부 자산이 없는 이유를 입력하세요.");
    }
    if (SOURCE_LINK_DECISION_STATUSES.includes(status)) {
        if (!textValue(decision.decidedBy)) errors.push("회사 내부 자산 링크 판단자를 기록하세요.");
        if (!/^\d{4}-\d{2}-\d{2}$/.test(textValue(decision.decidedAt))) errors.push("회사 내부 자산 링크 판단일을 기록하세요.");
    }
}

export function validateRegistrationCard(card, sourcePacket = {}) {
    const errors = [];
    if (!/^REG-\d{14}-[A-Z0-9]{4}$/.test(textValue(card.registrationId))) errors.push("유효한 등록 ID가 필요합니다.");
    [["id", "자산 ID"], ["title", "자산 제목"], ["type", "자료 유형"], ["domain", "기술영역"], ["status", "유형별 상태"], ["owner", "담당자"], ["registrant", "등록자"], ["summary", "요약"], ["useCase", "활용 상황"], ["contents", "핵심 내용"]]
        .forEach(([key, label]) => { if (!textValue(card[key])) errors.push(`${label}을(를) 입력하세요.`); });
    if (!textValue(card.reviewer)) errors.push("Reviewer를 지정하세요.");
    if (textValue(card.reviewer) === textValue(card.registrant)) errors.push("Reviewer는 등록자와 다른 Peer여야 합니다.");
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
    const sourceType = handoffCardType(sourcePacket);
    if (sourceType && sourceType !== card.type) errors.push("AI Handoff의 자산유형 후보와 사내에서 선택한 최종 유형이 다릅니다.");
    if (!sourcePacket.schemaVersion && textValue(sourcePacket.packetVersion) === "0.2" && sourcePacket.securitySelfCheck !== "pass") {
        errors.push("v0.2 외부 Handoff JSON은 securitySelfCheck가 pass여야 합니다.");
    }
    if (!Array.isArray(card.tags) || !Array.isArray(card.aliases)) errors.push("검색 태그와 검색 별칭은 배열이어야 합니다.");
    if (!card.tags?.length) errors.push("검색 태그(자동 분류 + 선택 추가)를 1개 이상 입력하세요.");
    const problemPhenomena = uniqueSearchValues(card.searchMetadata?.searchFacets?.problemPhenomena);
    if (problemPhenomena.length < 1 || problemPhenomena.length > 3) errors.push("문제·현상 검색 분류를 1~3개 입력하세요.");
    if (card.registrationSource?.typeSpecificJsonValid === false) errors.push("유형별 상세 내용 JSON을 올바른 객체로 수정하세요.");
    validateSourceLinkDecision(card, errors);
    if (card.internalCompletion?.unresolvedFacts?.length) {
        errors.push(`외부 대화에서 확정하지 못한 사실을 사내에서 확인하세요: ${card.internalCompletion.unresolvedFacts.join(", ")}`);
    }
    if (card.type === "VD Request") {
        if (card.internalCompletion?.externalContentConfirmed !== true) {
            errors.push("외부 AI가 정리한 VD Request 판단 맥락과 결론을 확인하세요.");
        }
        const requiredEvidence = card.internalCompletion?.requiredEvidence || {};
        Object.entries(VD_REQUEST_REQUIRED_EVIDENCE_FIELDS).forEach(([key, label]) => {
            const decision = requiredEvidence[key] || {};
            const status = textValue(decision.status);
            const contentValue = card.content?.[key];
            if (!VD_REQUEST_REQUIRED_EVIDENCE_STATUSES.includes(status)) {
                errors.push(`${label}의 처리 상태를 확인 완료·추후 확인·해당 없음 중에서 선택하세요.`);
                return;
            }
            if (status === "confirmed" && key === "requesterFeedback" && !hasValue(contentValue)) {
                errors.push("요청자 피드백을 확인 완료로 선택한 경우 실제 내용을 입력하세요.");
            }
            if (status === "confirmed" && key === "decisionImpact") {
                if (!textValue(contentValue?.summary)) {
                    errors.push("의사결정 영향을 확인 완료로 선택한 경우 실제 영향 요약을 입력하세요.");
                }
            }
            if (status !== "confirmed" && hasValue(contentValue)) {
                errors.push(`${label}을 추후 확인 또는 해당 없음으로 선택한 경우 확정 내용을 비워 두세요.`);
            }
            if (status !== "confirmed" && !textValue(decision.note)) {
                errors.push(`${label}의 ${status === "deferred" ? "추후 확인 계획" : "해당 없음 사유"}을 입력하세요.`);
            }
        });
    }
    if (card.type === "CoR") {
        const leanCorSource = isLeanCorPacket(sourcePacket);
        if (card.internalCompletion?.externalContentConfirmed !== true) {
            errors.push("외부 AI가 정리한 CoR 일곱 영역을 확인하세요.");
        }
        const missingCorContent = COR_REQUIRED_CONTENT_FIELDS.filter(
            (contentField) => !hasValue(valueAtPath(card.content, contentField))
        );
        if (missingCorContent.length) {
            errors.push(`CoR 필수 영역 누락: ${missingCorContent.join(", ")}`);
        }
        if ((leanCorSource || card.publicationStatus === "게시")
            && card.internalCompletion?.sourceLinkDecision?.status !== "no_internal_asset") {
            const completionLinks = (card.links || []).filter((link) => (
                COR_COMPLETION_LINK_ROLES.has(textValue(link.role))
                && link.status === "verified"
                && /^\d{4}-\d{2}-\d{2}$/.test(textValue(link.verifiedAt))
            ));
            if (!completionLinks.length) {
                errors.push("CoR는 검증된 사내 결과물 또는 종료 근거 링크를 1개 이상 연결하세요.");
            }
        }
    }
    if (GENERIC_CONTENT_CARD_TYPE_SET.has(card.type)) {
        if (card.internalCompletion?.externalContentConfirmed !== true) {
            errors.push(`외부 AI가 정리한 ${card.type} 본문을 확인하세요.`);
        }
        const missingGenericContent = (REGISTRATION_REQUIRED_CONTENT_FIELDS[card.type] || []).filter(
            (contentField) => !hasValue(valueAtPath(card.content, contentField))
        );
        if (missingGenericContent.length) {
            errors.push(`${card.type} 필수 영역 누락: ${missingGenericContent.join(", ")}`);
        }
    }
    if (card.type === "방법론" && card.internalCompletion?.methodology) {
        if (card.internalCompletion.externalContentConfirmed !== true) {
            errors.push("외부 AI가 정리한 방법론 7개 영역을 확인하세요.");
        }
        const methodologyContentFields = [
            "problemAndPurpose",
            "technicalPrinciples",
            "inputsAndPrerequisites",
            "standardProcedure",
            "resultsAndCriteria",
            "scopeAndLimits",
            "validationAndReuse.evidence"
        ];
        const missingMethodologyContent = methodologyContentFields.filter(
            (contentField) => !hasValue(valueAtPath(card.content, contentField))
        );
        if (missingMethodologyContent.length) {
            errors.push(`방법론 필수 영역 누락: ${missingMethodologyContent.join(", ")}`);
        }
        const methodology = card.internalCompletion.methodology;
        if (!METHODOLOGY_LEVELS.includes(textValue(methodology.previousLevel))) {
            errors.push("방법론의 기존 Level을 미평가 또는 L1~L5로 기록하세요.");
        }
        if (textValue(methodology.proposedLevel) && !METHODOLOGY_LEVELS.slice(1).includes(textValue(methodology.proposedLevel))) {
            errors.push("외부 AI의 Level 제안은 L1~L5 후보여야 합니다.");
        }
        if (!METHODOLOGY_LEVELS.includes(textValue(methodology.confirmedLevel))) {
            errors.push("방법론의 사내 확정 Level을 미평가 또는 L1~L5로 선택하세요.");
        }
        const expectedChangeType = methodologyLevelChangeType(methodology.previousLevel, methodology.confirmedLevel);
        if (textValue(methodology.changeType) !== expectedChangeType) {
            errors.push("방법론 Level 변경 유형이 기존·확정 Level과 일치하지 않습니다.");
        }
        if (methodology.confirmedLevel !== "미평가" && !textValue(methodology.rationale)) {
            errors.push("방법론의 확정 Level 근거를 확인하세요.");
        }
        if (!Array.isArray(methodology.evidenceRefs)) {
            errors.push("방법론 Level 근거 링크 참조는 배열로 기록하세요.");
        }
        const map = methodology.technologyMap || {};
        if (!TECHNOLOGY_MAP_STATUSES.includes(textValue(map.status))) {
            errors.push("방법론의 Technology Map 상태를 선택하세요.");
        }
        if (map.status === "linked" && !textValue(map.targetId)) {
            errors.push("기존 Technology Map과 연결한 경우 항목 ID를 입력하세요.");
        }
    }
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
        if (card.links?.some((link) => link.status !== "verified" || !/^\d{4}-\d{2}-\d{2}$/.test(link.verifiedAt))) errors.push("게시 전 모든 내부 링크의 접근 가능 여부와 확인일을 기록하세요.");
        const missingContent = (REGISTRATION_REQUIRED_CONTENT_FIELDS[card.type] || []).filter(
            (field) => !hasValue(valueAtPath(card.content, field))
        );
        if (card.type === "VD Request") {
            if (!hasValue(card.content?.judgmentScope) && !hasValue(card.content?.applicability?.judgmentScope)) {
                missingContent.push("judgmentScope");
            }
            if (!hasValue(card.content?.limitations) && !hasValue(card.content?.applicability?.limitations)) {
                missingContent.push("limitations");
            }
        }
        if (missingContent.length) errors.push(`유형별 게시 필드 누락: ${missingContent.join(", ")}`);
    }
    return [...new Set(errors)];
}

const REVIEWER_FOLLOW_UP_ERROR_PATTERNS = Object.freeze([
    /^외부 대화에서 확정하지 못한 사실/,
    /^기존 Wiki 자산 검색/,
    /^연결 자산/,
    /^연결 후보/,
    /^모든 연결 자산/,
    /^모든 연결 관계/,
    /Technology Map/,
    /Learning Path/
]);

const isReviewerFollowUpError = (message) => REVIEWER_FOLLOW_UP_ERROR_PATTERNS.some(
    (pattern) => pattern.test(textValue(message))
);

export function splitRegistrationValidation(card, sourcePacket = {}) {
    const all = validateRegistrationCard(card, sourcePacket);
    const followUps = all.filter(isReviewerFollowUpError);
    const followUpSet = new Set(followUps);
    return {
        blockers: all.filter((message) => !followUpSet.has(message)),
        followUps
    };
}

export function validateInitialRegistrationCard(card, sourcePacket = {}) {
    return splitRegistrationValidation(card, sourcePacket).blockers;
}

export function collectReviewerFollowUps(card, sourcePacket = {}) {
    return splitRegistrationValidation(card, sourcePacket).followUps;
}

export function validateImportedHandoffPacket(parsed) {
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") throw new Error("JSON 객체가 아닙니다.");
    if (parsed.schemaVersion && parsed.content) return;

    const packetVersion = textValue(parsed.packetVersion);
    if (packetVersion === "0.3") {
        const errors = validateLeanHandoffPacket(parsed);
        if (errors.length) throw new Error(`Lean v0.3 검증 실패: ${errors.join(" / ")}`);
        return;
    }
    if (packetVersion !== "0.2") throw new Error("외부 Handoff JSON은 9개 기술자산 유형의 Lean v0.3 또는 기존 v0.2여야 합니다.");
    if (parsed.securitySelfCheck !== "pass") throw new Error("v0.2 외부 Handoff JSON은 securitySelfCheck가 pass여야 합니다.");
    if (!REGISTRATION_CARD_TYPES.includes(textValue(parsed.cardTypeCandidate))) throw new Error("지원하는 cardTypeCandidate가 없습니다.");
    if (!parsed.typeSpecific || typeof parsed.typeSpecific !== "object" || Array.isArray(parsed.typeSpecific)) {
        throw new Error("v0.2 외부 Handoff JSON에 자산유형별 typeSpecific 객체가 필요합니다.");
    }
}

if (typeof document !== "undefined") (() => {
    const TYPES = REGISTRATION_CARD_TYPES;
    const DOMAINS = SEARCH_DOMAIN_OPTIONS.map((domain) => [domain.id, domain.label]);
    const PUBLICATION_STATUSES = REGISTRATION_PUBLICATION_STATUSES;
    const VD_RELATION_TYPE_BY_USAGE = Object.fromEntries(VD_RELATION_USAGE_OPTIONS);

    const dialog = document.getElementById("asset-registration-dialog");
    const form = document.getElementById("asset-registration-form");
    if (!dialog || !form) return;

    const connectionDialog = document.getElementById("gitlab-connection-dialog");
    const connectionForm = document.getElementById("gitlab-connection-form");
    const connectionToken = document.getElementById("gitlab-connection-token");
    const connectionStatus = document.getElementById("gitlab-connection-status");
    const fileInput = document.getElementById("registration-json-file");
    const dropZone = document.getElementById("registration-drop-zone");
    const nextButton = document.getElementById("registration-next");
    const previousButton = document.getElementById("registration-previous");
    const publishButton = document.getElementById("registration-publish");
    const importMessage = document.getElementById("registration-import-message");
    const preview = document.getElementById("registration-json-preview");
    const wikiPreview = document.getElementById("registration-wiki-preview");
    const validation = document.getElementById("registration-validation");
    let currentStep = 1;
    let sourcePacket = null;
    let sourceFileName = "";
    let returnFocus = null;
    let connectionReturnFocus = null;
    let selectedRelations = [];
    let internalLinks = [];
    let relationSearchPerformed = false;
    let automaticRelationSearchTerms = [];
    let relationIndexVersion = "";
    let additionalTagCandidates = [];
    let registrationId = "";
    let verifiedGitLabUser = null;
    let gitLabUserSession = loadGitLabUserSession();
    let isPreviewMode = false;
    let currentFactsToConfirm = [];
    const EXAMPLE_PACKET_URLS = Object.freeze({
        "vd-request": "04_technical_assets/examples/vd_request_registration_screen.example.json",
        cor: "04_technical_assets/examples/cor_handoff_v0.3.example.json",
        methodology: "04_technical_assets/examples/methodology_handoff_v0.3.example.json",
        bp: "04_technical_assets/examples/bp_handoff_v0.3.example.json",
        "technical-report": "04_technical_assets/examples/technical_report_handoff_v0.3.example.json",
        "external-report": "04_technical_assets/examples/external_report_handoff_v0.3.example.json",
        knowhow: "04_technical_assets/examples/knowhow_handoff_v0.3.example.json",
        "tool-manual": "04_technical_assets/examples/tool_manual_handoff_v0.3.example.json",
        training: "04_technical_assets/examples/education_material_handoff_v0.3.example.json"
    });

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

    function choiceContainer(name) {
        return form.querySelector(`[data-registration-choice="${name}"]`);
    }

    function renderChoiceSelector(name) {
        const select = field(name);
        const container = choiceContainer(name);
        if (!select || !container) return;
        container.innerHTML = [...select.options]
            .filter((option) => option.value)
            .map((option) => `<button class="wiki-filter-chip registration-choice-chip" type="button" data-choice-value="${escapeHtml(option.value)}" aria-pressed="false">${escapeHtml(option.textContent)}</button>`)
            .join("");
        syncChoiceSelector(name);
    }

    function syncChoiceSelector(name) {
        const select = field(name);
        const container = choiceContainer(name);
        if (!select || !container) return;
        const primaryDomain = field("domain")?.value || "";
        if (name === "secondaryDomains" && primaryDomain) {
            [...select.options].forEach((option) => {
                if (option.value === primaryDomain) option.selected = false;
            });
        }
        const selected = new Set(selectedValues(select));
        const maxSelected = Number(container.dataset.maxSelected || 0);
        container.querySelectorAll("[data-choice-value]").forEach((button) => {
            const value = button.dataset.choiceValue;
            const isSelected = selected.has(value);
            const isPrimaryDuplicate = name === "secondaryDomains" && value === primaryDomain;
            const isAtLimit = maxSelected > 0 && selected.size >= maxSelected && !isSelected;
            const unavailable = isPrimaryDuplicate || isAtLimit;
            button.classList.toggle("is-selected", isSelected);
            button.classList.toggle("is-unavailable", unavailable);
            button.setAttribute("aria-pressed", String(isSelected));
            button.setAttribute("aria-disabled", String(unavailable));
            button.disabled = unavailable;
        });
    }

    function syncAllChoiceSelectors() {
        ["domain", "secondaryDomains", "workflowStages", "responseTargets", "methodologyTechnologyMapStatus"].forEach(syncChoiceSelector);
    }

    function handleChoiceSelectorClick(event) {
        const button = event.target.closest("[data-choice-value]");
        const container = button?.closest("[data-registration-choice]");
        if (!button || !container || button.disabled) return;
        const name = container.dataset.registrationChoice;
        const select = field(name);
        const option = [...select.options].find((item) => item.value === button.dataset.choiceValue);
        if (!option) return;
        if (container.dataset.choiceMode === "single") {
            select.value = option.value;
        } else {
            const maxSelected = Number(container.dataset.maxSelected || 0);
            const currentCount = selectedValues(select).length;
            if (!option.selected && maxSelected > 0 && currentCount >= maxSelected) {
                setMessage(`보조 기술영역은 최대 ${maxSelected}개까지 선택할 수 있습니다.`, "error");
                return;
            }
            option.selected = !option.selected;
        }
        container.removeAttribute("aria-invalid");
        select.dispatchEvent(new Event("change", { bubbles: true }));
    }

    function actorValue(value) {
        const normalized = text(value).replace(/^@+/, "");
        return normalized ? `@${normalized}` : "";
    }

    function setCurrentRegistrant(value, { verified = false, previewMode = false } = {}) {
        const actor = actorValue(value);
        field("owner").value = actor;
        field("registrant").value = actor;
        const currentStatus = document.getElementById("registration-current-user-status");
        const verifiedStatus = document.getElementById("registration-verified-user");
        if (currentStatus) {
            currentStatus.textContent = actor
                ? (previewMode ? `${actor} · 미리보기` : `${actor} · 확인됨`)
                : "GitLab 연결 전";
            currentStatus.classList.toggle("is-verified", Boolean(actor));
        }
        if (verifiedStatus) {
            verifiedStatus.textContent = actor
                ? (previewMode ? `${actor} · 예시` : actor)
                : "GitLab 연결 필요";
            verifiedStatus.classList.toggle("is-verified", Boolean(actor));
        }
        verifiedGitLabUser = verified && actor ? { actor } : null;
    }

    function gitLabConfigFromSession() {
        return buildFixedGitLabRegistrationConfig(
            window.TECHNICAL_ASSET_GITLAB_CONFIG || {},
            gitLabUserSession?.token || ""
        );
    }

    function syncGitLabConnectionUi() {
        const actor = actorValue(gitLabUserSession?.actor);
        const wikiUser = document.getElementById("wiki-current-user");
        const connectionButton = document.getElementById("open-gitlab-connection");
        const registrationConnectionButton = document.getElementById("registration-open-gitlab-connection");
        const disconnectButton = document.getElementById("disconnect-gitlab-user");
        if (wikiUser) {
            wikiUser.textContent = actor || "연결 전";
            wikiUser.classList.toggle("is-connected", Boolean(actor));
        }
        if (connectionButton) {
            connectionButton.querySelector("span").textContent = actor ? "GitLab 연결 관리" : "GitLab 사용자 연결";
        }
        if (registrationConnectionButton) registrationConnectionButton.hidden = Boolean(actor);
        if (disconnectButton) disconnectButton.hidden = !actor;
        if (!isPreviewMode) setCurrentRegistrant(actor, { verified: Boolean(actor) });
    }

    async function verifyCurrentRegistrant(config = gitLabConfigFromSession()) {
        if (isPreviewMode) throw new Error("예시 미리보기에서는 실제 GitLab 계정을 확인하거나 등록하지 않습니다.");
        const result = await resolveCurrentGitLabRegistrant(config);
        setCurrentRegistrant(result.user.actor, { verified: true });
        return result;
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
            const allowedStatuses = key === "technologyMap" ? TECHNOLOGY_MAP_STATUSES : LEARNING_PATH_STATUSES;
            field(`${key}Status`).value = allowedStatuses.includes(decision.status) ? decision.status : "";
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

    function linesFromTextarea(name) {
        return text(field(name)?.value)
            .split(/\r?\n/)
            .map((item) => item.trim())
            .filter(Boolean);
    }

    const GENERIC_NESTED_LABELS = Object.freeze({
        status: "상태",
        summary: "요약",
        evidence: "근거",
        areas: "영향 영역",
        pathway: "반영 경로",
        confirmationLevel: "확인 수준",
        validConditions: "유효 조건",
        supportedDecisions: "지원 가능한 판단",
        unsupportedDecisions: "지원하지 않는 판단",
        validityConditions: "유효 조건",
        reviewTriggers: "재검토 조건",
        situationAndGoal: "상황과 목표",
        triggerOrFrequency: "발생 조건·빈도",
        keyDifficulty: "핵심 난점",
        checksBeforeAction: "사전 확인",
        ineffectiveAttempts: "효과 없었던 시도",
        step: "단계",
        action: "수행 내용",
        judgment: "판단 이유",
        completionCriteria: "완료 기준",
        result: "결과",
        evidenceLevel: "근거 수준",
        doNotApply: "적용 금지 조건",
        risksOrFailureSignals: "위험·실패 신호",
        escalationOrRecovery: "Escalation·복구",
        expectedResult: "예상 결과",
        invalidSignals: "비정상 신호",
        stopConditions: "중단 조건",
        commonRisks: "흔한 위험",
        audience: "대상",
        prerequisites: "선수지식",
        methods: "학습 방식",
        expectedDuration: "예상 시간",
        materials: "준비물"
    });

    function genericLeafLabel(path, fallback = "") {
        const key = text(path).split(".").pop();
        return GENERIC_NESTED_LABELS[key] || fallback || key;
    }

    function renderGenericValueEditor(value, path, label = "") {
        if (Array.isArray(value) && value.some((item) => item && typeof item === "object")) {
            return value.map((item, index) => `
                <section class="registration-generic-nested-group">
                    <strong>${escapeHtml(genericLeafLabel(path, label))} ${index + 1}</strong>
                    ${renderGenericValueEditor(item, `${path}.${index}`)}
                </section>
            `).join("");
        }
        if (value && typeof value === "object" && !Array.isArray(value)) {
            return Object.entries(value).map(([key, nestedValue]) => (
                renderGenericValueEditor(nestedValue, `${path}.${key}`, GENERIC_NESTED_LABELS[key] || key)
            )).join("");
        }
        const kind = Array.isArray(value) ? "list" : (typeof value === "number" ? "number" : "text");
        const displayValue = Array.isArray(value) ? value.map(text).filter(Boolean).join("\n") : text(value);
        const fieldLabel = genericLeafLabel(path, label);
        return `
            <label class="registration-field registration-generic-leaf">
                <span>${escapeHtml(fieldLabel)}${kind === "list" ? " <small>한 줄에 하나</small>" : ""}</span>
                <textarea rows="${kind === "list" ? 4 : 3}" data-generic-content-path="${escapeHtml(path)}" data-generic-content-kind="${kind}">${escapeHtml(displayValue)}</textarea>
            </label>
        `;
    }

    function setGenericValueAtPath(target, path, value) {
        const segments = text(path).split(".").filter(Boolean);
        let current = target;
        segments.forEach((segment, index) => {
            if (index === segments.length - 1) {
                current[segment] = value;
                return;
            }
            const nextIsIndex = /^\d+$/.test(segments[index + 1]);
            if (!current[segment] || typeof current[segment] !== "object") {
                current[segment] = nextIsIndex ? [] : {};
            }
            current = current[segment];
        });
    }

    function populateGenericContentReview(content = {}) {
        const cardType = field("type").value;
        const config = GENERIC_CONTENT_FIELD_CONFIG[cardType] || [];
        const normalized = content && typeof content === "object" && !Array.isArray(content) ? content : {};
        const container = document.getElementById("registration-generic-content-fields");
        const summary = document.getElementById("registration-generic-content-summary");
        const subtitle = document.getElementById("registration-generic-content-subtitle");
        if (!container) return;
        if (summary) summary.textContent = `${cardType} AI 작성 본문 ${config.length}개 영역 보기·수정`;
        if (subtitle) subtitle.textContent = `${cardType} 등록 본문 ${config.length}개 영역`;
        container.innerHTML = config.map(([path, label]) => `
            <section class="registration-generic-content-card">
                <h5>${escapeHtml(label)}</h5>
                ${renderGenericValueEditor(valueAtPath(normalized, path), path, label)}
            </section>
        `).join("");
        field("genericContentConfirmed").checked = false;
        updateContentReviewVisibility();
    }

    function readGenericContentReview(baseContent = {}) {
        const base = baseContent && typeof baseContent === "object" && !Array.isArray(baseContent)
            ? baseContent
            : {};
        const content = JSON.parse(JSON.stringify(base));
        document.querySelectorAll("[data-generic-content-path]").forEach((control) => {
            const kind = control.dataset.genericContentKind;
            const raw = text(control.value);
            const value = kind === "list"
                ? raw.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
                : (kind === "number" ? Number(raw) || 0 : raw);
            setGenericValueAtPath(content, control.dataset.genericContentPath, value);
        });
        return content;
    }

    function syncGenericContentReviewToJson() {
        if (!GENERIC_CONTENT_CARD_TYPE_SET.has(field("type").value)) return;
        const parsed = readTypeSpecificJson();
        field("typeSpecificJson").value = JSON.stringify(
            readGenericContentReview(parsed.valid ? parsed.value : {}),
            null,
            2
        );
        validateTypeSpecificInput();
    }

    function updateGenericContentReviewVisibility() {
        const review = document.getElementById("registration-generic-content-review");
        if (!review) return;
        const visible = GENERIC_CONTENT_CARD_TYPE_SET.has(field("type").value);
        review.hidden = !visible;
        field("genericContentConfirmed").required = visible;
        if (!visible) field("genericContentConfirmed").setCustomValidity("");
    }

    function validateGenericContentReview() {
        const cardType = field("type").value;
        if (!GENERIC_CONTENT_CARD_TYPE_SET.has(cardType)) return true;
        syncGenericContentReviewToJson();
        const parsed = readTypeSpecificJson();
        const missing = (REGISTRATION_REQUIRED_CONTENT_FIELDS[cardType] || []).filter(
            (path) => !hasValue(valueAtPath(parsed.value, path))
        );
        const confirmation = field("genericContentConfirmed");
        confirmation.setCustomValidity(confirmation.checked ? "" : `외부 AI가 정리한 ${cardType} 본문을 확인하세요.`);
        if (missing.length || !confirmation.checked) {
            const details = document.getElementById("registration-generic-content-details");
            if (details) details.open = true;
            if (missing.length) {
                setMessage(`${cardType} 필수 영역을 확인하세요: ${missing.join(", ")}`, "error");
                document.querySelector(`[data-generic-content-path="${missing[0]}"]`)?.focus({ preventScroll: true });
            } else {
                confirmation.reportValidity();
                setMessage(`${cardType}의 외부 AI 작성 본문을 확인하세요.`, "error");
            }
            return false;
        }
        return true;
    }

    function populateVdContentReview(content = {}) {
        const normalized = content && typeof content === "object" && !Array.isArray(content) ? content : {};
        const applicability = normalized.applicability && typeof normalized.applicability === "object"
            ? normalized.applicability
            : {};
        field("vdContext").value = text(normalized.context);
        field("vdPrimaryQuestion").value = text(normalized.primaryQuestion);
        field("vdInputsAndConstraints").value = uniqueSearchValues(normalized.inputsAndConstraints).join("\n");
        field("vdApproach").value = text(normalized.approach);
        field("vdEvidenceSummary").value = uniqueSearchValues(normalized.evidenceSummary).join("\n");
        field("vdResult").value = text(normalized.result);
        field("vdJudgmentScope").value = text(applicability.judgmentScope);
        field("vdValidConditions").value = uniqueSearchValues(applicability.validConditions).join("\n");
        field("vdLimitations").value = uniqueSearchValues(applicability.limitations).join("\n");
        field("vdFollowUp").value = uniqueSearchValues(normalized.followUp).join("\n");
        field("vdContentConfirmed").checked = false;
        updateContentReviewVisibility();
    }

    function readVdContentReview(baseContent = {}) {
        const base = baseContent && typeof baseContent === "object" && !Array.isArray(baseContent) ? baseContent : {};
        return {
            ...base,
            context: text(field("vdContext").value),
            primaryQuestion: text(field("vdPrimaryQuestion").value),
            inputsAndConstraints: linesFromTextarea("vdInputsAndConstraints"),
            approach: text(field("vdApproach").value),
            evidenceSummary: linesFromTextarea("vdEvidenceSummary"),
            result: text(field("vdResult").value),
            applicability: {
                ...(base.applicability && typeof base.applicability === "object" ? base.applicability : {}),
                judgmentScope: text(field("vdJudgmentScope").value),
                validConditions: linesFromTextarea("vdValidConditions"),
                limitations: linesFromTextarea("vdLimitations")
            },
            followUp: linesFromTextarea("vdFollowUp")
        };
    }

    function syncVdContentReviewToJson() {
        if (field("type").value !== "VD Request") return;
        const parsed = readTypeSpecificJson();
        const content = readVdContentReview(parsed.valid ? parsed.value : {});
        field("typeSpecificJson").value = JSON.stringify(content, null, 2);
        validateTypeSpecificInput();
    }

    function updateVdContentReviewVisibility() {
        const review = document.getElementById("registration-vd-content-review");
        if (!review) return;
        const visible = field("type").value === "VD Request";
        review.hidden = !visible;
        VD_CONTENT_FIELD_NAMES.forEach((name) => {
            const control = field(name);
            if (!control) return;
            control.required = visible && name !== "vdFollowUp";
            if (!visible) control.setCustomValidity("");
        });
        field("vdContentConfirmed").required = visible;
        if (!visible) field("vdContentConfirmed").setCustomValidity("");
    }

    function validateVdContentReview() {
        if (field("type").value !== "VD Request") return true;
        syncVdContentReviewToJson();
        const requiredLists = [
            ["vdInputsAndConstraints", "입력·전제조건·제약"],
            ["vdEvidenceSummary", "관찰 근거"],
            ["vdValidConditions", "유효조건"],
            ["vdLimitations", "한계"]
        ];
        const controls = [
            ...VD_CONTENT_FIELD_NAMES
                .filter((name) => name !== "vdFollowUp")
                .map((name) => ({
                    control: field(name),
                    valid: Boolean(text(field(name).value)),
                    message: "외부 AI가 정리한 VD Request 필수 내용을 확인하세요."
                })),
            ...requiredLists.map(([name, label]) => ({
                control: field(name),
                valid: linesFromTextarea(name).length > 0,
                message: `${label}은(는) 완성 문장 1개 이상이 필요합니다.`
            })),
            {
                control: field("vdContentConfirmed"),
                valid: field("vdContentConfirmed").checked,
                message: "외부 AI가 정리한 판단 맥락과 결론을 확인하세요."
            }
        ];
        controls.forEach(({ control, valid, message }) => control.setCustomValidity(valid ? "" : message));
        const firstInvalid = controls.find(({ valid }) => !valid);
        if (firstInvalid) {
            document.querySelector("#registration-vd-content-review .registration-ai-content-editor")?.setAttribute("open", "");
            firstInvalid.control.reportValidity();
            setMessage("VD Request의 외부 AI 작성 내용을 확인하고, 사실과 다른 부분만 수정하세요.", "error");
            return false;
        }
        return true;
    }

    function populateCorContentReview(content = {}) {
        const normalized = content && typeof content === "object" && !Array.isArray(content) ? content : {};
        field("corBackgroundAndGap").value = text(normalized.backgroundAndGap);
        field("corObjectiveAndSuccessCriteria").value = text(normalized.objectiveAndSuccessCriteria);
        field("corScopeAndPlan").value = text(normalized.scopeAndPlan);
        field("corValidationDesign").value = text(normalized.validationDesign);
        field("corProgressDecisions").value = uniqueSearchValues(normalized.progressDecisions).join("\n");
        field("corResultAndJudgment").value = text(normalized.resultAndJudgment);
        field("corOutputsAndFollowUp").value = uniqueSearchValues(normalized.outputsAndFollowUp).join("\n");
        field("corContentConfirmed").checked = false;
        updateContentReviewVisibility();
    }

    function readCorContentReview(baseContent = {}) {
        const base = baseContent && typeof baseContent === "object" && !Array.isArray(baseContent) ? baseContent : {};
        return {
            ...base,
            backgroundAndGap: text(field("corBackgroundAndGap").value),
            objectiveAndSuccessCriteria: text(field("corObjectiveAndSuccessCriteria").value),
            scopeAndPlan: text(field("corScopeAndPlan").value),
            validationDesign: text(field("corValidationDesign").value),
            progressDecisions: linesFromTextarea("corProgressDecisions"),
            resultAndJudgment: text(field("corResultAndJudgment").value),
            outputsAndFollowUp: linesFromTextarea("corOutputsAndFollowUp")
        };
    }

    function syncCorContentReviewToJson() {
        if (field("type").value !== "CoR") return;
        const parsed = readTypeSpecificJson();
        const content = readCorContentReview(parsed.valid ? parsed.value : {});
        field("typeSpecificJson").value = JSON.stringify(content, null, 2);
        validateTypeSpecificInput();
    }

    function updateCorContentReviewVisibility() {
        const review = document.getElementById("registration-cor-content-review");
        if (!review) return;
        const visible = field("type").value === "CoR";
        review.hidden = !visible;
        COR_CONTENT_FIELD_NAMES.forEach((name) => {
            const control = field(name);
            if (!control) return;
            control.required = visible;
            if (!visible) control.setCustomValidity("");
        });
        field("corContentConfirmed").required = visible;
        field("corContentConfirmed").closest("label").hidden = !visible;
        if (!visible) field("corContentConfirmed").setCustomValidity("");
    }

    function validateCorContentReview() {
        if (field("type").value !== "CoR") return true;
        syncCorContentReviewToJson();
        const listFields = new Set(["corProgressDecisions", "corOutputsAndFollowUp"]);
        const controls = [
            ...COR_CONTENT_FIELD_NAMES.map((name) => ({
                control: field(name),
                valid: listFields.has(name)
                    ? linesFromTextarea(name).length > 0
                    : Boolean(text(field(name).value)),
                message: "외부 AI가 정리한 CoR 필수 영역을 확인하세요."
            })),
            {
                control: field("corContentConfirmed"),
                valid: field("corContentConfirmed").checked,
                message: "외부 AI가 정리한 CoR 일곱 영역을 확인하세요."
            }
        ];
        controls.forEach(({ control, valid, message }) => control.setCustomValidity(valid ? "" : message));
        const firstInvalid = controls.find(({ valid }) => !valid);
        if (firstInvalid) {
            document.querySelector("#registration-cor-content-review .registration-ai-content-editor")?.setAttribute("open", "");
            firstInvalid.control.reportValidity();
            setMessage("CoR의 외부 AI 작성 내용을 확인하세요. 과제 종료 여부는 완료·Drop 상태로 확정합니다.", "error");
            return false;
        }
        return true;
    }

    function methodologyValidationSource(content = {}) {
        const value = content?.validationAndReuse;
        return value && typeof value === "object" && !Array.isArray(value) ? value : {};
    }

    function populateMethodologyContentReview(content = {}) {
        const normalized = normalizeMethodologyContent(content);
        field("methodologyProblemAndPurpose").value = normalized.problemAndPurpose;
        field("methodologyTechnicalPrinciples").value = normalized.technicalPrinciples;
        field("methodologyInputsAndPrerequisites").value = normalized.inputsAndPrerequisites.join("\n");
        field("methodologyStandardProcedure").value = normalized.standardProcedure.join("\n");
        field("methodologyResultsAndCriteria").value = normalized.resultsAndCriteria;
        field("methodologyScopeAndLimits").value = normalized.scopeAndLimits.join("\n");
        field("methodologyValidationAndReuse").value = normalized.validationAndReuse.evidence.join("\n");
        field("methodologyContentConfirmed").checked = false;
        updateContentReviewVisibility();
    }

    function readMethodologyContentReview() {
        return {
            problemAndPurpose: text(field("methodologyProblemAndPurpose").value),
            technicalPrinciples: text(field("methodologyTechnicalPrinciples").value),
            inputsAndPrerequisites: linesFromTextarea("methodologyInputsAndPrerequisites"),
            standardProcedure: linesFromTextarea("methodologyStandardProcedure"),
            resultsAndCriteria: text(field("methodologyResultsAndCriteria").value),
            scopeAndLimits: linesFromTextarea("methodologyScopeAndLimits"),
            validationAndReuse: {
                evidence: linesFromTextarea("methodologyValidationAndReuse")
            }
        };
    }

    function syncMethodologyContentReviewToJson() {
        if (field("type").value !== "방법론") return;
        field("typeSpecificJson").value = JSON.stringify(readMethodologyContentReview(), null, 2);
        validateTypeSpecificInput();
    }

    function methodologyMapStatusNote(status, note = "") {
        return text(note) || TECHNOLOGY_MAP_DEFAULT_NOTES[status] || "";
    }

    function updateMethodologyLevelChange() {
        const changeType = methodologyLevelChangeType(
            field("methodologyPreviousLevel")?.value,
            field("methodologyConfirmedLevel")?.value
        );
        const target = document.getElementById("methodology-change-type");
        if (target) target.textContent = METHODOLOGY_LEVEL_CHANGE_LABELS[changeType];
        const rationale = field("methodologyLevelRationale");
        if (rationale) {
            rationale.required = field("type").value === "방법론"
                && normalizeMethodologyLevel(field("methodologyConfirmedLevel")?.value, "미평가") !== "미평가";
        }
    }

    function updateMethodologyMapFields() {
        const status = field("methodologyTechnologyMapStatus")?.value || "";
        const target = form.querySelector("[data-methodology-map-target]");
        const note = form.querySelector("[data-methodology-map-note]");
        const targetInput = field("methodologyTechnologyMapTargetId");
        if (target) target.hidden = status !== "linked";
        if (note) note.hidden = !["unlisted_omitted", "pending"].includes(status);
        if (targetInput) {
            targetInput.required = field("type").value === "방법론" && status === "linked";
            if (!targetInput.required) targetInput.setCustomValidity("");
        }
        syncChoiceSelector("methodologyTechnologyMapStatus");
    }

    function populateMethodologyInternalConfirmation(packet = {}, content = {}, isCard = false) {
        const stored = isCard && packet.internalCompletion?.methodology && typeof packet.internalCompletion.methodology === "object"
            ? packet.internalCompletion.methodology
            : {};
        const levelCandidate = !isCard
            && packet.levelAssessmentCandidate
            && typeof packet.levelAssessmentCandidate === "object"
            && !Array.isArray(packet.levelAssessmentCandidate)
            ? packet.levelAssessmentCandidate
            : {};
        const validation = methodologyValidationSource(content);
        const legacyCurrent = isCard ? normalizeMethodologyLevel(validation.currentLevel) : "";
        const previousLevel = normalizeMethodologyLevel(
            stored.previousLevel || stored.confirmedLevel || legacyCurrent,
            "미평가"
        );
        const proposedLevel = normalizeMethodologyLevel(
            stored.proposedLevel
            || levelCandidate.proposedLevel
            || validation.proposedLevel
            || (!isCard ? validation.currentLevel : "")
        );
        const confirmedLevel = normalizeMethodologyLevel(stored.confirmedLevel, proposedLevel || previousLevel);
        const qualificationOptions = REGISTRATION_INITIAL_TYPE_STATUSES["방법론"] || [];
        const proposedQualification = text(packet.status || validation.methodologyStatus);
        const qualification = qualificationOptions.includes(proposedQualification)
            ? proposedQualification
            : qualificationOptions[0];

        field("methodologyQualification").value = qualification;
        field("status").value = qualification;
        field("methodologyPreviousLevel").value = previousLevel;
        field("methodologyProposedLevel").value = proposedLevel;
        field("methodologyConfirmedLevel").value = confirmedLevel;
        field("methodologyLevelRationale").value = text(
            stored.rationale
            || levelCandidate.rationale
            || validation.levelRationale
            || validation.levelBasis
        );
        field("methodologyContentConfirmed").checked = isCard && packet.internalCompletion?.externalContentConfirmed === true;

        const storedMap = stored.technologyMap && typeof stored.technologyMap === "object" ? stored.technologyMap : {};
        const frameworkMapDecision = packet.frameworkLinkDecisions?.technologyMap || {};
        const frameworkMapLink = (packet.frameworkLinks || []).find((item) => (
            item?.framework === "technology-map" && item?.targetType === "methodology"
        )) || {};
        const mapStatusCandidate = text(storedMap.status || frameworkMapDecision.status);
        const mapStatus = TECHNOLOGY_MAP_STATUSES.includes(mapStatusCandidate) ? mapStatusCandidate : "pending";
        field("methodologyTechnologyMapStatus").value = mapStatus;
        field("methodologyTechnologyMapTargetId").value = text(storedMap.targetId || frameworkMapLink.targetId);
        field("methodologyTechnologyMapNote").value = text(
            storedMap.note
            || frameworkMapLink.note
            || (["unlisted_omitted", "pending"].includes(mapStatus) ? frameworkMapDecision.reason : "")
        );

        const source = document.getElementById("methodology-level-source");
        if (source) {
            source.textContent = isCard && (stored.confirmedLevel || legacyCurrent)
                ? "불러온 기존 Wiki 카드의 마지막 확인 Level입니다."
                : "기존 Wiki Level 자동조회 전 · 신규는 미평가로 시작하며 기존 방법론 개정이면 등록 전 확인합니다.";
        }
        if (!LEARNING_PATH_STATUSES.includes(field("learningPathStatus").value)) {
            field("learningPathStatus").value = "not_applicable";
            field("learningPathReason").value = "방법론 등록에서는 Learning Path 연결을 별도 필수 입력으로 요구하지 않음";
        }
        updateMethodologyLevelChange();
        updateMethodologyMapFields();
        updateContentReviewVisibility();
    }

    function readMethodologyInternalConfirmation() {
        const status = field("methodologyTechnologyMapStatus").value;
        const previousLevel = normalizeMethodologyLevel(field("methodologyPreviousLevel").value, "미평가");
        const proposedLevel = normalizeMethodologyLevel(field("methodologyProposedLevel").value);
        const confirmedLevel = normalizeMethodologyLevel(field("methodologyConfirmedLevel").value, previousLevel);
        return {
            previousLevel,
            proposedLevel,
            confirmedLevel,
            changeType: methodologyLevelChangeType(previousLevel, confirmedLevel),
            rationale: text(field("methodologyLevelRationale").value),
            evidenceRefs: [],
            technologyMap: {
                status,
                targetId: status === "linked" ? text(field("methodologyTechnologyMapTargetId").value) : "",
                note: methodologyMapStatusNote(status, field("methodologyTechnologyMapNote").value)
            }
        };
    }

    function updateMethodologyContentReviewVisibility() {
        const review = document.getElementById("registration-methodology-content-review");
        if (!review) return;
        const visible = field("type").value === "방법론";
        review.hidden = !visible;
        METHODOLOGY_CONTENT_FIELD_NAMES.forEach((name) => {
            const control = field(name);
            if (!control) return;
            control.required = visible;
            if (!visible) control.setCustomValidity("");
        });
        ["methodologyContentConfirmed", "methodologyQualification", "methodologyConfirmedLevel", "methodologyTechnologyMapStatus"].forEach((name) => {
            const control = field(name);
            if (!control) return;
            control.required = visible;
            if (!visible) control.setCustomValidity("");
        });
        const frameworkPanel = form.querySelector(".registration-framework-panel");
        if (frameworkPanel) frameworkPanel.hidden = visible;
        field("technologyMapStatus").required = !visible;
        field("learningPathStatus").required = !visible;
        updateMethodologyLevelChange();
        updateMethodologyMapFields();
    }

    function validateMethodologyContentReview() {
        if (field("type").value !== "방법론") return true;
        syncMethodologyContentReviewToJson();
        const listFields = new Set([
            "methodologyInputsAndPrerequisites",
            "methodologyStandardProcedure",
            "methodologyScopeAndLimits",
            "methodologyValidationAndReuse"
        ]);
        const controls = [
            ...METHODOLOGY_CONTENT_FIELD_NAMES.map((name) => ({
                control: field(name),
                valid: listFields.has(name) ? linesFromTextarea(name).length > 0 : Boolean(text(field(name).value)),
                message: "외부 AI가 정리한 방법론 필수 영역을 확인하세요."
            })),
            {
                control: field("methodologyContentConfirmed"),
                valid: field("methodologyContentConfirmed").checked,
                message: "외부 AI가 정리한 방법론 7개 영역을 확인하세요."
            },
            {
                control: field("methodologyQualification"),
                valid: (REGISTRATION_INITIAL_TYPE_STATUSES["방법론"] || []).includes(field("methodologyQualification").value),
                message: "방법론 후보 또는 정식 방법론을 선택하세요."
            },
            {
                control: field("methodologyConfirmedLevel"),
                valid: METHODOLOGY_LEVELS.includes(field("methodologyConfirmedLevel").value),
                message: "사내 확정 Level을 선택하세요."
            },
            {
                control: field("methodologyLevelRationale"),
                valid: field("methodologyConfirmedLevel").value === "미평가" || Boolean(text(field("methodologyLevelRationale").value)),
                message: "L1~L5를 확정하려면 Level 근거를 확인하세요."
            },
            {
                control: field("methodologyTechnologyMapStatus"),
                choiceName: "methodologyTechnologyMapStatus",
                valid: TECHNOLOGY_MAP_STATUSES.includes(field("methodologyTechnologyMapStatus").value),
                message: "Technology Map 상태를 선택하세요."
            },
            {
                control: field("methodologyTechnologyMapTargetId"),
                valid: field("methodologyTechnologyMapStatus").value !== "linked" || Boolean(text(field("methodologyTechnologyMapTargetId").value)),
                message: "기존 Technology Map과 연결한 경우 항목 ID를 입력하세요."
            }
        ];
        controls.forEach(({ control, choiceName, valid, message }) => {
            control.setCustomValidity(valid ? "" : message);
            const container = choiceName ? choiceContainer(choiceName) : null;
            if (container) {
                if (valid) container.removeAttribute("aria-invalid");
                else container.setAttribute("aria-invalid", "true");
            }
        });
        const firstInvalid = controls.find(({ valid }) => !valid);
        if (firstInvalid) {
            document.querySelector("#registration-methodology-content-review .registration-ai-content-editor")?.setAttribute("open", "");
            const visibleChoice = firstInvalid.choiceName ? choiceContainer(firstInvalid.choiceName) : null;
            if (visibleChoice) visibleChoice.querySelector("button:not(:disabled)")?.focus({ preventScroll: true });
            else firstInvalid.control.reportValidity();
            setMessage("방법론 7개 영역을 확인하고 자격·Level·Technology Map 상태만 확정하세요.", "error");
            return false;
        }
        return true;
    }

    const contentReviewAdapters = Object.freeze({
        "VD Request": Object.freeze({
            populate: populateVdContentReview,
            sync: syncVdContentReviewToJson,
            validate: validateVdContentReview
        }),
        "CoR": Object.freeze({
            populate: populateCorContentReview,
            sync: syncCorContentReviewToJson,
            validate: validateCorContentReview
        }),
        "방법론": Object.freeze({
            populate: populateMethodologyContentReview,
            sync: syncMethodologyContentReviewToJson,
            validate: validateMethodologyContentReview
        })
    });

    const genericContentReviewAdapter = Object.freeze({
        populate: populateGenericContentReview,
        sync: syncGenericContentReviewToJson,
        validate: validateGenericContentReview
    });

    function activeContentReviewAdapter() {
        return contentReviewAdapters[field("type").value]
            || (GENERIC_CONTENT_CARD_TYPE_SET.has(field("type").value) ? genericContentReviewAdapter : null);
    }

    function syncContentReviewToJson() {
        activeContentReviewAdapter()?.sync();
    }

    function updateInternalLinkGuidance() {
        const guidance = document.getElementById("registration-internal-link-guidance");
        const requirement = document.getElementById("registration-internal-link-requirement");
        if (!guidance || !requirement) return;
        if (field("type").value === "CoR") {
            guidance.textContent = "완료 또는 Drop 근거와 사내 결과물을 한 건씩 추가합니다. 여러 개를 연결할 수 있으며, 실제 자산이 없으면 아래에서 없음과 사유를 확정합니다.";
            requirement.textContent = "복수 등록 또는 없음 확인";
            const linkType = document.getElementById("internal-link-type");
            const linkRole = document.getElementById("internal-link-role");
            if (linkType && !internalLinks.length && linkType.value === "VD Request 원문") {
                linkType.value = "Simulation 결과보고서";
            }
            if (linkRole && !internalLinks.length && !COR_COMPLETION_LINK_ROLES.has(linkRole.value)) {
                linkRole.value = "deliverable";
            }
            updateSourceLinkDecisionUi();
            return;
        }
        if (field("type").value === "VD Request") {
            guidance.textContent = "요청 원문과 판단 근거를 한 건씩 추가합니다. 여러 개를 연결할 수 있으며, 실제 자산이 없으면 아래에서 없음과 사유를 확정합니다.";
            requirement.textContent = "복수 등록 또는 없음 확인";
            updateSourceLinkDecisionUi();
            return;
        }
        if (field("type").value === "방법론") {
            guidance.textContent = "Level과 재사용 판단을 뒷받침하는 사내 근거를 필요한 만큼 추가합니다. 실제 파일 자산이 없으면 아래에서 없음과 사유만 확정합니다.";
            requirement.textContent = "복수 등록 또는 없음 확인";
            updateSourceLinkDecisionUi();
            return;
        }
        guidance.textContent = "원본·근거·결과물을 한 건씩 추가합니다. 여러 개를 연결할 수 있으며, 실제 자산이 없으면 아래에서 없음과 사유를 확정합니다.";
        requirement.textContent = "복수 등록 또는 없음 확인";
        updateSourceLinkDecisionUi();
    }

    function updateContentReviewVisibility() {
        updateVdContentReviewVisibility();
        updateCorContentReviewVisibility();
        updateMethodologyContentReviewVisibility();
        updateGenericContentReviewVisibility();
        updateInternalLinkGuidance();
    }

    function validateContentReview() {
        return activeContentReviewAdapter()?.validate() ?? true;
    }

    function validateTypeSpecificInput() {
        const editor = field("typeSpecificJson");
        const valid = readTypeSpecificJson().valid;
        editor.setCustomValidity(valid ? "" : "유형별 상세 내용은 유효한 JSON 객체여야 합니다.");
        return valid;
    }

    function validateRequiredClassificationInput() {
        const problems = uniqueSearchValues(field("problems").value);
        const controls = [
            {
                control: field("type"),
                valid: REGISTRATION_CARD_TYPES.includes(field("type").value),
                message: "자료 유형을 사내에서 선택하세요."
            },
            {
                control: field("domain"),
                choiceName: "domain",
                valid: Boolean(normalizeSearchDomain(field("domain").value)),
                message: "주 기술영역을 사내에서 선택하세요."
            },
            {
                control: field("workflowStages"),
                choiceName: "workflowStages",
                valid: selectedValues(field("workflowStages")).length > 0,
                message: "업무 단계를 하나 이상 사내에서 선택하세요."
            },
            {
                control: field("responseTargets"),
                choiceName: "responseTargets",
                valid: selectedValues(field("responseTargets")).length > 0,
                message: "대응 대상을 하나 이상 사내에서 선택하세요."
            },
            {
                control: field("problems"),
                valid: problems.length >= 1 && problems.length <= 3,
                message: "문제·현상을 1~3개 입력하세요."
            },
            {
                control: field("searchMetadataConfirmed"),
                valid: field("searchMetadataConfirmed").checked,
                message: "답변 근거와 사내 분류체계를 비교해 검색 분류를 확인하세요."
            }
        ];
        controls.forEach(({ control, choiceName, valid, message }) => {
            control.setCustomValidity(valid ? "" : message);
            const container = choiceName ? choiceContainer(choiceName) : null;
            if (container) {
                if (valid) container.removeAttribute("aria-invalid");
                else container.setAttribute("aria-invalid", "true");
            }
        });
        const firstInvalid = controls.find(({ valid }) => !valid);
        if (firstInvalid) {
            const visibleChoice = firstInvalid.choiceName ? choiceContainer(firstInvalid.choiceName) : null;
            if (visibleChoice) {
                visibleChoice.querySelector("button:not(:disabled)")?.focus({ preventScroll: true });
            } else {
                firstInvalid.control.reportValidity();
            }
            setMessage("AI 후보가 비어 있거나 근거가 충분하지 않으면 자료유형·주 기술영역·업무단계·대응대상을 사내에서 직접 확정해야 합니다.", "error");
            return false;
        }
        setMessage("");
        return true;
    }

    function updateRequiredEvidenceFields(key) {
        const status = field(`${key}Status`)?.value || "";
        form.querySelectorAll(`[data-evidence-confirmed="${key}"]`).forEach((element) => {
            element.hidden = status !== "confirmed";
        });
        form.querySelectorAll(`[data-evidence-note="${key}"]`).forEach((element) => {
            element.hidden = !["deferred", "not_applicable"].includes(status);
        });
        const confirmedControls = key === "requesterFeedback"
            ? [field("requesterFeedbackValue")]
            : [field("decisionImpactSummary")];
        confirmedControls.forEach((control) => {
            control.required = status === "confirmed";
            if (status !== "confirmed") control.setCustomValidity("");
        });
        const note = field(`${key}Note`);
        note.required = ["deferred", "not_applicable"].includes(status);
        if (!note.required) note.setCustomValidity("");
    }

    function updateRequiredEvidenceVisibility() {
        const section = document.getElementById("registration-vd-required-evidence");
        if (!section) return;
        const visible = field("type").value === "VD Request";
        section.hidden = !visible;
        Object.keys(VD_REQUEST_REQUIRED_EVIDENCE_FIELDS).forEach((key) => {
            field(`${key}Status`).required = visible;
            if (!visible) field(`${key}Status`).setCustomValidity("");
            updateRequiredEvidenceFields(key);
        });
    }

    function resetRequiredEvidenceInputs() {
        [
            "requesterFeedbackStatus",
            "requesterFeedbackValue",
            "requesterFeedbackNote",
            "decisionImpactStatus",
            "decisionImpactSummary",
            "decisionImpactNote"
        ].forEach((name) => {
            if (field(name)) field(name).value = "";
        });
        updateRequiredEvidenceVisibility();
    }

    function populateRequiredEvidence(packet = {}, content = null, isCard = false) {
        resetRequiredEvidenceInputs();
        const normalizedContent = content && typeof content === "object" && !Array.isArray(content) ? content : {};
        field("requesterFeedbackValue").value = text(normalizedContent.requesterFeedback);
        field("decisionImpactSummary").value = text(normalizedContent.decisionImpact?.summary);

        const stored = isCard ? packet.internalCompletion?.requiredEvidence : null;
        Object.keys(VD_REQUEST_REQUIRED_EVIDENCE_FIELDS).forEach((key) => {
            const decision = stored?.[key] || {};
            field(`${key}Status`).value = VD_REQUEST_REQUIRED_EVIDENCE_STATUSES.includes(text(decision.status))
                ? text(decision.status)
                : "";
            field(`${key}Note`).value = text(decision.note);
            updateRequiredEvidenceFields(key);
        });
        updateRequiredEvidenceVisibility();
    }

    function readRequiredEvidence() {
        return Object.fromEntries(Object.keys(VD_REQUEST_REQUIRED_EVIDENCE_FIELDS).map((key) => [key, {
            status: field(`${key}Status`).value,
            note: field(`${key}Note`).value
        }]));
    }

    function applyRequiredEvidenceToContent(content = {}, requiredEvidence = {}) {
        const normalized = content && typeof content === "object" && !Array.isArray(content) ? { ...content } : {};
        normalized.requesterFeedback = requiredEvidence.requesterFeedback?.status === "confirmed"
            ? text(field("requesterFeedbackValue").value)
            : null;
        normalized.decisionImpact = requiredEvidence.decisionImpact?.status === "confirmed"
            ? {
                outcomes: uniqueSearchValues(normalized.decisionImpact?.outcomes),
                summary: text(field("decisionImpactSummary").value)
            }
            : null;
        return normalized;
    }

    function validateRequiredEvidenceInput() {
        if (field("type").value !== "VD Request") return true;
        const controls = [];
        Object.entries(VD_REQUEST_REQUIRED_EVIDENCE_FIELDS).forEach(([key, label]) => {
            const statusControl = field(`${key}Status`);
            const status = statusControl.value;
            controls.push({
                control: statusControl,
                valid: VD_REQUEST_REQUIRED_EVIDENCE_STATUSES.includes(status),
                message: `${label}의 처리 상태를 선택하세요.`
            });
            if (status === "confirmed") {
                const contentControls = key === "requesterFeedback"
                    ? [field("requesterFeedbackValue")]
                    : [field("decisionImpactSummary")];
                contentControls.forEach((control) => controls.push({
                    control,
                    valid: Boolean(text(control.value)),
                    message: `${label}을 확인 완료로 선택한 경우 실제 내용을 입력하세요.`
                }));
            } else if (["deferred", "not_applicable"].includes(status)) {
                controls.push({
                    control: field(`${key}Note`),
                    valid: Boolean(text(field(`${key}Note`).value)),
                    message: `${label}의 ${status === "deferred" ? "추후 확인 계획" : "해당 없음 사유"}을 입력하세요.`
                });
            }
        });
        controls.forEach(({ control, valid, message }) => control.setCustomValidity(valid ? "" : message));
        const firstInvalid = controls.find(({ valid }) => !valid);
        if (firstInvalid) {
            firstInvalid.control.reportValidity();
            setMessage("요청자 피드백과 의사결정 영향의 처리 상태를 각각 확정하세요.", "error");
            return false;
        }
        setMessage("");
        return true;
    }

    function buildFrameworkRegistration() {
        const links = [];
        const decisions = {};
        if (field("type").value === "방법론") {
            const methodology = readMethodologyInternalConfirmation();
            const map = methodology.technologyMap;
            decisions.technologyMap = {
                status: map.status,
                reason: map.note
            };
            if (map.status === "linked") {
                links.push({
                    ...frameworkConfigs.technologyMap,
                    targetId: map.targetId,
                    relationType: "REFERENCES",
                    note: map.note
                });
            }
            const learningStatus = LEARNING_PATH_STATUSES.includes(field("learningPathStatus").value)
                ? field("learningPathStatus").value
                : "not_applicable";
            const learningNote = text(field("learningPathReason").value)
                || "방법론 등록에서는 Learning Path 연결을 별도 필수 입력으로 요구하지 않음";
            decisions.learningPath = { status: learningStatus, reason: learningNote };
            if (learningStatus === "linked") {
                links.push({
                    ...frameworkConfigs.learningPath,
                    targetId: text(field("learningPathTargetId").value),
                    relationType: field("learningPathRelationType").value || "REFERENCES",
                    note: text(field("learningPathNote").value) || "기존 Learning Path 항목과 연결"
                });
            }
            return { links, decisions };
        }
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
        const statuses = REGISTRATION_INITIAL_TYPE_STATUSES[selectedType] || [];
        const resolvedPreferred = preferred || (selectedType === "CoR" ? "완료" : "");
        setOptions(field("status"), statuses.map((status) => [status, status]));
        field("status").value = statuses.includes(resolvedPreferred) ? resolvedPreferred : (statuses[0] || "");
        if (selectedType === "방법론" && field("methodologyQualification")) {
            field("methodologyQualification").value = field("status").value;
        }
    }

    function slugify(value) {
        return text(value).normalize("NFKD").toLowerCase()
            .replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-+|-+$/g, "") || `asset-${Date.now()}`;
    }

    function setMessage(message, type = "") {
        importMessage.textContent = message;
        importMessage.className = `registration-message${type ? ` is-${type}` : ""}`;
    }

    function renderFactsToConfirm(packet = {}) {
        const container = document.getElementById("registration-facts-to-confirm");
        const empty = document.getElementById("registration-facts-empty");
        if (!container || !empty) return;
        currentFactsToConfirm = handoffFactsToConfirm(packet);
        const existing = new Map(
            (packet.internalCompletion?.factResolutions || [])
                .map((item) => [text(item?.question), text(item?.answer)])
                .filter(([question]) => question)
        );
        empty.hidden = currentFactsToConfirm.length > 0;
        container.hidden = currentFactsToConfirm.length === 0;
        const followupNote = document.getElementById("registration-facts-followup-note");
        if (followupNote) followupNote.hidden = currentFactsToConfirm.length === 0;
        container.innerHTML = currentFactsToConfirm.map((question, index) => `
            <li>
                <label for="registration-fact-${index}">${escapeHtml(question)}</label>
                <input id="registration-fact-${index}" data-registration-fact-index="${index}" value="${escapeHtml(existing.get(question) || "")}" placeholder="지금 알면 입력 · 미확인은 Reviewer 후속 확인">
            </li>
        `).join("");
    }

    function readFactResolutions() {
        return currentFactsToConfirm.map((question, index) => ({
            question,
            answer: text(document.querySelector(`[data-registration-fact-index="${index}"]`)?.value)
        }));
    }

    function populateForm(packet) {
        const isCard = packet && packet.schemaVersion && packet.content;
        const isLeanV03 = isSupportedLeanV03Packet(packet);
        const candidates = normalizeSearchMetadata(packet);
        const packetType = handoffCardType(packet);
        const vdRequestContent = packetType === "VD Request" ? normalizeVdRequestContent(packet) : null;
        const corContent = packetType === "CoR" ? normalizeCorContent(packet) : null;
        const methodologyContent = packetType === "방법론" ? normalizeMethodologyHandoffContent(packet) : null;
        const genericContent = GENERIC_CONTENT_CARD_TYPE_SET.has(packetType)
            ? normalizeLeanAssetContent(packet)
            : null;
        const structuredContent = vdRequestContent || corContent || methodologyContent || genericContent;
        const contentDisplay = REGISTRATION_CARD_TYPES.includes(packetType)
            ? deriveLeanAssetDisplayFields(packet)
            : null;
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
        field("type").value = text(packet.type || packet.cardType || packet.cardTypeCandidate);
        const evidenceBackedPrimaryDomain = isLeanV03 || hasAnswerEvidence("primaryDomainCandidate", candidates.primaryDomainCandidate)
            ? candidates.primaryDomainCandidate
            : "";
        field("domain").value = normalizeSearchDomain(isCard ? packet.domain : evidenceBackedPrimaryDomain);
        field("publicationStatus").value = text(packet.publicationStatus || "초안");
        refreshStatusOptions(text(packet.status));
        if (!isPreviewMode && !verifiedGitLabUser) setCurrentRegistrant("");
        field("reviewer").value = text(packet.reviewer);
        field("contributors").value = uniqueSearchValues(packet.contributors).join(", ");
        const evidenceBackedSecondaryDomains = candidates.secondaryDomainCandidates
            .filter((value) => isLeanV03 || hasAnswerEvidence("secondaryDomainCandidates", value));
        selectValues(
            field("secondaryDomains"),
            uniqueSearchValues(isCard ? packet.secondaryDomains : evidenceBackedSecondaryDomains).map(normalizeSearchDomain)
        );
        const cardWorkflowStages = matchingClassificationValues(cardContexts, WORKFLOW_STAGE_VALUES);
        const cardResponseTargets = matchingClassificationValues(cardContexts, RESPONSE_TARGET_VALUES);
        const evidenceBackedWorkflowStages = candidates.workflowStageCandidates
            .filter((value) => isLeanV03 || hasAnswerEvidence("workflowStageCandidates", value));
        const evidenceBackedResponseTargets = candidates.responseTargetCandidates
            .filter((value) => isLeanV03 || hasAnswerEvidence("responseTargetCandidates", value));
        selectValues(field("workflowStages"), isCard ? cardWorkflowStages : evidenceBackedWorkflowStages);
        selectValues(field("responseTargets"), isCard ? cardResponseTargets : evidenceBackedResponseTargets);
        syncAllChoiceSelectors();
        const classificationTags = currentClassificationTags();
        const searchFacets = resolveRegistrationSearchFacets(packet);
        const inferredProblems = searchFacets.problemPhenomena.length
            ? searchFacets.problemPhenomena
            : uniqueSearchValues(candidates.visibleTags)
                .map((tag) => isCard ? text(tag) : migratedAdditionalTag(tag))
                .filter(Boolean)
                .filter((tag) => excludesClassificationDuplicate(tag, classificationTags))
                .filter((tag) => !CONTROLLED_VISIBLE_TAGS.includes(tag))
                .slice(0, 3);
        const facetTags = uniqueSearchValues([
            ...inferredProblems,
            ...searchFacets.productStructureProcess,
            ...searchFacets.toolModelData
        ]);
        field("problems").value = inferredProblems.join(", ");
        field("productsProcesses").value = searchFacets.productStructureProcess.join(", ");
        field("toolsModelsData").value = searchFacets.toolModelData.join(", ");
        const normalizedVisibleTags = uniqueSearchValues(candidates.visibleTags)
            .map((tag) => isCard ? text(tag) : migratedAdditionalTag(tag))
            .filter(Boolean);
        additionalTagCandidates = uniqueSearchValues([...normalizedVisibleTags, ...controlledTags])
            .filter((tag) => excludesClassificationDuplicate(tag, classificationTags))
            .filter((tag) => !facetTags.includes(tag));
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
                    ? "본문에서 동일한 표준 기술 표현을 감지"
                    : "외부 JSON의 additionalTags",
                reason: controlledTags.includes(tag)
                    ? "등록 화면 자동 추천"
                    : "외부 JSON 후보"
            });
        });
        const controlledCandidates = { ...candidates, visibleTags: additionalTagCandidates, candidateRationale };
        field("summary").value = text(packet.summary || contentDisplay?.summary || packet.abstractContext || packet.observationsAndResult);
        field("useCase").value = text(packet.useCase || contentDisplay?.useCase || packet.primaryQuestion);
        field("contents").value = text(packet.contents || contentDisplay?.contents || packet.approachOrContent || packet.observationsAndResult);
        field("typeSpecificJson").value = JSON.stringify(
            isCard ? packet.content : (structuredContent || packet.typeSpecific || {}),
            null,
            2
        );
        const contentReview = activeContentReviewAdapter();
        if (contentReview) {
            contentReview.populate(isCard ? packet.content : (structuredContent || packet.typeSpecific));
        }
        if (field("type").value === "VD Request") {
            field("vdContentConfirmed").checked = isCard && packet.internalCompletion?.externalContentConfirmed === true;
        }
        if (field("type").value === "CoR") {
            field("corContentConfirmed").checked = isCard && packet.internalCompletion?.externalContentConfirmed === true;
        }
        if (GENERIC_CONTENT_CARD_TYPE_SET.has(field("type").value)) {
            field("genericContentConfirmed").checked = isCard && packet.internalCompletion?.externalContentConfirmed === true;
        }
        updateContentReviewVisibility();
        populateRequiredEvidence(
            packet,
            isCard ? packet.content : structuredContent,
            Boolean(isCard)
        );
        field("tags").value = isCard ? additionalTagCandidates.join(", ") : "";
        field("aliases").value = uniqueSearchValues(packet.aliases?.length ? packet.aliases : candidates.aliases).join(", ");
        field("expectedQueries").value = uniqueSearchValues(packet.searchMetadata?.expectedQueries ?? candidates.expectedQueries).join("\n");
        field("searchMetadataConfirmed").checked = packet.searchMetadata?.confirmedInternally === true;
        renderSearchProposal(controlledCandidates);
        renderTagCandidates(controlledCandidates);
        renderClassificationTags();
        renderFactsToConfirm(packet);
        selectedRelations = Array.isArray(packet.relations) ? packet.relations.map((relation) => ({ ...relation, confirmed: relation.confirmed === true })) : [];
        internalLinks = Array.isArray(packet.links) ? packet.links.filter((link) => link?.href).map((link) => ({
            label: link.label || "내부 자산",
            href: link.href,
            assetType: link.assetType || link.type || "기타 사내 시스템",
            system: link.system || "확인 필요",
            sourceVersion: text(link.sourceVersion),
            role: link.role || "reference",
            accessScope: link.accessScope || "권한 확인 필요",
            status: link.status === "verified" ? "verified" : "pending",
            verifiedAt: link.verifiedAt || ""
        })) : [];
        const importedSourceLinkDecision = packet.internalCompletion?.sourceLinkDecision ?? {};
        field("noInternalLink").checked = !internalLinks.length
            && text(importedSourceLinkDecision.status) === "no_internal_asset";
        field("noInternalLinkReason").value = field("noInternalLink").checked
            ? text(importedSourceLinkDecision.reason)
            : "";
        updateSourceLinkDecisionUi();
        relationSearchPerformed = packet.searchReuse?.performed === true;
        automaticRelationSearchTerms = uniqueSearchValues(packet.searchReuse?.searchTerms);
        relationIndexVersion = text(packet.searchReuse?.indexVersion);
        field("relationSearch").value = list(packet.searchReuse?.searchTerms).join(", ");
        const importedNoCandidate = packet.searchReuse?.decision === "no-candidate";
        field("noRelationFound").checked = importedNoCandidate;
        const importedReason = text(packet.searchReuse?.reason);
        const knownReason = [...field("noRelationReasonCode").options]
            .map((option) => option.value)
            .filter(Boolean)
            .find((value) => importedReason.startsWith(value));
        field("noRelationReasonCode").value = knownReason || (importedNoCandidate && importedReason ? "기타" : "");
        field("noRelationReason").value = knownReason
            ? importedReason.replace(new RegExp(`^${knownReason}\\s*[·:-]?\\s*`), "")
            : importedReason;
        document.getElementById("no-relation-reason-field").hidden = !importedNoCandidate;
        populateFrameworkFields(packet);
        if (field("type").value === "방법론") {
            populateMethodologyInternalConfirmation(
                packet,
                isCard ? packet.content : (structuredContent || packet.typeSpecific || {}),
                Boolean(isCard)
            );
        }
        renderSelectedRelations();
        renderInternalLinks();
    }

    function renderSearchProposal(candidates) {
        const domainMap = Object.fromEntries(SEARCH_DOMAIN_OPTIONS.map((domain) => [domain.id, domain.label]));
        const status = document.getElementById("proposal-candidate-status");
        if (status) {
            status.textContent = isSupportedLeanV03Packet(sourcePacket || {})
                ? "외부 JSON 불러옴 · 체크한 값만 사내 확정"
                : (candidates.candidateStatus === "user_confirmed_candidate"
                    ? "외부 후보 확인됨 · 사내 확정 필요"
                    : "외부 후보 미확인 · 사내 확정 필요");
        }
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
                expectedQueries: "예상 검색문장"
            };
            rationale.innerHTML = candidates.candidateRationale.length
                ? candidates.candidateRationale.map((item) => {
                    const evidence = item.answerEvidence
                        ? `추천 근거: ${item.answerEvidence}`
                        : "추천 근거 없음 · 사내 직접 선택 필요";
                    return `<li><strong>${escapeHtml(item.value)}</strong><span>${escapeHtml(categoryLabels[item.category] || item.category)} · ${escapeHtml(evidence)} · ${escapeHtml(item.reason)}</span></li>`;
                }).join("")
                : (isLeanVdRequestPacket(sourcePacket || {})
                    ? '<li><span>Lean v0.3은 긴 제안 이유를 저장하지 않습니다. 불러온 값과 등록 화면의 표준 추천만 확인하세요.</span></li>'
                    : '<li><span>AI가 제안 이유를 제공하지 않았습니다. 사내 분류체계와 비교해 직접 확정하세요.</span></li>');
        }
    }

    function renderTagCandidates(candidates = { ...normalizeSearchMetadata(sourcePacket || {}), visibleTags: recommendControlledTags(sourcePacket || {}) }) {
        const container = document.getElementById("registration-tag-candidates");
        if (!container) return;
        const selected = new Set(uniqueSearchValues(field("tags").value));
        const reasons = new Map((candidates.candidateRationale || [])
            .filter((item) => item.category === "visibleTags")
            .map((item) => [text(item.value), [
                item.answerEvidence ? `추천 근거: ${text(item.answerEvidence)}` : "추천 근거 없음",
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
        syncAllChoiceSelectors();
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

    function libraryIndexAvailable() {
        return Array.isArray(window.TECHNICAL_ASSET_LIBRARY?.cards);
    }

    function currentRelationIndexVersion() {
        const library = window.TECHNICAL_ASSET_LIBRARY || {};
        return text(library.sourceWikiCommit || library.generatedAt || library.schemaVersion || "local-static-index");
    }

    function automaticRelationTerms() {
        const stopwords = new Set([
            "예시", "요청", "검토", "결과", "판단", "위해", "대한", "에서", "으로", "하는", "있습니다",
            "vd", "request", "simulation", "설계", "개발", "사업부"
        ]);
        const sourceValues = uniqueSearchValues([
            field("title").value,
            field("summary").value,
            field("useCase").value,
            ...uniqueSearchValues(field("problems").value),
            ...uniqueSearchValues(field("productsProcesses").value),
            ...uniqueSearchValues(field("toolsModelsData").value),
            ...uniqueSearchValues(field("tags").value),
            ...uniqueSearchValues(field("aliases").value),
            ...uniqueSearchValues(field("expectedQueries").value)
        ]);
        const phrases = sourceValues
            .filter((value) => value.length >= 2 && value.length <= 24)
            .map((value) => value.toLocaleLowerCase("ko"));
        const tokens = sourceValues
            .flatMap((value) => value.toLocaleLowerCase("ko").split(/[\s,./()[\]{}:;!?·"'“”‘’_-]+/))
            .map((value) => value.trim())
            .filter((value) => value.length > 1 && !stopwords.has(value));
        return uniqueSearchValues([...phrases, ...tokens]).slice(0, 30);
    }

    function relationMatches(terms) {
        return libraryCards().filter((card) => card.id !== text(field("id").value)).map((card) => {
            const title = text(card.title).toLocaleLowerCase("ko");
            const aliases = uniqueSearchValues(card.aliases).join(" ").toLocaleLowerCase("ko");
            const tags = uniqueSearchValues([
                ...(card.tags || []),
                ...(card.searchMetadata?.expectedQueries || []),
                ...(card.contexts || [])
            ]).join(" ").toLocaleLowerCase("ko");
            const body = [
                card.summary,
                card.useCase,
                card.contents,
                JSON.stringify(card.content || {}),
                card.domain,
                card.type,
                ...(card.secondaryDomains || [])
            ].join(" ").toLocaleLowerCase("ko");
            const matchedTerms = terms.filter((term) => title.includes(term) || aliases.includes(term) || tags.includes(term) || body.includes(term));
            const score = matchedTerms.reduce((total, term) => (
                total
                + (title.includes(term) ? 5 : 0)
                + (aliases.includes(term) ? 3 : 0)
                + (tags.includes(term) ? 2 : 0)
                + (body.includes(term) ? 1 : 0)
            ), 0);
            return { card, score, matchedTerms: matchedTerms.slice(0, 4) };
        }).filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score || String(b.card.updatedAt || "").localeCompare(String(a.card.updatedAt || "")))
            .slice(0, 5);
    }

    function relationResultMarkup(matches, emptyMessage) {
        return matches.length ? matches.map(({ card, matchedTerms }) => `
            <div class="relation-result">
                <div class="relation-result-main"><strong>${escapeHtml(card.title)}</strong><small>${escapeHtml(card.type)} · ${escapeHtml(card.domain)} · ${escapeHtml(card.publicationStatus)}</small>${matchedTerms?.length ? `<small>일치: ${matchedTerms.map(escapeHtml).join(", ")}</small>` : ""}</div>
                <button type="button" data-add-relation="${escapeHtml(card.id)}">연결</button>
            </div>`).join("") : `<div class="connection-empty">${emptyMessage}</div>`;
    }

    function renderRelationRecommendations() {
        const container = document.getElementById("relation-recommendations");
        if (!container) return;
        automaticRelationSearchTerms = automaticRelationTerms();
        relationIndexVersion = currentRelationIndexVersion();
        const canSearch = libraryIndexAvailable() && automaticRelationSearchTerms.length > 0;
        const matches = canSearch ? relationMatches(automaticRelationSearchTerms) : [];
        relationSearchPerformed = canSearch || relationSearchPerformed;
        const indexStatus = document.getElementById("relation-index-status");
        if (indexStatus) {
            indexStatus.textContent = canSearch
                ? `자동 검색 완료 · Index ${relationIndexVersion} · 검색 표현 ${automaticRelationSearchTerms.length}개 · 후보 ${matches.length}개`
                : "Wiki Index 또는 검색 가능한 등록 내용이 없어 자동 검색을 완료하지 못했습니다.";
        }
        container.innerHTML = relationResultMarkup(
            matches,
            canSearch
                ? "현재 Wiki Index에서 등록 내용과 가까운 기존 자산을 찾지 못했습니다. 후보 없음 상태가 자동 준비됐으며 필요하면 아래에서 직접 검색할 수 있습니다."
                : "Wiki Index를 불러오지 못해 자동 검색을 완료할 수 없습니다."
        );
        if (canSearch && !matches.length && !selectedRelations.length) {
            field("noRelationFound").checked = true;
            field("noRelationReasonCode").value = "동일 판단 목적 자산 없음";
            if (!text(field("noRelationReason").value)) {
                field("noRelationReason").value = "현재 Wiki Index에서 동일한 판단 목적과 적용조건을 가진 자산을 찾지 못했습니다.";
            }
            document.getElementById("no-relation-reason-field").hidden = false;
        }
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
        selectedRelations.push({ type: "REFERENCES", usageType: "참고", targetId: card.id, note: "", confirmed: false });
        field("noRelationFound").checked = false;
        field("noRelationReasonCode").value = "";
        field("noRelationReason").value = "";
        document.getElementById("no-relation-reason-field").hidden = true;
        renderSelectedRelations();
    }

    function renderSelectedRelations() {
        const container = document.getElementById("selected-relations");
        if (!container) return;
        container.innerHTML = selectedRelations.length ? selectedRelations.map((relation, index) => {
            const card = libraryCards().find((item) => item.id === relation.targetId);
            const relationSelector = field("type").value === "VD Request"
                ? `<select aria-label="활용 방식">${VD_RELATION_USAGE_OPTIONS.map(([usageType]) => `<option value="${usageType}"${(relation.usageType || "참고") === usageType ? " selected" : ""}>${usageType}</option>`).join("")}</select>`
                : `<select aria-label="관계 유형">${RELATION_TYPES.map((type) => `<option value="${type}"${relation.type === type ? " selected" : ""}>${type}</option>`).join("")}</select>`;
            return `<div class="connection-record" data-relation-index="${index}">
                <div class="connection-record-main"><strong>${escapeHtml(card?.title || relation.targetId)}</strong><small>${escapeHtml(relation.targetId)}</small>
                    <div class="connection-record-fields">
                        ${relationSelector}
                        <input value="${escapeHtml(relation.note)}" aria-label="활용 내용" placeholder="재사용·참고·미사용 판단을 한 문장으로 기록">
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
            <div class="connection-record-main"><strong>${escapeHtml(link.label)}</strong><small>${escapeHtml(link.assetType)} · ${escapeHtml(link.system)}${link.sourceVersion ? ` · ${escapeHtml(link.sourceVersion)}` : ""} · ${escapeHtml(link.accessScope)}<br>${escapeHtml(link.href)}</small>
                <label class="connection-none-option"><input type="checkbox" data-verify-link${link.status === "verified" ? " checked" : ""}>링크 접근 가능 여부를 확인함</label>
            </div><button type="button" data-remove-link aria-label="링크 삭제"><i class="bx bx-trash"></i></button>
        </div>`).join("") : '<div class="connection-empty">아직 추가한 링크가 없습니다. 실제 자산이 없으면 아래의 없음 항목을 선택하세요.</div>';
        updateSourceLinkDecisionUi();
    }

    function updateSourceLinkDecisionUi() {
        const noneInput = field("noInternalLink");
        const noAsset = noneInput?.checked === true;
        const linkForm = document.getElementById("internal-link-form");
        const addButton = document.getElementById("add-internal-link");
        const reasonField = document.getElementById("no-internal-link-reason-field");
        const reasonInput = field("noInternalLinkReason");
        linkForm?.classList.toggle("is-disabled", noAsset);
        linkForm?.querySelectorAll("input, select").forEach((control) => { control.disabled = noAsset; });
        if (addButton) addButton.disabled = noAsset;
        if (reasonField) reasonField.hidden = !noAsset;
        if (reasonInput) reasonInput.required = noAsset;
        const requirement = document.getElementById("registration-internal-link-requirement");
        if (requirement) {
            requirement.textContent = noAsset
                ? "내부 자산 없음 선택됨"
                : (internalLinks.length ? `${internalLinks.length}개 추가됨 · 더 추가 가능` : "복수 등록 또는 없음 확인");
        }
    }

    function addInternalLink() {
        if (field("noInternalLink").checked) {
            alert("'연결할 회사 내부 자산 없음' 선택을 해제한 뒤 링크를 추가하세요.");
            return;
        }
        const label = text(document.getElementById("internal-link-label").value);
        const href = text(document.getElementById("internal-link-url").value);
        const system = text(document.getElementById("internal-link-system").value);
        const sourceVersion = text(document.getElementById("internal-link-version").value);
        if (!label || !/^https:\/\//i.test(href) || !system) {
            document.getElementById("internal-link-label").reportValidity();
            alert("링크 이름, https:// URL, 원본 시스템을 모두 입력하세요.");
            return;
        }
        internalLinks.push({
            label, href, system, sourceVersion,
            assetType: document.getElementById("internal-link-type").value,
            role: document.getElementById("internal-link-role").value,
            accessScope: document.getElementById("internal-link-scope").value,
            status: "pending", verifiedAt: ""
        });
        ["internal-link-label", "internal-link-url", "internal-link-system", "internal-link-version"].forEach((id) => { document.getElementById(id).value = ""; });
        renderInternalLinks();
    }

    function buildCard() {
        syncContentReviewToJson();
        const typeSpecific = readTypeSpecificJson();
        const requiredEvidence = readRequiredEvidence();
        if (field("type").value === "VD Request" && typeSpecific.valid) {
            typeSpecific.value = applyRequiredEvidenceToContent(typeSpecific.value, requiredEvidence);
        }
        const framework = buildFrameworkRegistration();
        const isMethodology = field("type").value === "방법론";
        const methodology = isMethodology ? readMethodologyInternalConfirmation() : null;
        return buildRegistrationCard(sourcePacket || {}, {
            id: field("id").value,
            type: field("type").value,
            title: field("title").value,
            domain: field("domain").value,
            secondaryDomains: selectedValues(field("secondaryDomains")),
            workflowStages: selectedValues(field("workflowStages")),
            responseTargets: selectedValues(field("responseTargets")),
            publicationStatus: field("publicationStatus").value,
            status: isMethodology ? field("methodologyQualification").value : field("status").value,
            owner: field("owner").value,
            registrant: field("registrant").value || field("owner").value,
            reviewer: field("reviewer").value,
            contributors: field("contributors").value,
            summary: field("summary").value,
            useCase: field("useCase").value,
            contents: field("contents").value,
            typeSpecific: typeSpecific.value,
            tags: uniqueSearchValues([...currentClassificationTags(), ...uniqueSearchValues(field("tags").value)]),
            aliases: field("aliases").value,
            expectedQueries: field("expectedQueries").value,
            searchFacets: {
                problemPhenomena: uniqueSearchValues(field("problems").value),
                productStructureProcess: uniqueSearchValues(field("productsProcesses").value),
                toolModelData: uniqueSearchValues(field("toolsModelsData").value)
            },
            searchMetadataConfirmed: field("searchMetadataConfirmed").checked,
            vdContentConfirmed: field("vdContentConfirmed").checked,
            corContentConfirmed: field("corContentConfirmed").checked,
            methodologyContentConfirmed: field("methodologyContentConfirmed").checked,
            genericContentConfirmed: field("genericContentConfirmed").checked,
            ...(methodology ? { methodology } : {})
        }, {
            registrationId,
            sourceFileName,
            selectedRelations,
            internalLinks,
            noInternalLink: field("noInternalLink").checked,
            noInternalLinkReason: field("noInternalLinkReason").value,
            relationSearchPerformed,
            relationSearchTerms: uniqueSearchValues([
                ...automaticRelationSearchTerms,
                ...uniqueSearchValues(field("relationSearch").value)
            ]),
            relationIndexVersion,
            noRelationFound: field("noRelationFound").checked,
            noRelationReason: [
                text(field("noRelationReasonCode").value),
                text(field("noRelationReason").value)
            ].filter(Boolean).join(" · "),
            frameworkLinks: framework.links,
            frameworkLinkDecisions: framework.decisions,
            factResolutions: readFactResolutions(),
            requiredEvidence,
            typeSpecificJsonValid: typeSpecific.valid
        });
    }

    function renderReview() {
        const card = buildCard();
        const { blockers, followUps } = splitRegistrationValidation(card, sourcePacket || {});
        const previewNotice = isPreviewMode
            ? '<div class="registration-validation-item is-error"><i class="bx bx-show"></i><span>예시 미리보기에서는 실제 GitLab Wiki 등록을 실행하지 않습니다.</span></div>'
            : "";
        const validationItems = blockers.length
            ? blockers.map((error) => `<div class="registration-validation-item is-error"><i class="bx bx-error-circle"></i><span>${escapeHtml(error)}</span></div>`).join("")
            : `<div class="registration-validation-item is-success"><i class="bx bx-check-circle"></i><span>최초 등록 필수정보를 확인했습니다. 등록 후 Peer가 후속 항목을 확인합니다.</span></div>`;
        validation.innerHTML = `${previewNotice}${validationItems}`;
        const followupSection = document.getElementById("registration-reviewer-followups");
        const followupList = document.getElementById("registration-reviewer-followup-list");
        if (followupSection && followupList) {
            followupSection.hidden = followUps.length === 0;
            followupList.innerHTML = followUps.map((message) => `<li>${escapeHtml(message)}</li>`).join("");
        }
        preview.textContent = JSON.stringify(card, null, 2);
        if (wikiPreview) {
            try {
                wikiPreview.textContent = cardToGitLabWikiMarkdown({
                    ...card,
                    id: nextAssetId(card.type, [])
                });
            } catch (error) {
                wikiPreview.textContent = `Wiki 문서 미리보기를 만들 수 없습니다: ${error.message}`;
            }
        }
        const tagList = document.getElementById("registration-final-tag-list");
        if (tagList) tagList.innerHTML = card.tags.length
            ? card.tags.map((tag) => `<span>#${escapeHtml(tag)}</span>`).join("")
            : '<span>확정 태그 없음</span>';
        const connectionButton = document.getElementById("registration-open-gitlab-connection");
        if (connectionButton) connectionButton.hidden = isPreviewMode || Boolean(gitLabUserSession?.actor);
        publishButton.disabled = isPreviewMode || blockers.length > 0;
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

    function acceptLoadedPacket(parsed, fileName, { previewMode = false } = {}) {
        validateImportedHandoffPacket(parsed);
        isPreviewMode = previewMode;
        sourcePacket = parsed;
        sourceFileName = fileName;
        populateForm(parsed);
        if (previewMode) setCurrentRegistrant("@preview_user", { previewMode: true });
        document.getElementById("registration-preview-banner").hidden = !previewMode;
        if (previewMode) {
            const publishStatus = document.getElementById("registration-publish-status");
            publishStatus.className = "registration-publish-status";
            publishStatus.textContent = "";
        }
        document.getElementById("registration-file-name").textContent = fileName;
        const migrationWarnings = legacyVdRequestMigrationWarnings(parsed);
        setMessage(migrationWarnings.length
            ? `기존 v0.2 JSON을 불러왔습니다. ${migrationWarnings.length}개 중복 필드 차이는 typeSpecific을 우선 적용했으므로 Step 02에서 확인하세요.`
            : (previewMode
                ? "Lean v0.3 예시 JSON을 불러왔습니다. 실제 Wiki 등록 없이 화면을 안전하게 미리봅니다."
                : "JSON을 불러왔습니다. 다음 단계에서 내부 등록정보를 확인하세요."), migrationWarnings.length ? "warning" : "success");
        nextButton.disabled = false;
    }

    function resetImportedPacket(message = "") {
        sourcePacket = null;
        selectedRelations = [];
        internalLinks = [];
        relationSearchPerformed = false;
        automaticRelationSearchTerms = [];
        relationIndexVersion = "";
        isPreviewMode = false;
        currentFactsToConfirm = [];
        form.reset();
        field("noInternalLinkReason").value = "";
        updateSourceLinkDecisionUi();
        syncGitLabConnectionUi();
        refreshStatusOptions();
        syncAllChoiceSelectors();
        renderSearchProposal(normalizeSearchMetadata({}));
        renderSelectedRelations();
        renderInternalLinks();
        renderFactsToConfirm({});
        resetRequiredEvidenceInputs();
        updateContentReviewVisibility();
        document.getElementById("registration-preview-banner").hidden = true;
        setMessage(message, message ? "error" : "");
        nextButton.disabled = true;
    }

    async function loadFile(file) {
        if (!file) return;
        try {
            const source = await file.text();
            const parsed = JSON.parse(source.replace(/^\uFEFF/, ""));
            acceptLoadedPacket(parsed, file.name);
        } catch (error) {
            resetImportedPacket(`파일을 읽지 못했습니다: ${error.message}`);
        }
    }

    function prepareCompleteExamplePreview(assetKey = "vd-request") {
        const isCorPreview = assetKey === "cor";
        const isMethodologyPreview = assetKey === "methodology";
        const isVdRequestPreview = assetKey === "vd-request";
        const confirmationField = isCorPreview
            ? "corContentConfirmed"
            : (isMethodologyPreview
                ? "methodologyContentConfirmed"
                : (isVdRequestPreview ? "vdContentConfirmed" : "genericContentConfirmed"));
        field("id").value = `${assetKey}-preview`;
        field("reviewer").value = "@peer_reviewer";
        field(confirmationField).checked = true;
        field("searchMetadataConfirmed").checked = true;
        if (isVdRequestPreview) {
            ["requesterFeedback", "decisionImpact"].forEach((key) => {
                field(`${key}Status`).value = "confirmed";
                updateRequiredEvidenceFields(key);
            });
        }
        document.querySelectorAll("[data-registration-fact-index]").forEach((input) => {
            input.value = "[예시] 사내 후속 검증 항목으로 등록해 결과가 나오면 갱신하기로 확인했습니다.";
        });

        renderRelationRecommendations();
        relationSearchPerformed = true;
        selectedRelations = [{
            type: "USES",
            usageType: "조건 변경 적용",
            targetId: "methodology-impact-risk-ranking",
            note: "[예시] 기존 충격 취약부 비교 방법론을 동일 조건의 설계안 상대 비교에 적용했습니다.",
            confirmed: true
        }];
        field("noRelationFound").checked = false;
        field("noRelationReasonCode").value = "";
        field("noRelationReason").value = "";
        document.getElementById("no-relation-reason-field").hidden = true;
        internalLinks = [{
            label: isCorPreview
                ? "[예시] CoR 결과 및 종료 근거"
                : (isMethodologyPreview ? "[예시] 방법론 PoC 및 재사용 근거" : "[예시] VD Request 원문"),
            href: isCorPreview
                ? "https://internal.example/technical-assets/cor-preview"
                : (isMethodologyPreview
                    ? "https://internal.example/technical-assets/methodology-preview-evidence"
                    : "https://internal.example/technical-assets/vd-request-preview"),
            assetType: isCorPreview ? "Simulation 결과보고서" : (isMethodologyPreview ? "기술보고서" : "VD Request 원문"),
            system: isCorPreview ? "CoR 과제 시스템" : (isMethodologyPreview ? "사내 문서시스템" : "VD Board"),
            sourceVersion: "예시 v1.0",
            role: isCorPreview ? "deliverable" : (isMethodologyPreview ? "evidence" : "source"),
            accessScope: "VDE 내부",
            status: "verified",
            verifiedAt: today()
        }];
        field("noInternalLink").checked = false;
        field("noInternalLinkReason").value = "";
        updateSourceLinkDecisionUi();
        if (isMethodologyPreview) {
            field("methodologyQualification").value = "방법론 후보";
            field("status").value = "방법론 후보";
            field("methodologyTechnologyMapStatus").value = "unlisted_new";
            field("methodologyTechnologyMapNote").value = "";
            updateMethodologyMapFields();
            updateMethodologyLevelChange();
        } else {
            field("technologyMapStatus").value = "pending";
            field("technologyMapReason").value = "[예시] 화면 점검용 데이터이므로 실제 Technology Map 연결은 확인하지 않습니다.";
            updateFrameworkFields("technologyMap");
        }
        field("learningPathStatus").value = "not_applicable";
        field("learningPathReason").value = "[예시] 화면 점검용 데이터이므로 Learning Path를 연결하지 않습니다.";
        updateFrameworkFields("learningPath");
        renderSelectedRelations();
        renderInternalLinks();
    }

    async function loadExamplePreview(options = {}) {
        const requestedAsset = text(options?.assetKey);
        const assetKey = Object.hasOwn(EXAMPLE_PACKET_URLS, requestedAsset) ? requestedAsset : "vd-request";
        const showConfirmedFields = options?.showConfirmedFields === true;
        const targetStep = [3, 4].includes(options?.targetStep) ? options.targetStep : 2;
        try {
            const response = await fetch(EXAMPLE_PACKET_URLS[assetKey], { cache: "no-store" });
            if (!response.ok) throw new Error(`예시 파일 요청 실패 (${response.status})`);
            const parsed = await response.json();
            const fileName = EXAMPLE_PACKET_URLS[assetKey].split("/").pop();
            acceptLoadedPacket(parsed, fileName, { previewMode: true });
            if (showConfirmedFields && assetKey === "vd-request") {
                field("requesterFeedbackStatus").value = "confirmed";
                field("decisionImpactStatus").value = "confirmed";
                updateRequiredEvidenceFields("requesterFeedback");
                updateRequiredEvidenceFields("decisionImpact");
            }
            if (targetStep >= 3) {
                const confirmationField = assetKey === "cor"
                    ? "corContentConfirmed"
                    : (assetKey === "methodology"
                        ? "methodologyContentConfirmed"
                        : (assetKey === "vd-request" ? "vdContentConfirmed" : "genericContentConfirmed"));
                field(confirmationField).checked = true;
                field("searchMetadataConfirmed").checked = true;
            }
            if (targetStep === 4) prepareCompleteExamplePreview(assetKey);
            setStep(targetStep);
        } catch (error) {
            resetImportedPacket(`예시를 불러오지 못했습니다: ${error.message}`);
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
        automaticRelationSearchTerms = [];
        relationIndexVersion = "";
        additionalTagCandidates = [];
        currentFactsToConfirm = [];
        verifiedGitLabUser = null;
        gitLabUserSession = loadGitLabUserSession();
        isPreviewMode = false;
        document.getElementById("registration-file-name").textContent = "선택된 파일 없음";
        document.getElementById("registration-id-display").textContent = registrationId;
        document.getElementById("no-relation-reason-field").hidden = true;
        field("noInternalLink").checked = false;
        field("noInternalLinkReason").value = "";
        updateSourceLinkDecisionUi();
        Object.keys(frameworkConfigs).forEach((key) => {
            field(`${key}Status`).value = "";
            updateFrameworkFields(key);
        });
        renderSearchProposal(normalizeSearchMetadata({}));
        renderTagCandidates(normalizeSearchMetadata({}));
        renderFactsToConfirm({});
        resetRequiredEvidenceInputs();
        updateContentReviewVisibility();
        syncAllChoiceSelectors();
        renderClassificationTags();
        syncGitLabConnectionUi();
        document.getElementById("registration-preview-banner").hidden = true;
        const targetErrors = fixedGitLabTargetErrors(window.TECHNICAL_ASSET_GITLAB_CONFIG || {});
        const publishStatus = document.getElementById("registration-publish-status");
        publishStatus.className = targetErrors.length
            ? "registration-publish-status is-error"
            : "registration-publish-status";
        publishStatus.textContent = targetErrors.length
            ? `사이트 공통 GitLab 설정이 필요합니다. 관리자에게 문의하세요. ${targetErrors.join(" ")}`
            : "";
        publishButton.disabled = false;
        publishButton.innerHTML = '<i class="bx bx-cloud-upload"></i>Wiki에 바로 등록';
        setMessage("");
        dialog.showModal();
        document.body.classList.add("asset-registration-open");
        setStep(1);
        document.getElementById("asset-registration-title").focus({ preventScroll: true });
    }

    function closeDialog() {
        if (dialog.open) dialog.close();
    }

    function openGitLabConnectionDialog(trigger) {
        if (!connectionDialog || !connectionForm) return;
        connectionReturnFocus = trigger;
        connectionToken.value = "";
        connectionStatus.className = "gitlab-connection-status";
        connectionStatus.textContent = gitLabUserSession?.actor
            ? `${actorValue(gitLabUserSession.actor)} 계정이 현재 탭에 연결되어 있습니다.`
            : "현재 GitLab 사용자로 연결할 Access Token을 입력하세요.";
        syncGitLabConnectionUi();
        connectionDialog.showModal();
        connectionToken.focus({ preventScroll: true });
    }

    function closeGitLabConnectionDialog() {
        if (!connectionDialog) return;
        connectionToken.value = "";
        if (connectionDialog.open) connectionDialog.close();
    }

    setOptions(field("type"), [["", "사내에서 자료 유형 선택"], ...TYPES.map((item) => [item, item])]);
    setOptions(field("domain"), [["", "사내에서 주 기술영역 선택"], ...DOMAINS]);
    setOptions(field("secondaryDomains"), DOMAINS);
    setOptions(field("workflowStages"), WORKFLOW_STAGE_VALUES.map((item) => [item, item]));
    setOptions(field("responseTargets"), RESPONSE_TARGET_VALUES.map((item) => [item, item]));
    setOptions(field("methodologyQualification"), (REGISTRATION_INITIAL_TYPE_STATUSES["방법론"] || []).map((item) => [item, item]));
    setOptions(field("methodologyConfirmedLevel"), METHODOLOGY_LEVELS.map((item) => [item, item]));
    setOptions(field("methodologyTechnologyMapStatus"), TECHNOLOGY_MAP_STATUS_OPTIONS);
    ["domain", "secondaryDomains", "workflowStages", "responseTargets", "methodologyTechnologyMapStatus"].forEach(renderChoiceSelector);
    setOptions(field("publicationStatus"), PUBLICATION_STATUSES.map((item) => [item, item]));
    Object.keys(VD_REQUEST_REQUIRED_EVIDENCE_FIELDS).forEach((key) => {
        setOptions(field(`${key}Status`), REQUIRED_EVIDENCE_STATUS_OPTIONS);
        field(`${key}Status`).addEventListener("change", () => updateRequiredEvidenceFields(key));
        updateRequiredEvidenceFields(key);
    });
    Object.keys(frameworkConfigs).forEach((key) => {
        const statusOptions = key === "technologyMap"
            ? TECHNOLOGY_MAP_STATUS_OPTIONS
            : LEARNING_PATH_STATUS_OPTIONS;
        setOptions(field(`${key}Status`), [["", "선택하세요"], ...statusOptions]);
        setOptions(field(`${key}RelationType`), FRAMEWORK_RELATION_TYPES.map((item) => [item, item]));
        field(`${key}RelationType`).value = "REFERENCES";
        field(`${key}Status`).addEventListener("change", () => updateFrameworkFields(key));
        updateFrameworkFields(key);
    });
    refreshStatusOptions();
    updateRequiredEvidenceVisibility();
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
    form.querySelectorAll("[data-registration-choice]").forEach((container) => container.addEventListener("click", handleChoiceSelectorClick));
    field("type").addEventListener("change", () => {
        refreshStatusOptions();
        updateRequiredEvidenceVisibility();
        updateContentReviewVisibility();
    });
    field("methodologyQualification").addEventListener("change", () => {
        if (field("type").value === "방법론") field("status").value = field("methodologyQualification").value;
    });
    field("methodologyConfirmedLevel").addEventListener("change", updateMethodologyLevelChange);
    field("methodologyTechnologyMapStatus").addEventListener("change", updateMethodologyMapFields);
    [field("type"), field("domain"), field("secondaryDomains"), field("workflowStages"), field("responseTargets")].forEach((control) => control.addEventListener("change", refreshTagConfirmation));
    field("typeSpecificJson").addEventListener("input", validateTypeSpecificInput);
    VD_CONTENT_FIELD_NAMES.forEach((name) => field(name)?.addEventListener("input", () => {
        field("vdContentConfirmed").checked = false;
        syncVdContentReviewToJson();
    }));
    COR_CONTENT_FIELD_NAMES.forEach((name) => field(name)?.addEventListener("input", () => {
        field("corContentConfirmed").checked = false;
        syncCorContentReviewToJson();
    }));
    METHODOLOGY_CONTENT_FIELD_NAMES.forEach((name) => field(name)?.addEventListener("input", () => {
        field("methodologyContentConfirmed").checked = false;
        syncMethodologyContentReviewToJson();
    }));
    document.getElementById("registration-generic-content-fields")?.addEventListener("input", (event) => {
        if (!event.target.matches("[data-generic-content-path]")) return;
        field("genericContentConfirmed").checked = false;
        syncGenericContentReviewToJson();
    });
    field("tags").addEventListener("input", syncSelectedTagCandidates);
    document.getElementById("registration-tag-candidates").addEventListener("change", applyTagCandidateSelection);
    document.getElementById("close-asset-registration")?.addEventListener("click", closeDialog);
    document.getElementById("registration-cancel")?.addEventListener("click", closeDialog);
    document.getElementById("registration-load-example")?.addEventListener("click", loadExamplePreview);
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
        if (event.target.matches("select[aria-label='관계 유형']")) relation.type = event.target.value;
        if (event.target.matches("select[aria-label='활용 방식']")) {
            relation.usageType = event.target.value;
            relation.type = VD_RELATION_TYPE_BY_USAGE[event.target.value] || "REFERENCES";
        }
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
        } else {
            field("noRelationReasonCode").value = "";
            field("noRelationReason").value = "";
        }
        renderSelectedRelations();
    });
    field("noRelationReasonCode").addEventListener("change", () => {
        field("noRelationReason").required = field("noRelationFound").checked && field("noRelationReasonCode").value === "기타";
    });
    field("noInternalLink").addEventListener("change", (event) => {
        if (event.target.checked && internalLinks.length) {
            event.target.checked = false;
            alert("추가된 회사 내부 자산 링크를 먼저 삭제한 뒤 '없음'을 선택하세요.");
            return;
        }
        if (!event.target.checked) field("noInternalLinkReason").value = "";
        updateSourceLinkDecisionUi();
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
        if (currentStep === 2 && (
            !validateTypeSpecificInput()
            || !validateContentReview()
            || !validateRequiredClassificationInput()
            || !validateRequiredEvidenceInput()
        )) return;
        setStep(Math.min(4, currentStep + 1));
    });
    document.getElementById("open-gitlab-connection")?.addEventListener("click", (event) => openGitLabConnectionDialog(event.currentTarget));
    document.getElementById("registration-open-gitlab-connection")?.addEventListener("click", (event) => openGitLabConnectionDialog(event.currentTarget));
    document.getElementById("close-gitlab-connection")?.addEventListener("click", closeGitLabConnectionDialog);
    document.getElementById("cancel-gitlab-connection")?.addEventListener("click", closeGitLabConnectionDialog);
    document.getElementById("disconnect-gitlab-user")?.addEventListener("click", () => {
        clearGitLabUserSession();
        gitLabUserSession = null;
        connectionStatus.className = "gitlab-connection-status";
        connectionStatus.textContent = "GitLab 사용자 연결을 해제했습니다.";
        syncGitLabConnectionUi();
        if (currentStep === 4) renderReview();
    });
    connectionForm?.addEventListener("submit", async (event) => {
        event.preventDefault();
        const button = document.getElementById("connect-gitlab-user");
        const token = text(connectionToken.value);
        const configErrors = validateFixedGitLabRegistrationConfig(
            window.TECHNICAL_ASSET_GITLAB_CONFIG || {},
            token
        );
        if (configErrors.length) {
            connectionStatus.className = "gitlab-connection-status is-error";
            connectionStatus.textContent = configErrors.join(" ");
            return;
        }
        button.disabled = true;
        button.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i>사용자 확인 중';
        connectionStatus.className = "gitlab-connection-status";
        connectionStatus.textContent = "GitLab에서 현재 사용자를 확인하고 있습니다.";
        try {
            const config = buildFixedGitLabRegistrationConfig(
                window.TECHNICAL_ASSET_GITLAB_CONFIG || {},
                token
            );
            const result = await resolveCurrentGitLabRegistrant(config);
            gitLabUserSession = saveGitLabUserSession({
                actor: result.user.actor,
                token
            });
            syncGitLabConnectionUi();
            connectionStatus.className = "gitlab-connection-status is-success";
            connectionStatus.textContent = `${result.user.actor} 계정을 현재 탭에 연결했습니다.`;
            if (currentStep === 4) renderReview();
            window.setTimeout(closeGitLabConnectionDialog, 450);
        } catch (error) {
            connectionStatus.className = "gitlab-connection-status is-error";
            connectionStatus.textContent = error.message;
        } finally {
            button.disabled = false;
            button.innerHTML = '<i class="bx bx-user-check"></i>현재 사용자 연결';
        }
    });
    publishButton.addEventListener("click", async () => {
        const config = gitLabConfigFromSession();
        const configErrors = validateFixedGitLabRegistrationConfig(
            window.TECHNICAL_ASSET_GITLAB_CONFIG || {},
            gitLabUserSession?.token || ""
        );
        const status = document.getElementById("registration-publish-status");
        if (isPreviewMode) {
            status.className = "registration-publish-status is-error";
            status.textContent = "예시 미리보기에서는 실제 GitLab Wiki 등록을 실행하지 않습니다.";
            return;
        }
        if (configErrors.length) {
            status.className = "registration-publish-status is-error";
            status.textContent = gitLabUserSession
                ? configErrors.join(" ")
                : "먼저 Wiki 상단의 ‘GitLab 사용자 연결’에서 현재 사용자를 연결하세요.";
            return;
        }
        publishButton.disabled = true;
        publishButton.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i>계정 확인 중';
        status.className = "registration-publish-status";
        status.textContent = "현재 GitLab 사용자를 등록자와 Owner로 확인하고 있습니다.";
        try {
            await verifyCurrentRegistrant(config);
            const card = buildCard();
            const cardErrors = validateInitialRegistrationCard(card, sourcePacket || {});
            if (cardErrors.length) throw new Error(cardErrors.join(" "));
            publishButton.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i>GitLab 등록 중';
            status.textContent = `${card.owner} 계정으로 GitLab Wiki 카드를 등록하고 있습니다.`;
            const result = await registerCardInGitLabWiki(card, config);
            const issuedCard = result.issuedCard || {
                ...card,
                id: textValue(result.assetId) || card.id
            };
            status.className = "registration-publish-status is-success";
            status.innerHTML = result.wikiUrl
                ? `등록됨 · Peer 확인 대기 · 검색 Index 반영 대기 · <a href="${escapeHtml(result.wikiUrl)}" target="_blank" rel="noopener">등록 문서 열기</a>`
                : `등록됨 · Peer 확인 대기 · 검색 Index 반영 대기 · 문서 slug: ${escapeHtml(result.slug)}`;
            publishButton.innerHTML = '<i class="bx bx-check"></i>등록됨 · Peer 확인 대기';
            window.dispatchEvent(new CustomEvent("wiki:asset-registered", { detail: { card: issuedCard, result } }));
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
    connectionDialog?.addEventListener("click", (event) => {
        if (event.target === connectionDialog) closeGitLabConnectionDialog();
    });
    connectionDialog?.addEventListener("close", () => {
        connectionToken.value = "";
        window.setTimeout(() => connectionReturnFocus?.isConnected && connectionReturnFocus.focus({ preventScroll: true }), 0);
    });
    syncGitLabConnectionUi();
    const previewQuery = new URLSearchParams(window.location.search);
    const registrationPreview = previewQuery.get("registrationPreview");
    const requestedRegistrationAsset = previewQuery.get("registrationAsset");
    const registrationAsset = Object.hasOwn(REGISTRATION_ASSET_KEY_TO_TYPE, requestedRegistrationAsset)
        ? requestedRegistrationAsset
        : "vd-request";
    const confirmedEvidencePreviewRequested = registrationPreview === "step2-confirmed";
    const relationPreviewRequested = registrationPreview === "step3";
    const reviewPreviewRequested = registrationPreview === "step4";
    const previewRequested = registrationPreview === "step2"
        || confirmedEvidencePreviewRequested
        || relationPreviewRequested
        || reviewPreviewRequested
        || window.location.hash === "#register-demo";
    if (previewRequested) {
        openDialog(document.getElementById("open-asset-registration"));
        loadExamplePreview({
            assetKey: registrationAsset,
            showConfirmedFields: confirmedEvidencePreviewRequested,
            targetStep: reviewPreviewRequested ? 4 : (relationPreviewRequested ? 3 : 2)
        });
    } else if (window.location.hash === "#register") {
        openDialog(document.getElementById("open-asset-registration"));
    }
})();
