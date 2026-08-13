import fs from "node:fs/promises";

export const CARD_TYPES = [
    "방법론",
    "BP",
    "VD Request",
    "CoR",
    "기술보고서",
    "외부 보고 자료",
    "노하우",
    "Tool Manual",
    "교육자료"
];

export const PUBLICATION_STATUSES = ["초안", "검토 중", "게시", "개정 필요", "폐기"];

export const KNOWHOW_CATEGORIES = ["기술 수행", "산출물 작성", "업무 절차", "협업·소통"];

export const TECHNOLOGY_MAP_STATUSES = ["linked", "unlisted_new", "unlisted_omitted", "pending"];

export const LEARNING_PATH_STATUSES = ["linked", "not_applicable", "target_missing"];

export const FRAMEWORK_LINK_STATUSES = [...new Set([...TECHNOLOGY_MAP_STATUSES, ...LEARNING_PATH_STATUSES])];

export const FRAMEWORK_LINK_TARGET_TYPES = ["methodology", "capability"];

export const FRAMEWORK_LINK_FRAMEWORKS = ["technology-map", "learning-path"];

export const VD_REQUEST_REQUIRED_EVIDENCE_STATUSES = ["confirmed", "deferred", "not_applicable"];

export const SOURCE_LINK_DECISION_STATUSES = ["linked", "no_internal_asset"];

export const FRAMEWORK_LINK_RELATION_TYPES = [
    "DEFINES",
    "TEACHES",
    "PRACTICES",
    "ENABLES",
    "EXAMPLE_OF",
    "APPLIES",
    "VALIDATES",
    "EVIDENCE_FOR",
    "REFERENCES"
];

const FRAMEWORK_DECISION_TARGETS = {
    technologyMap: { framework: "technology-map", targetType: "methodology" },
    learningPath: { framework: "learning-path", targetType: "capability" }
};

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
    "방법론": ["방법론 후보", "정식 방법론"],
    "BP": ["BP 후보", "BP", "승격 보류", "자격 해제"],
    "VD Request": ["접수", "수행 중", "완료", "보류", "취소"],
    "CoR": ["완료", "Drop"],
    "기술보고서": ["작성 중", "검토 중", "검토 완료", "보완 필요"],
    "외부 보고 자료": ["작성 중", "검토 중", "검토 완료", "보완 필요"],
    "노하우": ["작성 중", "검토 중", "검토 완료", "보완 필요"],
    "Tool Manual": ["작성 중", "검토 중", "검토 완료", "보완 필요"],
    "교육자료": ["작성 중", "검토 중", "검토 완료", "보완 필요"]
};

export const TYPE_REQUIRED_CONTENT = {
    "방법론": ["problemAndPurpose", "technicalPrinciples", "inputsAndPrerequisites", "standardProcedure", "resultsAndCriteria", "scopeAndLimits", "validationAndReuse"],
    "BP": ["businessContext", "simulationResponse", "businessFeedback", "businessImpact", "reproductionConditions", "evidence"],
    "VD Request": [
        "context",
        "primaryQuestion",
        "inputsAndConstraints",
        "approach",
        "evidenceSummary",
        "result",
        "applicability.judgmentScope",
        "applicability.validConditions",
        "applicability.limitations"
    ],
    "CoR": ["backgroundAndGap", "objectiveAndSuccessCriteria", "scopeAndPlan", "validationDesign", "progressDecisions", "resultAndJudgment", "outputsAndFollowUp"],
    "기술보고서": ["questionAndPurpose", "scopeAndConditions", "methodAndEvidence", "findingsAndConclusion", "validConditionsAndDecisions", "limitations", "sourceAndRelationRoles"],
    "외부 보고 자료": ["reportPurpose", "audienceAndDecision", "approvedMessages", "sourceAssetsAndEvidence", "disclosureScope", "versionAndValidity", "limitationsAndNotes"],
    "노하우": ["knowhowCategory", "symptomAndConditions", "causeAndDiagnosis", "resolution", "effectAndEvidence", "risksAndRecovery", "versionsAndSources"],
    "Tool Manual": ["purposeAndOutput", "prerequisites", "procedure", "completionCheck", "errorsAndWarnings", "versionsAndSources"],
    "교육자료": ["learningObjectives", "audienceAndPrerequisites", "outline", "activities", "completionCriteria", "sourcesAndVersion"]
};

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

const PLACEHOLDER_VALUES = new Set(["확인 필요", "[확인 필요]", "미확인", "TBD", "N/A"]);

