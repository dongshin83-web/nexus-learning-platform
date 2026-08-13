export const SEARCH_DOMAIN_OPTIONS = [
    { id: "deformation", label: "01. 변형" },
    { id: "delamination", label: "02. 박리" },
    { id: "impact", label: "03. 충격" },
    { id: "thermal-flow", label: "04. 열유동" },
    { id: "fatigue", label: "05. 피로" },
    { id: "vibration", label: "06. 진동" },
    { id: "other", label: "07. 기타" }
];

export const WORKFLOW_STAGE_VALUES = ["연구", "설계", "개발", "공정", "제조", "품질"];
export const RESPONSE_TARGET_VALUES = ["고객", "사업부", "CTO", "AX", "품질경영", "생산기술"];

const DOMAIN_IDS = new Set(SEARCH_DOMAIN_OPTIONS.map((domain) => domain.id));
const DOMAIN_LABEL_TO_ID = new Map(
    SEARCH_DOMAIN_OPTIONS.flatMap(({ id, label }) => {
        const koreanLabel = label.replace(/^\d+\.\s*/, "");
        return [[label, id], [koreanLabel, id]];
    })
);
const STAGE_VALUES = new Set(WORKFLOW_STAGE_VALUES);
const TARGET_VALUES = new Set(RESPONSE_TARGET_VALUES);
const RATIONALE_CATEGORIES = new Set([
    "primaryDomainCandidate",
    "secondaryDomainCandidates",
    "workflowStageCandidates",
    "responseTargetCandidates",
    "visibleTags",
    "aliases",
    "expectedQueries"
]);

export function asSearchList(value) {
    if (Array.isArray(value)) return value;
    if (value === undefined || value === null || value === "") return [];
    return String(value).split(/[,\n]/);
}

export function uniqueSearchValues(value) {
    return [...new Set(asSearchList(value).map((item) => String(item ?? "").trim()).filter(Boolean))];
}

export function normalizeSearchDomain(value) {
    const rawValue = String(value ?? "").trim();
    const normalized = rawValue === "thermal"
        ? "thermal-flow"
        : DOMAIN_LABEL_TO_ID.get(rawValue) || rawValue;
    return DOMAIN_IDS.has(normalized) ? normalized : "";
}

function controlledValues(value, allowed) {
    return uniqueSearchValues(value).filter((item) => allowed.has(item));
}

function normalizeCandidateRationale(value) {
    if (!Array.isArray(value)) return [];
    return value
        .filter((item) => item && typeof item === "object" && !Array.isArray(item))
        .map((item) => ({
            category: String(item.category ?? "").trim(),
            value: String(item.value ?? "").trim(),
            answerEvidence: String(item.answerEvidence ?? "").trim(),
            reason: String(item.reason ?? "").trim()
        }))
        .filter((item) => RATIONALE_CATEGORIES.has(item.category) && item.value && item.reason);
}

/**
 * External AI values are candidates. This function normalizes them without
 * silently turning legacy searchTerms into tags or aliases.
 */
export function normalizeSearchMetadata(packet = {}) {
    const metadata = packet.searchMetadata && typeof packet.searchMetadata === "object" && !Array.isArray(packet.searchMetadata)
        ? packet.searchMetadata
        : {};
    const classification = metadata.classification && typeof metadata.classification === "object" && !Array.isArray(metadata.classification)
        ? metadata.classification
        : {};
    const isLeanV03 = String(packet.packetVersion ?? "").trim() === "0.3"
        && ["VD Request", "CoR"].includes(String(packet.cardType ?? "").trim());
    const hasStructuredSearchMetadata = [
        "visibleTags", "additionalTags", "aliases", "primaryDomainCandidate",
        "workflowStageCandidates", "responseTargetCandidates", "classification", "facets"
    ]
        .some((key) => Object.hasOwn(metadata, key));
    const primaryDomainCandidate = normalizeSearchDomain(
        classification.primaryDomain ?? metadata.primaryDomainCandidate ?? packet.primaryDomainCandidate ?? packet.domain
    );
    const secondaryDomainCandidates = uniqueSearchValues(
        classification.secondaryDomains ?? metadata.secondaryDomainCandidates ?? packet.secondaryDomainCandidates ?? packet.secondaryDomains
    )
        .map(normalizeSearchDomain)
        .filter((domain) => domain && domain !== primaryDomainCandidate)
        .slice(0, 2);
    const packetContexts = uniqueSearchValues(packet.contexts);

    return {
        candidateStatus: String(
            metadata.candidateStatus
            ?? packet.candidateStatus
            ?? (isLeanV03 ? "user_confirmed_candidate" : "needs_user_confirmation")
        ).trim(),
        primaryDomainCandidate,
        secondaryDomainCandidates,
        workflowStageCandidates: controlledValues(
            classification.workflowStages ?? metadata.workflowStageCandidates ?? packet.workflowStageCandidates ?? packetContexts,
            STAGE_VALUES
        ),
        responseTargetCandidates: controlledValues(
            classification.responseTargets ?? metadata.responseTargetCandidates ?? packet.responseTargetCandidates ?? packetContexts,
            TARGET_VALUES
        ),
        visibleTags: uniqueSearchValues(metadata.additionalTags ?? metadata.visibleTags ?? packet.visibleTags ?? packet.tags),
        aliases: uniqueSearchValues(metadata.aliases ?? packet.aliases),
        expectedQueries: uniqueSearchValues(metadata.expectedQueries ?? packet.expectedQueries),
        candidateRationale: normalizeCandidateRationale(metadata.candidateRationale ?? packet.candidateRationale),
        legacyUnclassifiedTerms: hasStructuredSearchMetadata ? [] : uniqueSearchValues(packet.searchTerms),
        internalFinalizationRequired: metadata.internalFinalizationRequired !== false
    };
}