function hasValue(value) {
    if (Array.isArray(value)) return value.some(hasValue);
    if (value && typeof value === "object") return Object.values(value).some(hasValue);
    const normalized = String(value ?? "").trim();
    return normalized.length > 0 && !PLACEHOLDER_VALUES.has(normalized);
}

function isDate(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(value ?? ""));
}

function validateVdRequestRequiredEvidence(card, errors) {
    const requiredEvidence = card.internalCompletion?.requiredEvidence;
    const fields = {
        requesterFeedback: "요청자 피드백",
        decisionImpact: "의사결정 영향"
    };

    Object.entries(fields).forEach(([key, label]) => {
        const decision = requiredEvidence?.[key];
        const status = String(decision?.status ?? "").trim();
        const contentValue = card.content?.[key];

        if (!VD_REQUEST_REQUIRED_EVIDENCE_STATUSES.includes(status)) {
            errors.push(`${label}의 처리 상태를 확인 완료·추후 확인·해당 없음 중에서 선택해야 합니다.`);
            return;
        }

        if (status === "confirmed") {
            if (key === "requesterFeedback" && !hasValue(contentValue)) {
                errors.push("요청자 피드백을 확인 완료로 선택한 경우 실제 내용을 입력해야 합니다.");
            }
            if (key === "decisionImpact") {
                if (!hasValue(contentValue?.summary)) {
                    errors.push("의사결정 영향을 확인 완료로 선택한 경우 summary를 입력해야 합니다.");
                }
            }
            return;
        }

        if (hasValue(contentValue)) {
            errors.push(`${label}을 추후 확인 또는 해당 없음으로 선택한 경우 확정 내용을 비워 두어야 합니다.`);
        }
        if (!hasValue(decision?.note)) {
            errors.push(`${label}을 ${status === "deferred" ? "추후 확인" : "해당 없음"}으로 선택한 경우 ${status === "deferred" ? "후속 확인 계획" : "해당 없음 사유"}을 note에 입력해야 합니다.`);
        }
    });
}

function validateSourceLinkDecision(card, errors, warnings) {
    const links = Array.isArray(card.links) ? card.links : [];
    const decision = card.internalCompletion?.sourceLinkDecision;
    const status = String(decision?.status ?? "").trim();
    if (!status && links.length) {
        warnings.push("기존 카드의 내부 자산 링크를 linked로 간주했습니다. 다음 수정 시 sourceLinkDecision을 저장하세요.");
        return;
    }
    if (!SOURCE_LINK_DECISION_STATUSES.includes(status)) {
        errors.push("회사 내부 자산 링크를 추가하거나 sourceLinkDecision에서 자산 없음과 사유를 확정해야 합니다.");
        return;
    }
    if (status === "linked" && !links.length) {
        errors.push("sourceLinkDecision이 linked이면 회사 내부 자산 링크가 1개 이상 필요합니다.");
    }
    if (status === "no_internal_asset") {
        if (links.length) errors.push("회사 내부 자산 링크와 no_internal_asset 판단을 동시에 저장할 수 없습니다.");
        if (!hasValue(decision?.reason)) errors.push("sourceLinkDecision이 no_internal_asset이면 사유가 필요합니다.");
    }
    if (!hasValue(decision?.decidedBy)) errors.push("sourceLinkDecision.decidedBy가 필요합니다.");
    if (!isDate(decision?.decidedAt)) errors.push("sourceLinkDecision.decidedAt은 YYYY-MM-DD 형식이어야 합니다.");
}

export function validateCard(card, options = {}) {
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
    if (card.schemaVersion === "1.0") {
        if (!card.tags?.length) errors.push("신규 등록 카드에는 표시 태그가 1개 이상 필요합니다.");
        if (!card.aliases?.length && !card.searchMetadata?.expectedQueries?.length) {
            warnings.push("검색 별칭과 예상 검색문장이 모두 비어 있습니다. 선택 항목이지만 Pilot 검색 품질을 확인하세요.");
        }
        if (card.searchMetadata?.confirmedInternally !== true) errors.push("신규 등록 카드의 검색 분류는 사내에서 최종 확인해야 합니다.");
    }
    if (!Array.isArray(card.links)) errors.push("links는 배열이어야 합니다.");
    if (!Array.isArray(card.relations)) errors.push("relations는 배열이어야 합니다.");
    if (!Array.isArray(card.changeLog)) errors.push("changeLog는 배열이어야 합니다.");

    const hasFrameworkLinks = Object.prototype.hasOwnProperty.call(card, "frameworkLinks");
    const hasFrameworkDecisions = Object.prototype.hasOwnProperty.call(card, "frameworkLinkDecisions");
    if (options.requireFrameworkLinks || hasFrameworkLinks || hasFrameworkDecisions) {
        if (!Array.isArray(card.frameworkLinks)) {
            errors.push("frameworkLinks는 배열이어야 합니다.");
        }

        const frameworkLinks = Array.isArray(card.frameworkLinks) ? card.frameworkLinks : [];
        const seenFrameworkTargets = new Set();
        frameworkLinks.forEach((link, index) => {
            if (!link || typeof link !== "object" || Array.isArray(link)) {
                errors.push(`frameworkLinks[${index}]는 객체여야 합니다.`);
                return;
            }
            if (!FRAMEWORK_LINK_TARGET_TYPES.includes(link.targetType)) {
                errors.push(`frameworkLinks[${index}]의 targetType은 methodology 또는 capability여야 합니다.`);
            }
            if (!FRAMEWORK_LINK_FRAMEWORKS.includes(link.framework)) {
                errors.push(`frameworkLinks[${index}]의 framework는 technology-map 또는 learning-path여야 합니다.`);
            }
            ["framework", "targetId", "relationType", "note"].forEach((field) => {
                if (!hasValue(link[field])) errors.push(`frameworkLinks[${index}] 필수 필드 누락: ${field}`);
            });
            if (hasValue(link.relationType) && !FRAMEWORK_LINK_RELATION_TYPES.includes(link.relationType)) {
                errors.push(`frameworkLinks[${index}]의 relationType은 ${FRAMEWORK_LINK_RELATION_TYPES.join(", ")} 중 하나여야 합니다.`);
            }

            const expectedFramework = link.targetType === "methodology"
                ? "technology-map"
                : link.targetType === "capability"
                    ? "learning-path"
                    : "";
            if (expectedFramework && FRAMEWORK_LINK_FRAMEWORKS.includes(link.framework) && link.framework !== expectedFramework) {
                errors.push(`frameworkLinks[${index}]의 ${link.targetType} 대상은 ${expectedFramework} framework여야 합니다.`);
            }

            if (FRAMEWORK_LINK_FRAMEWORKS.includes(link.framework) && FRAMEWORK_LINK_TARGET_TYPES.includes(link.targetType) && hasValue(link.targetId)) {
                const targetKey = `${link.framework}:${link.targetType}:${normalizeText(link.targetId)}`;
                if (seenFrameworkTargets.has(targetKey)) {
                    errors.push(`중복 framework link 대상: ${link.framework}/${link.targetType}/${link.targetId}`);
                }
                seenFrameworkTargets.add(targetKey);
            }
        });

        const decisions = card.frameworkLinkDecisions;
        if (!decisions || typeof decisions !== "object" || Array.isArray(decisions)) {
            errors.push("frameworkLinkDecisions는 객체여야 합니다.");
        } else {
            const unknownDecisionKeys = Object.keys(decisions).filter((key) => !(key in FRAMEWORK_DECISION_TARGETS));
            if (unknownDecisionKeys.length) {
                errors.push(`지원하지 않는 framework 연결 판단: ${unknownDecisionKeys.join(", ")}`);
            }

            Object.entries(FRAMEWORK_DECISION_TARGETS).forEach(([frameworkKey, target]) => {
                const decision = decisions[frameworkKey];
                if (!decision || typeof decision !== "object" || Array.isArray(decision)) {
                    errors.push(`frameworkLinkDecisions.${frameworkKey}는 객체여야 합니다.`);
                    return;
                }
                const allowedStatuses = frameworkKey === "technologyMap"
                    ? (card.type === "방법론" ? TECHNOLOGY_MAP_STATUSES : FRAMEWORK_LINK_STATUSES)
                    : LEARNING_PATH_STATUSES;
                if (!allowedStatuses.includes(decision.status)) {
                    errors.push(`frameworkLinkDecisions.${frameworkKey}의 status는 ${allowedStatuses.join(", ")} 중 하나여야 합니다.`);
                    return;
                }

                const matchingLinks = frameworkLinks.filter((link) => (
                    link?.framework === target.framework && link?.targetType === target.targetType
                ));
                if (decision.status === "linked") {
                    if (matchingLinks.length === 0) {
                        errors.push(`frameworkLinkDecisions.${frameworkKey}가 linked이면 ${target.framework}/${target.targetType} link가 1개 이상 필요합니다.`);
                    }
                } else {
                    if (!hasValue(decision.reason)) {
                        errors.push(`frameworkLinkDecisions.${frameworkKey}가 ${decision.status}이면 reason이 필요합니다.`);
                    }
                    if (matchingLinks.length > 0) {
                        errors.push(`frameworkLinkDecisions.${frameworkKey}가 ${decision.status}이면 ${target.framework}/${target.targetType} link를 둘 수 없습니다.`);
                    }
                }
            });
        }
    }

    const requiredContent = TYPE_REQUIRED_CONTENT[card.type] ?? [];
    const contentValue = (field) => String(field).split(".").reduce(
        (current, key) => current && typeof current === "object" ? current[key] : undefined,
        card.content
    );
    const missingContent = requiredContent.filter((field) => !hasValue(contentValue(field)));
    if (card.type === "VD Request") {
        const hasRequiredEvidence = Object.prototype.hasOwnProperty.call(
            card.internalCompletion ?? {},
            "requiredEvidence"
        );
        const requiresRequiredEvidence = card.schemaVersion === "1.0"
            || Boolean(card.registrationSource)
            || hasRequiredEvidence;
        if (requiresRequiredEvidence) validateVdRequestRequiredEvidence(card, errors);
    }
    const knowhowCategory = card.content?.knowhowCategory;

    if (card.type === "노하우" && hasValue(knowhowCategory) && !KNOWHOW_CATEGORIES.includes(knowhowCategory)) {
        const message = `노하우 범주는 다음 중 하나여야 합니다: ${KNOWHOW_CATEGORIES.join(", ")}`;
        if (card.publicationStatus === "게시") errors.push(message);
        else warnings.push(message);
    }

    if (card.publicationStatus === "게시") {
        validateSourceLinkDecision(card, errors, warnings);
        if (missingContent.length) errors.push(`유형별 게시 필드 누락: ${missingContent.join(", ")}`);
        if (card.type === "VD Request" && card.searchReuse?.performed !== true) errors.push("게시된 VD Request는 기존 자산 검색을 완료해야 합니다.");
        const ai = card.aiAssistance ?? {};
        if (!ai.externalStructured || !ai.humanConfirmed) {
            errors.push("게시 카드에는 외부 AI 구조화와 등록자의 최종 사실 확인 기록이 필요합니다.");
        }
        const enhancedRegistration = card.schemaVersion === "1.0" || Boolean(card.registrationSource);
        if (enhancedRegistration) {
            if (!/^REG-\d{14}-[A-Z0-9]{4}$/.test(String(card.registrationId ?? ""))) errors.push("신규 등록 카드에는 유효한 등록 ID가 필요합니다.");
            const reuse = card.searchReuse ?? {};
            if (reuse.performed !== true) errors.push("게시 카드에는 기존 Wiki 자산 검색 기록이 필요합니다.");
            if (!card.relations?.length && reuse.decision !== "no-candidate") errors.push("게시 카드에는 연결 자산 또는 연결 후보 없음 판단이 필요합니다.");
            if (reuse.decision === "no-candidate" && !hasValue(reuse.reason)) errors.push("연결 후보 없음 판단에는 검색 범위와 사유가 필요합니다.");
            if (card.relations?.some((relation) => !hasValue(relation.note) || relation.confirmed !== true)) errors.push("게시 카드의 모든 연결 관계에는 활용 내용과 확인 기록이 필요합니다.");
            if (card.links?.some((link) => !/^https:\/\//i.test(String(link.href ?? "")))) errors.push("게시 카드의 내부 자산 링크는 https:// 주소여야 합니다.");
            if (card.links?.some((link) => !hasValue(link.assetType) || !hasValue(link.system) || !hasValue(link.role) || !hasValue(link.accessScope))) errors.push("게시 카드의 내부 자산 링크에는 유형·원본 시스템·역할·접근 범위가 필요합니다.");
            if (card.links?.some((link) => link.status !== "verified" || !isDate(link.verifiedAt))) errors.push("게시 카드의 모든 내부 자산 링크에는 접근 확인 상태와 확인일이 필요합니다.");
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
        relations: normalizeText(flattenText(card.relations)),
        frameworkLinks: normalizeText(flattenText(card.frameworkLinks))
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
        if (fields.frameworkLinks.includes(term)) { score += 8; matched = true; }
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