export function normalizeSearchFacets(packet = {}) {
    const metadata = packet.searchMetadata && typeof packet.searchMetadata === "object" && !Array.isArray(packet.searchMetadata)
        ? packet.searchMetadata
        : {};
    const facets = (metadata.facets ?? metadata.searchFacets);
    const structuredFacets = facets && typeof facets === "object" && !Array.isArray(facets)
        ? facets
        : {};
    const searchTags = packet.searchTags && typeof packet.searchTags === "object" && !Array.isArray(packet.searchTags)
        ? packet.searchTags
        : {};

    return {
        problemPhenomena: uniqueSearchValues(structuredFacets.problemPhenomena ?? searchTags.problems).slice(0, 3),
        productStructureProcess: uniqueSearchValues(structuredFacets.productStructureProcess ?? searchTags.productsProcesses),
        toolModelData: uniqueSearchValues(structuredFacets.toolModelData ?? searchTags.toolsModelsData)
    };
}

function finalOrCandidate(finalValue, candidateValue, hasFinalValue) {
    return hasFinalValue ? uniqueSearchValues(finalValue) : uniqueSearchValues(candidateValue);
}

/**
 * Internal registration values are authoritative. Candidate values are only
 * used when the corresponding internal field has not been changed yet.
 */
export function resolveSearchMetadata(packet = {}, internal = {}) {
    const candidates = normalizeSearchMetadata(packet);
    const hasInternal = (key) => Object.hasOwn(internal, key) && internal[key] !== undefined;
    const domain = hasInternal("domain")
        ? normalizeSearchDomain(internal.domain)
        : candidates.primaryDomainCandidate;
    const secondaryDomains = finalOrCandidate(internal.secondaryDomains, candidates.secondaryDomainCandidates, hasInternal("secondaryDomains"))
        .map(normalizeSearchDomain)
        .filter((item) => item && item !== domain)
        .slice(0, 2);
    const workflowStages = controlledValues(
        internal.workflowStages === undefined ? candidates.workflowStageCandidates : internal.workflowStages,
        STAGE_VALUES
    );
    const responseTargets = controlledValues(
        internal.responseTargets === undefined ? candidates.responseTargetCandidates : internal.responseTargets,
        TARGET_VALUES
    );
    const tags = finalOrCandidate(internal.tags, candidates.visibleTags, hasInternal("tags"));
    const aliases = finalOrCandidate(internal.aliases, candidates.aliases, hasInternal("aliases"));
    const expectedQueries = finalOrCandidate(internal.expectedQueries, candidates.expectedQueries, hasInternal("expectedQueries"));

    return {
        domain,
        secondaryDomains,
        contexts: [...new Set([...workflowStages, ...responseTargets])],
        tags,
        aliases,
        searchMetadata: {
            candidateStatus: candidates.candidateStatus,
            sourceCandidates: {
                primaryDomainCandidate: candidates.primaryDomainCandidate,
                secondaryDomainCandidates: candidates.secondaryDomainCandidates,
                workflowStageCandidates: candidates.workflowStageCandidates,
                responseTargetCandidates: candidates.responseTargetCandidates,
                visibleTags: candidates.visibleTags,
                aliases: candidates.aliases,
                expectedQueries: candidates.expectedQueries
            },
            workflowStages,
            responseTargets,
            visibleTags: tags,
            aliases,
            expectedQueries,
            candidateRationale: candidates.candidateRationale,
            legacyUnclassifiedTerms: candidates.legacyUnclassifiedTerms,
            internalFinalizationRequired: candidates.internalFinalizationRequired,
            confirmedInternally: internal.confirmedInternally === true
        }
    };
}

export function validateResolvedSearchMetadata(resolved = {}) {
    const errors = [];
    if (!DOMAIN_IDS.has(resolved.domain)) errors.push("주 기술영역을 7개 분류 중 하나로 확정하세요.");
    if (!Array.isArray(resolved.secondaryDomains) || resolved.secondaryDomains.length > 2) errors.push("보조 기술영역은 최대 2개까지 선택할 수 있습니다.");
    if (resolved.secondaryDomains?.includes(resolved.domain)) errors.push("주 기술영역과 보조 기술영역은 중복될 수 없습니다.");
    if (!Array.isArray(resolved.searchMetadata?.workflowStages) || resolved.searchMetadata.workflowStages.length === 0) errors.push("업무 단계를 하나 이상 확정하세요.");
    if (!Array.isArray(resolved.searchMetadata?.responseTargets) || resolved.searchMetadata.responseTargets.length === 0) errors.push("대응 대상을 하나 이상 확정하세요.");
    if (!resolved.searchMetadata?.confirmedInternally) errors.push("AI 추천 검색 분류를 사내 등록 단계에서 확인해야 합니다.");
    return errors;
}
