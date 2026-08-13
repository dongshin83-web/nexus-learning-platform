const TEXT_PLACEHOLDERS = new Set(["확인 필요", "[확인 필요]", "미확인", "TBD", "N/A"]);
const DOMAIN_IDS = new Set(["deformation", "delamination", "impact", "thermal-flow", "fatigue", "vibration", "other"]);
const WORKFLOW_STAGES = new Set(["연구", "설계", "개발", "공정", "제조", "품질"]);
const RESPONSE_TARGETS = new Set(["고객", "사업부", "CTO", "AX", "품질경영", "생산기술"]);
const LEAN_V03_CARD_TYPES = new Set([
    "VD Request",
    "CoR",
    "방법론",
    "BP",
    "기술보고서",
    "외부 보고 자료",
    "노하우",
    "Tool Manual",
    "교육자료"
]);
const METHODOLOGY_LEVELS = new Set(["L1", "L2", "L3", "L4", "L5"]);

const text = (value) => String(value ?? "").trim();
const isObject = (value) => Boolean(value) && typeof value === "object" && !Array.isArray(value);
const list = (value) => {
    if (Array.isArray(value)) return [...new Set(value.map(text).filter(Boolean))];
    if (value === undefined || value === null || value === "") return [];
    return [...new Set(String(value).split(/[,\n]/).map(text).filter(Boolean))];
};
const meaningful = (value) => {
    if (Array.isArray(value)) return value.some(meaningful);
    if (isObject(value)) return Object.values(value).some(meaningful);
    const normalized = text(value);
    return Boolean(normalized) && !TEXT_PLACEHOLDERS.has(normalized);
};
const sameValue = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const isStringArray = (value) => Array.isArray(value)
    && value.every((item) => typeof item === "string" && text(item));
const reportExtraKeys = (value, allowedKeys, path, errors) => {
    if (!isObject(value)) return;
    const allowed = new Set(allowedKeys);
    const extras = Object.keys(value).filter((key) => !allowed.has(key));
    if (extras.length) errors.push(`${path}에 허용되지 않은 키: ${extras.join(", ")}`);
};
const containsPlaceholder = (value) => {
    if (Array.isArray(value)) return value.some(containsPlaceholder);
    if (isObject(value)) return Object.values(value).some(containsPlaceholder);
    return typeof value === "string" && TEXT_PLACEHOLDERS.has(text(value));
};

export function handoffCardType(packet = {}) {
    return text(packet.cardType || packet.cardTypeCandidate || packet.type);
}

export function isLeanHandoffPacket(packet = {}, expectedCardType = "") {
    const cardType = handoffCardType(packet);
    return text(packet.packetVersion) === "0.3"
        && LEAN_V03_CARD_TYPES.has(cardType)
        && (!expectedCardType || cardType === expectedCardType);
}

export function isLeanVdRequestPacket(packet = {}) {
    return isLeanHandoffPacket(packet, "VD Request");
}

export function isLeanCorPacket(packet = {}) {
    return isLeanHandoffPacket(packet, "CoR");
}

export function isLeanMethodologyPacket(packet = {}) {
    return isLeanHandoffPacket(packet, "방법론");
}

export function isLeanBpPacket(packet = {}) {
    return isLeanHandoffPacket(packet, "BP");
}

export function isLeanTechnicalReportPacket(packet = {}) {
    return isLeanHandoffPacket(packet, "기술보고서");
}

export function isLeanExternalReportPacket(packet = {}) {
    return isLeanHandoffPacket(packet, "외부 보고 자료");
}

export function isLeanKnowhowPacket(packet = {}) {
    return isLeanHandoffPacket(packet, "노하우");
}

export function isLeanToolManualPacket(packet = {}) {
    return isLeanHandoffPacket(packet, "Tool Manual");
}

export function isLeanEducationMaterialPacket(packet = {}) {
    return isLeanHandoffPacket(packet, "교육자료");
}

export function legacyVdRequestMigrationWarnings(packet = {}) {
    if (isLeanVdRequestPacket(packet) || handoffCardType(packet) !== "VD Request") return [];
    const typeSpecific = isObject(packet.typeSpecific) ? packet.typeSpecific : {};
    const pairs = [
        ["요청 배경", packet.abstractContext, typeSpecific.context],
        ["판단 질문", packet.primaryQuestion, typeSpecific.primaryQuestion],
        ["입력·제약", list(packet.inputsAndConstraints), list(typeSpecific.inputsAndConstraints)],
        ["접근 방법", packet.approachOrContent, typeSpecific.approach],
        ["결과", packet.observationsAndResult, typeSpecific.result],
        ["한계", list(packet.limitationsAndUnknowns), list(typeSpecific.limitations)],
        ["후속조치", list(packet.reuseOrFollowUp), list(typeSpecific.followUp)]
    ];

    return pairs
        .filter(([, commonValue, typeValue]) => meaningful(commonValue) && meaningful(typeValue) && !sameValue(commonValue, typeValue))
        .map(([label]) => `${label}: v0.2 공통 필드와 typeSpecific 값이 달라 typeSpecific 값을 우선 반입했습니다.`);
}

export function normalizeVdRequestContent(packet = {}) {
    if (isLeanVdRequestPacket(packet)) {
        const content = isObject(packet.content) ? packet.content : {};
        const applicability = isObject(content.applicability) ? content.applicability : {};
        const decisionImpact = isObject(content.decisionImpact)
            ? {
                outcomes: list(content.decisionImpact.outcomes),
                summary: text(content.decisionImpact.summary)
            }
            : null;
        return {
            context: text(content.context),
            primaryQuestion: text(content.primaryQuestion),
            inputsAndConstraints: list(content.inputsAndConstraints),
            approach: text(content.approach),
            result: text(content.result),
            applicability: {
                judgmentScope: text(applicability.judgmentScope),
                validConditions: list(applicability.validConditions),
                limitations: list(applicability.limitations)
            },
            evidenceSummary: list(content.evidenceSummary),
            requesterFeedback: content.requesterFeedback === null || content.requesterFeedback === undefined
                ? null
                : text(content.requesterFeedback),
            decisionImpact,
            followUp: list(content.followUp)
        };
    }

    const typeSpecific = isObject(packet.typeSpecific) ? packet.typeSpecific : {};
    const feedback = isObject(typeSpecific.requesterFeedback)
        ? text(typeSpecific.requesterFeedback.summary)
        : text(typeSpecific.requesterFeedback);
    const decisionImpact = isObject(typeSpecific.decisionImpact)
        ? {
            outcomes: list(typeSpecific.decisionImpact.outcomes),
            summary: text(typeSpecific.decisionImpact.summary)
        }
        : null;

    return {
        context: text(typeSpecific.context || packet.abstractContext),
        primaryQuestion: text(typeSpecific.primaryQuestion || packet.primaryQuestion),
        inputsAndConstraints: meaningful(typeSpecific.inputsAndConstraints)
            ? list(typeSpecific.inputsAndConstraints)
            : list(packet.inputsAndConstraints),
        approach: text(typeSpecific.approach || packet.approachOrContent),
        result: text(typeSpecific.result || packet.observationsAndResult),
        applicability: {
            judgmentScope: text(typeSpecific.judgmentScope),
            validConditions: list(packet.validConditions),
            limitations: meaningful(typeSpecific.limitations)
                ? list(typeSpecific.limitations)
                : list(packet.limitationsAndUnknowns)
        },
        evidenceSummary: list(packet.evidenceAvailable),
        requesterFeedback: meaningful(feedback) ? feedback : null,
        decisionImpact: decisionImpact && meaningful(decisionImpact) ? decisionImpact : null,
        followUp: meaningful(typeSpecific.followUp)
            ? list(typeSpecific.followUp)
            : list(packet.reuseOrFollowUp)
    };
}

export function deriveVdRequestDisplayFields(packet = {}) {
    const content = normalizeVdRequestContent(packet);
    return {
        summary: content.context,
        useCase: content.primaryQuestion,
        contents: [
            content.approach,
            content.result,
            content.applicability.judgmentScope
        ].filter(Boolean).join(" / ")
    };
}

export function normalizeCorContent(packet = {}) {
    const source = isLeanCorPacket(packet)
        ? (isObject(packet.content) ? packet.content : {})
        : (isObject(packet.typeSpecific) ? packet.typeSpecific : {});
    return {
        backgroundAndGap: text(source.backgroundAndGap),
        objectiveAndSuccessCriteria: text(source.objectiveAndSuccessCriteria),
        scopeAndPlan: text(source.scopeAndPlan),
        validationDesign: text(source.validationDesign),
        progressDecisions: list(source.progressDecisions),
        resultAndJudgment: text(source.resultAndJudgment),
        outputsAndFollowUp: list(source.outputsAndFollowUp)
    };
}

export function deriveCorDisplayFields(packet = {}) {
    const content = normalizeCorContent(packet);
    return {
        summary: content.backgroundAndGap,
        useCase: content.objectiveAndSuccessCriteria,
        contents: [
            content.scopeAndPlan,
            content.validationDesign,
            ...content.progressDecisions,
            content.resultAndJudgment,
            ...content.outputsAndFollowUp
        ].filter(Boolean).join(" / ")
    };
}

export function normalizeMethodologyContent(packet = {}) {
    const source = isLeanMethodologyPacket(packet)
        ? (isObject(packet.content) ? packet.content : {})
        : (isObject(packet.typeSpecific) ? packet.typeSpecific : {});
    return {
        problemAndPurpose: text(source.problemAndPurpose),
        technicalPrinciples: text(source.technicalPrinciples),
        inputsAndPrerequisites: list(source.inputsAndPrerequisites),
        standardProcedure: list(source.standardProcedure),
        resultsAndCriteria: text(source.resultsAndCriteria),
        scopeAndLimits: list(source.scopeAndLimits),
        validationAndReuse: Array.isArray(source.validationAndReuse)
            ? list(source.validationAndReuse)
            : list(source.validationAndReuse?.evidence)
    };
}

export function deriveMethodologyDisplayFields(packet = {}) {
    const content = normalizeMethodologyContent(packet);
    return {
        summary: content.problemAndPurpose,
        useCase: content.resultsAndCriteria,
        contents: [
            content.technicalPrinciples,
            ...content.standardProcedure,
            ...content.scopeAndLimits
        ].filter(Boolean).join(" / ")
    };
}

export const LEAN_V03_CONTENT_LABELS = Object.freeze({
    BP: Object.freeze({
        businessContext: "사업 맥락과 판단 질문",
        simulationResponse: "Simulation 대응과 판단 근거",
        businessFeedback: "요청자·사업부 피드백",
        businessImpact: "사업 영향",
        reproductionConditions: "재현 조건과 적용 조건",
        evidence: "근거 종류와 역할"
    }),
    "기술보고서": Object.freeze({
        questionAndPurpose: "기술 질문과 작성 목적",
        scopeAndConditions: "검토 범위와 조건",
        methodAndEvidence: "방법과 검증 근거",
        findingsAndConclusion: "관찰·해석·결론",
        validConditionsAndDecisions: "유효 조건과 지원 가능한 판단",
        limitations: "한계와 추가 확인",
        sourceAndRelationRoles: "원문·근거·관련 자산의 역할"
    }),
    "외부 보고 자료": Object.freeze({
        reportPurpose: "보고 목적",
        audienceAndDecision: "대상과 연결 의사결정",
        approvedMessages: "근거가 확인된 핵심 메시지",
        sourceAssetsAndEvidence: "근거 자산의 종류와 역할",
        disclosureScope: "공유 범위와 제외 정보",
        versionAndValidity: "유효 조건과 재검토 조건",
        limitationsAndNotes: "한계와 전달 주의점"
    }),
    "노하우": Object.freeze({
        knowhowCategory: "노하우 범주",
        symptomAndConditions: "적용 상황과 목표",
        causeAndDiagnosis: "핵심 난점과 사전 확인",
        resolution: "실행 절차와 판단 이유",
        effectAndEvidence: "완료 기준과 효과 근거",
        risksAndRecovery: "위험·복구·Escalation 조건",
        versionsAndSources: "재사용 범위와 연결 자료 역할"
    }),
    "Tool Manual": Object.freeze({
        purposeAndOutput: "작업 목적과 결과물",
        prerequisites: "사전 조건",
        procedure: "실행 절차",
        completionCheck: "정상 완료 확인",
        errorsAndWarnings: "오류·위험·중단 조건",
        versionsAndSources: "버전 조건과 연결 자료 역할"
    }),
    "교육자료": Object.freeze({
        learningObjectives: "학습목표",
        audienceAndPrerequisites: "대상과 사전지식",
        outline: "핵심 내용과 구성",
        activities: "학습 활동",
        completionCriteria: "완료·이해 확인 기준",
        sourcesAndVersion: "학습 대상 자산과 자료 역할"
    })
});

export function normalizeLeanAssetContent(packet = {}) {
    const cardType = handoffCardType(packet);
    const source = isLeanHandoffPacket(packet)
        ? (isObject(packet.content) ? packet.content : {})
        : (isObject(packet.typeSpecific) ? packet.typeSpecific : {});

    if (cardType === "VD Request") return normalizeVdRequestContent(packet);
    if (cardType === "CoR") return normalizeCorContent(packet);
    if (cardType === "방법론") return normalizeMethodologyContent(packet);

    if (cardType === "BP") {
        const feedback = isObject(source.businessFeedback) ? source.businessFeedback : {};
        const impact = isObject(source.businessImpact) ? source.businessImpact : {};
        return {
            businessContext: text(source.businessContext),
            simulationResponse: text(source.simulationResponse),
            businessFeedback: {
                status: text(feedback.status),
                summary: text(feedback.summary),
                evidence: text(feedback.evidence)
            },
            businessImpact: {
                areas: list(impact.areas),
                pathway: text(impact.pathway),
                confirmationLevel: text(impact.confirmationLevel)
            },
            reproductionConditions: list(source.reproductionConditions),
            evidence: list(source.evidence)
        };
    }

    if (cardType === "기술보고서") {
        const decisions = isObject(source.validConditionsAndDecisions)
            ? source.validConditionsAndDecisions
            : {};
        return {
            questionAndPurpose: text(source.questionAndPurpose),
            scopeAndConditions: list(source.scopeAndConditions),
            methodAndEvidence: text(source.methodAndEvidence),
            findingsAndConclusion: text(source.findingsAndConclusion),
            validConditionsAndDecisions: {
                validConditions: list(decisions.validConditions),
                supportedDecisions: list(decisions.supportedDecisions),
                unsupportedDecisions: list(decisions.unsupportedDecisions)
            },
            limitations: list(source.limitations),
            sourceAndRelationRoles: list(source.sourceAndRelationRoles || source.officialSource)
        };
    }

    if (cardType === "외부 보고 자료") {
        const validity = isObject(source.versionAndValidity) ? source.versionAndValidity : {};
        return {
            reportPurpose: text(source.reportPurpose),
            audienceAndDecision: text(source.audienceAndDecision),
            approvedMessages: list(source.approvedMessages),
            sourceAssetsAndEvidence: list(source.sourceAssetsAndEvidence),
            disclosureScope: text(source.disclosureScope),
            versionAndValidity: {
                validityConditions: list(validity.validityConditions),
                reviewTriggers: list(validity.reviewTriggers || validity.reviewTrigger)
            },
            limitationsAndNotes: list(source.limitationsAndNotes)
        };
    }

    if (cardType === "노하우") {
        const symptoms = isObject(source.symptomAndConditions) ? source.symptomAndConditions : {};
        const diagnosis = isObject(source.causeAndDiagnosis) ? source.causeAndDiagnosis : {};
        const effect = isObject(source.effectAndEvidence) ? source.effectAndEvidence : {};
        const risks = isObject(source.risksAndRecovery) ? source.risksAndRecovery : {};
        return {
            knowhowCategory: text(source.knowhowCategory),
            symptomAndConditions: {
                situationAndGoal: text(symptoms.situationAndGoal),
                triggerOrFrequency: text(symptoms.triggerOrFrequency)
            },
            causeAndDiagnosis: {
                keyDifficulty: text(diagnosis.keyDifficulty),
                checksBeforeAction: list(diagnosis.checksBeforeAction),
                ineffectiveAttempts: list(diagnosis.ineffectiveAttempts)
            },
            resolution: Array.isArray(source.resolution)
                ? source.resolution.map((entry, index) => ({
                    step: Number(entry?.step) || index + 1,
                    action: text(entry?.action),
                    judgment: text(entry?.judgment)
                })).filter((entry) => entry.action && entry.judgment)
                : [],
            effectAndEvidence: {
                completionCriteria: list(effect.completionCriteria),
                result: text(effect.result),
                evidenceLevel: text(effect.evidenceLevel)
            },
            risksAndRecovery: {
                doNotApply: list(risks.doNotApply),
                risksOrFailureSignals: list(risks.risksOrFailureSignals),
                escalationOrRecovery: list(risks.escalationOrRecovery)
            },
            versionsAndSources: list(source.versionsAndSources)
        };
    }

    if (cardType === "Tool Manual") {
        const completion = isObject(source.completionCheck) ? source.completionCheck : {};
        const errors = isObject(source.errorsAndWarnings) ? source.errorsAndWarnings : {};
        return {
            purposeAndOutput: text(source.purposeAndOutput),
            prerequisites: list(source.prerequisites),
            procedure: list(source.procedure),
            completionCheck: {
                expectedResult: text(completion.expectedResult),
                invalidSignals: list(completion.invalidSignals)
            },
            errorsAndWarnings: {
                stopConditions: list(errors.stopConditions),
                commonRisks: list(errors.commonRisks)
            },
            versionsAndSources: list(source.versionsAndSources)
        };
    }

    if (cardType === "교육자료") {
        const audience = isObject(source.audienceAndPrerequisites) ? source.audienceAndPrerequisites : {};
        const activities = isObject(source.activities) ? source.activities : {};
        return {
            learningObjectives: list(source.learningObjectives),
            audienceAndPrerequisites: {
                audience: text(audience.audience),
                prerequisites: list(audience.prerequisites)
            },
            outline: list(source.outline),
            activities: {
                methods: list(activities.methods),
                expectedDuration: text(activities.expectedDuration),
                materials: list(activities.materials)
            },
            completionCriteria: list(source.completionCriteria),
            sourcesAndVersion: list(source.sourcesAndVersion)
        };
    }

    return source;
}

export function deriveLeanAssetDisplayFields(packet = {}) {
    const cardType = handoffCardType(packet);
    if (cardType === "VD Request") return deriveVdRequestDisplayFields(packet);
    if (cardType === "CoR") return deriveCorDisplayFields(packet);
    if (cardType === "방법론") return deriveMethodologyDisplayFields(packet);
    const content = normalizeLeanAssetContent(packet);
    const entries = Object.entries(content);
    const flatten = (value) => {
        if (Array.isArray(value)) return value.map(flatten).filter(Boolean).join(" / ");
        if (isObject(value)) return Object.values(value).map(flatten).filter(Boolean).join(" / ");
        return text(value);
    };
    const preferred = {
        BP: ["businessContext", "simulationResponse"],
        "기술보고서": ["questionAndPurpose", "findingsAndConclusion"],
        "외부 보고 자료": ["reportPurpose", "audienceAndDecision"],
        "노하우": ["knowhowCategory", "symptomAndConditions"],
        "Tool Manual": ["purposeAndOutput", "completionCheck"],
        "교육자료": ["learningObjectives", "audienceAndPrerequisites"]
    }[cardType] || [];
    const summary = flatten(content[preferred[0]]) || flatten(entries[0]?.[1]);
    const useCase = flatten(content[preferred[1]]) || flatten(entries[1]?.[1]);
    return {
        summary,
        useCase,
        contents: entries.slice(2).map(([, value]) => flatten(value)).filter(Boolean).join(" / ")
    };
}

function validateLeanEnvelope(packet, expectedCardType, errors, additionalTopLevelKeys = []) {
    if (text(packet.packetVersion) !== "0.3") errors.push('packetVersion은 "0.3"이어야 합니다.');
    if (handoffCardType(packet) !== expectedCardType || text(packet.cardType) !== expectedCardType) {
        errors.push(`cardType은 "${expectedCardType}"이어야 합니다.`);
    }

    const allowedTopLevel = new Set([
        "packetVersion", "cardType", "workingTitle", "content", "searchMetadata", "internalCompletion",
        ...additionalTopLevelKeys
    ]);
    const extraTopLevel = Object.keys(packet).filter((key) => !allowedTopLevel.has(key));
    if (extraTopLevel.length) errors.push(`v0.3 최상위 허용 키가 아닌 항목: ${extraTopLevel.join(", ")}`);
    if (!meaningful(packet.workingTitle)) errors.push("workingTitle이 필요합니다.");
}

function validateLeanSearchMetadata(packet, errors) {
    const searchMetadata = packet.searchMetadata;
    if (!isObject(searchMetadata)) {
        errors.push("searchMetadata 객체가 필요합니다.");
    } else {
        reportExtraKeys(searchMetadata, ["classification", "facets", "additionalTags", "aliases", "expectedQueries"], "searchMetadata", errors);
        const classification = searchMetadata.classification;
        if (!isObject(classification)) {
            errors.push("searchMetadata.classification 객체가 필요합니다.");
        } else {
            reportExtraKeys(classification, ["primaryDomain", "secondaryDomains", "workflowStages", "responseTargets"], "searchMetadata.classification", errors);
            if (!DOMAIN_IDS.has(text(classification.primaryDomain))) errors.push("classification.primaryDomain은 허용된 기술영역 ID여야 합니다.");
            const secondaryDomains = list(classification.secondaryDomains);
            if (
                (!isStringArray(classification.secondaryDomains)
                    && !(Array.isArray(classification.secondaryDomains) && classification.secondaryDomains.length === 0))
                || secondaryDomains.length > 2
                || secondaryDomains.some((value) => !DOMAIN_IDS.has(value))
            ) {
                errors.push("classification.secondaryDomains는 허용된 기술영역 ID 최대 2개여야 합니다.");
            }
            if (secondaryDomains.includes(text(classification.primaryDomain))) errors.push("주 기술영역과 보조 기술영역은 중복될 수 없습니다.");
            const workflowStages = list(classification.workflowStages);
            if (!isStringArray(classification.workflowStages) || !workflowStages.length || workflowStages.some((value) => !WORKFLOW_STAGES.has(value))) {
                errors.push("classification.workflowStages는 허용된 업무 단계 1개 이상이어야 합니다.");
            }
            const responseTargets = list(classification.responseTargets);
            if (!isStringArray(classification.responseTargets) || !responseTargets.length || responseTargets.some((value) => !RESPONSE_TARGETS.has(value))) {
                errors.push("classification.responseTargets는 허용된 대응 대상 1개 이상이어야 합니다.");
            }
        }
        const facets = searchMetadata.facets;
        if (!isObject(facets)) {
            errors.push("searchMetadata.facets 객체가 필요합니다.");
        } else {
            reportExtraKeys(facets, ["problemPhenomena", "productStructureProcess", "toolModelData"], "searchMetadata.facets", errors);
            const problemPhenomena = list(facets.problemPhenomena);
            if (!isStringArray(facets.problemPhenomena) || problemPhenomena.length < 1 || problemPhenomena.length > 3) {
                errors.push("facets.problemPhenomena는 1~3개여야 합니다.");
            }
            ["productStructureProcess", "toolModelData"].forEach((key) => {
                if (!isStringArray(facets[key]) && !(Array.isArray(facets[key]) && facets[key].length === 0)) {
                    errors.push(`facets.${key}는 비어 있거나 값이 있는 문자열 배열이어야 합니다.`);
                }
            });
        }
        if ((!isStringArray(searchMetadata.additionalTags) && !(Array.isArray(searchMetadata.additionalTags) && searchMetadata.additionalTags.length === 0))
            || list(searchMetadata.additionalTags).length > 3) {
            errors.push("searchMetadata.additionalTags는 최대 3개의 배열이어야 합니다.");
        }
        if (!isStringArray(searchMetadata.aliases) && !(Array.isArray(searchMetadata.aliases) && searchMetadata.aliases.length === 0)) {
            errors.push("searchMetadata.aliases는 비어 있거나 값이 있는 문자열 배열이어야 합니다.");
        }
        if ((!isStringArray(searchMetadata.expectedQueries) && !(Array.isArray(searchMetadata.expectedQueries) && searchMetadata.expectedQueries.length === 0))
            || list(searchMetadata.expectedQueries).length > 2) {
            errors.push("searchMetadata.expectedQueries는 최대 2개의 배열이어야 합니다.");
        }
    }
}

function validateLeanInternalCompletion(packet, errors) {
    if (!isObject(packet.internalCompletion)) {
        errors.push("internalCompletion.factsToConfirm 배열이 필요합니다.");
    } else {
        reportExtraKeys(packet.internalCompletion, ["factsToConfirm"], "internalCompletion", errors);
        if (!isStringArray(packet.internalCompletion.factsToConfirm)
            && !(Array.isArray(packet.internalCompletion.factsToConfirm) && packet.internalCompletion.factsToConfirm.length === 0)) {
            errors.push("internalCompletion.factsToConfirm은 비어 있거나 값이 있는 문자열 배열이어야 합니다.");
        }
    }
}

function finalizeLeanValidation(packet, errors) {
    validateLeanSearchMetadata(packet, errors);
    validateLeanInternalCompletion(packet, errors);
    if (containsPlaceholder(packet)) {
        errors.push('본문과 검색값에는 "확인 필요", "미확인", "TBD" 같은 대체값을 넣지 말고 구체적인 사실만 factsToConfirm에 기록하세요.');
    }
    return [...new Set(errors)];
}

function requireTextField(value, path, errors) {
    if (!meaningful(value)) errors.push(`${path}가 필요합니다.`);
}

function requireStringList(value, path, errors, { min = 1, max = Infinity } = {}) {
    if (!isStringArray(value) || value.length < min || value.length > max) {
        const range = Number.isFinite(max) ? `${min}~${max}개` : `${min}개 이상`;
        errors.push(`${path}는 값이 ${range}인 문자열 배열이어야 합니다.`);
    }
}

function allowEmptyStringList(value, path, errors, { max = Infinity } = {}) {
    if (!Array.isArray(value) || value.some((item) => typeof item !== "string" || !text(item)) || value.length > max) {
        const suffix = Number.isFinite(max) ? ` 최대 ${max}개` : "";
        errors.push(`${path}는 비어 있거나 값이 있는 문자열 배열${suffix}여야 합니다.`);
    }
}

export function validateLeanVdRequestPacket(packet = {}) {
    const errors = [];
    if (!isObject(packet)) return ["JSON 객체가 아닙니다."];
    validateLeanEnvelope(packet, "VD Request", errors);

    const content = packet.content;
    if (!isObject(content)) {
        errors.push("content 객체가 필요합니다.");
    } else {
        reportExtraKeys(content, [
            "context", "primaryQuestion", "inputsAndConstraints", "approach", "result",
            "applicability", "evidenceSummary", "requesterFeedback", "decisionImpact", "followUp"
        ], "content", errors);
        ["context", "primaryQuestion", "approach", "result"].forEach((key) => {
            if (!meaningful(content[key])) errors.push(`content.${key}가 필요합니다.`);
        });
        ["inputsAndConstraints", "evidenceSummary"].forEach((key) => {
            if (!isStringArray(content[key]) || !content[key].length) {
                errors.push(`content.${key}는 값이 1개 이상인 문자열 배열이어야 합니다.`);
            }
        });
        ["followUp"].forEach((key) => {
            if (!isStringArray(content[key]) && !(Array.isArray(content[key]) && content[key].length === 0)) {
                errors.push(`content.${key}는 비어 있거나 값이 있는 문자열 배열이어야 합니다.`);
            }
        });
        if (!isObject(content.applicability)) {
            errors.push("content.applicability 객체가 필요합니다.");
        } else {
            reportExtraKeys(content.applicability, ["judgmentScope", "validConditions", "limitations"], "content.applicability", errors);
            if (!meaningful(content.applicability.judgmentScope)) errors.push("content.applicability.judgmentScope가 필요합니다.");
            ["validConditions", "limitations"].forEach((key) => {
                const value = content.applicability[key];
                if (!isStringArray(value) || !value.length) {
                    errors.push(`content.applicability.${key}는 값이 1개 이상인 문자열 배열이어야 합니다.`);
                }
            });
        }
        if (!(content.requesterFeedback === null || (typeof content.requesterFeedback === "string" && text(content.requesterFeedback)))) {
            errors.push("content.requesterFeedback은 내용이 있는 문자열 또는 null이어야 합니다.");
        }
        if (!(content.decisionImpact === null || isObject(content.decisionImpact))) {
            errors.push("content.decisionImpact는 객체 또는 null이어야 합니다.");
        } else if (isObject(content.decisionImpact)) {
            reportExtraKeys(content.decisionImpact, ["outcomes", "summary"], "content.decisionImpact", errors);
            if (!isStringArray(content.decisionImpact.outcomes) || !content.decisionImpact.outcomes.length) {
                errors.push("content.decisionImpact.outcomes는 값이 1개 이상인 문자열 배열이어야 합니다.");
            }
            if (!meaningful(content.decisionImpact.summary)) errors.push("content.decisionImpact.summary가 필요합니다.");
        }
    }

    return finalizeLeanValidation(packet, errors);
}

export function validateLeanCorPacket(packet = {}) {
    const errors = [];
    if (!isObject(packet)) return ["JSON 객체가 아닙니다."];
    validateLeanEnvelope(packet, "CoR", errors);

    const content = packet.content;
    if (!isObject(content)) {
        errors.push("content 객체가 필요합니다.");
    } else {
        reportExtraKeys(content, [
            "backgroundAndGap",
            "objectiveAndSuccessCriteria",
            "scopeAndPlan",
            "validationDesign",
            "progressDecisions",
            "resultAndJudgment",
            "outputsAndFollowUp"
        ], "content", errors);
        [
            "backgroundAndGap",
            "objectiveAndSuccessCriteria",
            "scopeAndPlan",
            "validationDesign",
            "resultAndJudgment"
        ].forEach((key) => {
            if (!meaningful(content[key])) errors.push(`content.${key}가 필요합니다.`);
        });
        ["progressDecisions", "outputsAndFollowUp"].forEach((key) => {
            if (!isStringArray(content[key]) || !content[key].length) {
                errors.push(`content.${key}는 값이 1개 이상인 문자열 배열이어야 합니다.`);
            }
        });
    }

    return finalizeLeanValidation(packet, errors);
}

export function validateLeanMethodologyPacket(packet = {}) {
    const errors = [];
    if (!isObject(packet)) return ["JSON 객체가 아닙니다."];
    validateLeanEnvelope(packet, "방법론", errors, ["levelAssessmentCandidate"]);

    const content = packet.content;
    if (!isObject(content)) {
        errors.push("content 객체가 필요합니다.");
    } else {
        reportExtraKeys(content, [
            "problemAndPurpose",
            "technicalPrinciples",
            "inputsAndPrerequisites",
            "standardProcedure",
            "resultsAndCriteria",
            "scopeAndLimits",
            "validationAndReuse"
        ], "content", errors);
        ["problemAndPurpose", "technicalPrinciples", "resultsAndCriteria"].forEach((key) => {
            if (!meaningful(content[key])) errors.push(`content.${key}가 필요합니다.`);
        });
        ["inputsAndPrerequisites", "standardProcedure", "scopeAndLimits"].forEach((key) => {
            if (!isStringArray(content[key]) || !content[key].length) {
                errors.push(`content.${key}은 값이 1개 이상인 문자열 배열이어야 합니다.`);
            }
        });
        if (!Array.isArray(content.validationAndReuse)
            || content.validationAndReuse.some((item) => typeof item !== "string" || !text(item))) {
            errors.push("content.validationAndReuse는 비어 있거나 값이 있는 문자열 배열이어야 합니다.");
        }
    }

    const assessment = packet.levelAssessmentCandidate;
    if (!isObject(assessment)) {
        errors.push("levelAssessmentCandidate 객체가 필요합니다.");
    } else {
        reportExtraKeys(
            assessment,
            ["currentLevel", "proposedLevel", "rationale", "evidenceCandidates", "remainingGap"],
            "levelAssessmentCandidate",
            errors
        );
        const currentLevel = assessment.currentLevel;
        if (!(currentLevel === undefined || currentLevel === null || METHODOLOGY_LEVELS.has(text(currentLevel)))) {
            errors.push("levelAssessmentCandidate.currentLevel은 L1~L5, null 또는 생략이어야 합니다.");
        }
        const proposedLevel = assessment.proposedLevel;
        if (!(proposedLevel === null || METHODOLOGY_LEVELS.has(text(proposedLevel)))) {
            errors.push("levelAssessmentCandidate.proposedLevel은 L1~L5 또는 null이어야 합니다.");
        }
        if (typeof assessment.rationale !== "string") {
            errors.push("levelAssessmentCandidate.rationale은 문자열이어야 합니다.");
        }
        ["evidenceCandidates", "remainingGap"].forEach((key) => {
            if (!isStringArray(assessment[key]) && !(Array.isArray(assessment[key]) && assessment[key].length === 0)) {
                errors.push(`levelAssessmentCandidate.${key}은 비어 있거나 값이 있는 문자열 배열이어야 합니다.`);
            }
        });
        if (proposedLevel !== null) {
            if (!meaningful(assessment.rationale)) {
                errors.push("Level 후보를 제안하려면 levelAssessmentCandidate.rationale이 필요합니다.");
            }
            if (!isStringArray(assessment.evidenceCandidates) || !assessment.evidenceCandidates.length) {
                errors.push("Level 후보를 제안하려면 levelAssessmentCandidate.evidenceCandidates가 1개 이상 필요합니다.");
            }
        }
    }

    return finalizeLeanValidation(packet, errors);
}

export function validateLeanBpPacket(packet = {}) {
    const errors = [];
    if (!isObject(packet)) return ["JSON 객체가 아닙니다."];
    validateLeanEnvelope(packet, "BP", errors);
    const content = packet.content;
    if (!isObject(content)) {
        errors.push("content 객체가 필요합니다.");
    } else {
        reportExtraKeys(content, [
            "businessContext", "simulationResponse", "businessFeedback", "businessImpact",
            "reproductionConditions", "evidence"
        ], "content", errors);
        requireTextField(content.businessContext, "content.businessContext", errors);
        requireTextField(content.simulationResponse, "content.simulationResponse", errors);
        if (!isObject(content.businessFeedback)) {
            errors.push("content.businessFeedback 객체가 필요합니다.");
        } else {
            reportExtraKeys(content.businessFeedback, ["status", "summary", "evidence"], "content.businessFeedback", errors);
            const feedbackStatuses = new Set(["확인 완료", "피드백 대기", "해당 없음"]);
            if (!feedbackStatuses.has(text(content.businessFeedback.status))) {
                errors.push("content.businessFeedback.status는 확인 완료, 피드백 대기, 해당 없음 중 하나여야 합니다.");
            }
            requireTextField(content.businessFeedback.summary, "content.businessFeedback.summary", errors);
            requireTextField(content.businessFeedback.evidence, "content.businessFeedback.evidence", errors);
        }
        if (!isObject(content.businessImpact)) {
            errors.push("content.businessImpact 객체가 필요합니다.");
        } else {
            reportExtraKeys(content.businessImpact, ["areas", "pathway", "confirmationLevel"], "content.businessImpact", errors);
            requireStringList(content.businessImpact.areas, "content.businessImpact.areas", errors, { min: 1, max: 3 });
            requireTextField(content.businessImpact.pathway, "content.businessImpact.pathway", errors);
            const levels = new Set(["기대효과", "업무 반영", "사업부 확인", "실측 확인"]);
            if (!levels.has(text(content.businessImpact.confirmationLevel))) {
                errors.push("content.businessImpact.confirmationLevel은 기대효과, 업무 반영, 사업부 확인, 실측 확인 중 하나여야 합니다.");
            }
        }
        requireStringList(content.reproductionConditions, "content.reproductionConditions", errors);
        requireStringList(content.evidence, "content.evidence", errors);
    }
    return finalizeLeanValidation(packet, errors);
}

export function validateLeanTechnicalReportPacket(packet = {}) {
    const errors = [];
    if (!isObject(packet)) return ["JSON 객체가 아닙니다."];
    validateLeanEnvelope(packet, "기술보고서", errors);
    const content = packet.content;
    if (!isObject(content)) {
        errors.push("content 객체가 필요합니다.");
    } else {
        reportExtraKeys(content, [
            "questionAndPurpose", "scopeAndConditions", "methodAndEvidence", "findingsAndConclusion",
            "validConditionsAndDecisions", "limitations", "sourceAndRelationRoles"
        ], "content", errors);
        ["questionAndPurpose", "methodAndEvidence", "findingsAndConclusion"].forEach((key) => {
            requireTextField(content[key], `content.${key}`, errors);
        });
        ["scopeAndConditions", "limitations", "sourceAndRelationRoles"].forEach((key) => {
            requireStringList(content[key], `content.${key}`, errors);
        });
        const decisions = content.validConditionsAndDecisions;
        if (!isObject(decisions)) {
            errors.push("content.validConditionsAndDecisions 객체가 필요합니다.");
        } else {
            reportExtraKeys(decisions, ["validConditions", "supportedDecisions", "unsupportedDecisions"], "content.validConditionsAndDecisions", errors);
            ["validConditions", "supportedDecisions", "unsupportedDecisions"].forEach((key) => {
                requireStringList(decisions[key], `content.validConditionsAndDecisions.${key}`, errors);
            });
        }
    }
    return finalizeLeanValidation(packet, errors);
}

export function validateLeanExternalReportPacket(packet = {}) {
    const errors = [];
    if (!isObject(packet)) return ["JSON 객체가 아닙니다."];
    validateLeanEnvelope(packet, "외부 보고 자료", errors);
    const content = packet.content;
    if (!isObject(content)) {
        errors.push("content 객체가 필요합니다.");
    } else {
        reportExtraKeys(content, [
            "reportPurpose", "audienceAndDecision", "approvedMessages", "sourceAssetsAndEvidence",
            "disclosureScope", "versionAndValidity", "limitationsAndNotes"
        ], "content", errors);
        ["reportPurpose", "audienceAndDecision", "disclosureScope"].forEach((key) => {
            requireTextField(content[key], `content.${key}`, errors);
        });
        ["approvedMessages", "sourceAssetsAndEvidence", "limitationsAndNotes"].forEach((key) => {
            requireStringList(content[key], `content.${key}`, errors);
        });
        const validity = content.versionAndValidity;
        if (!isObject(validity)) {
            errors.push("content.versionAndValidity 객체가 필요합니다.");
        } else {
            reportExtraKeys(validity, ["validityConditions", "reviewTriggers"], "content.versionAndValidity", errors);
            requireStringList(validity.validityConditions, "content.versionAndValidity.validityConditions", errors);
            requireStringList(validity.reviewTriggers, "content.versionAndValidity.reviewTriggers", errors);
        }
    }
    return finalizeLeanValidation(packet, errors);
}

export function validateLeanKnowhowPacket(packet = {}) {
    const errors = [];
    if (!isObject(packet)) return ["JSON 객체가 아닙니다."];
    validateLeanEnvelope(packet, "노하우", errors);
    const content = packet.content;
    if (!isObject(content)) {
        errors.push("content 객체가 필요합니다.");
    } else {
        reportExtraKeys(content, [
            "knowhowCategory", "symptomAndConditions", "causeAndDiagnosis", "resolution",
            "effectAndEvidence", "risksAndRecovery", "versionsAndSources"
        ], "content", errors);
        const categories = new Set(["기술 수행", "산출물 작성", "업무 절차", "협업·소통"]);
        if (!categories.has(text(content.knowhowCategory))) {
            errors.push("content.knowhowCategory는 기술 수행, 산출물 작성, 업무 절차, 협업·소통 중 하나여야 합니다.");
        }
        const symptoms = content.symptomAndConditions;
        if (!isObject(symptoms)) {
            errors.push("content.symptomAndConditions 객체가 필요합니다.");
        } else {
            reportExtraKeys(symptoms, ["situationAndGoal", "triggerOrFrequency"], "content.symptomAndConditions", errors);
            requireTextField(symptoms.situationAndGoal, "content.symptomAndConditions.situationAndGoal", errors);
            requireTextField(symptoms.triggerOrFrequency, "content.symptomAndConditions.triggerOrFrequency", errors);
        }
        const diagnosis = content.causeAndDiagnosis;
        if (!isObject(diagnosis)) {
            errors.push("content.causeAndDiagnosis 객체가 필요합니다.");
        } else {
            reportExtraKeys(diagnosis, ["keyDifficulty", "checksBeforeAction", "ineffectiveAttempts"], "content.causeAndDiagnosis", errors);
            requireTextField(diagnosis.keyDifficulty, "content.causeAndDiagnosis.keyDifficulty", errors);
            requireStringList(diagnosis.checksBeforeAction, "content.causeAndDiagnosis.checksBeforeAction", errors);
            allowEmptyStringList(diagnosis.ineffectiveAttempts, "content.causeAndDiagnosis.ineffectiveAttempts", errors);
        }
        if (!Array.isArray(content.resolution) || !content.resolution.length || content.resolution.length > 7) {
            errors.push("content.resolution은 1~7단계의 배열이어야 합니다.");
        } else {
            content.resolution.forEach((entry, index) => {
                if (!isObject(entry)) {
                    errors.push(`content.resolution[${index}]은 객체여야 합니다.`);
                    return;
                }
                reportExtraKeys(entry, ["step", "action", "judgment"], `content.resolution[${index}]`, errors);
                if (!Number.isInteger(entry.step) || entry.step !== index + 1) {
                    errors.push(`content.resolution[${index}].step은 ${index + 1}이어야 합니다.`);
                }
                requireTextField(entry.action, `content.resolution[${index}].action`, errors);
                requireTextField(entry.judgment, `content.resolution[${index}].judgment`, errors);
            });
        }
        const effect = content.effectAndEvidence;
        if (!isObject(effect)) {
            errors.push("content.effectAndEvidence 객체가 필요합니다.");
        } else {
            reportExtraKeys(effect, ["completionCriteria", "result", "evidenceLevel"], "content.effectAndEvidence", errors);
            requireStringList(effect.completionCriteria, "content.effectAndEvidence.completionCriteria", errors);
            requireTextField(effect.result, "content.effectAndEvidence.result", errors);
            requireTextField(effect.evidenceLevel, "content.effectAndEvidence.evidenceLevel", errors);
        }
        const risks = content.risksAndRecovery;
        if (!isObject(risks)) {
            errors.push("content.risksAndRecovery 객체가 필요합니다.");
        } else {
            reportExtraKeys(risks, ["doNotApply", "risksOrFailureSignals", "escalationOrRecovery"], "content.risksAndRecovery", errors);
            allowEmptyStringList(risks.doNotApply, "content.risksAndRecovery.doNotApply", errors);
            requireStringList(risks.risksOrFailureSignals, "content.risksAndRecovery.risksOrFailureSignals", errors);
            requireStringList(risks.escalationOrRecovery, "content.risksAndRecovery.escalationOrRecovery", errors);
        }
        requireStringList(content.versionsAndSources, "content.versionsAndSources", errors);
    }
    return finalizeLeanValidation(packet, errors);
}

export function validateLeanToolManualPacket(packet = {}) {
    const errors = [];
    if (!isObject(packet)) return ["JSON 객체가 아닙니다."];
    validateLeanEnvelope(packet, "Tool Manual", errors);
    const content = packet.content;
    if (!isObject(content)) {
        errors.push("content 객체가 필요합니다.");
    } else {
        reportExtraKeys(content, [
            "purposeAndOutput", "prerequisites", "procedure", "completionCheck",
            "errorsAndWarnings", "versionsAndSources"
        ], "content", errors);
        requireTextField(content.purposeAndOutput, "content.purposeAndOutput", errors);
        requireStringList(content.prerequisites, "content.prerequisites", errors);
        requireStringList(content.procedure, "content.procedure", errors);
        const completion = content.completionCheck;
        if (!isObject(completion)) {
            errors.push("content.completionCheck 객체가 필요합니다.");
        } else {
            reportExtraKeys(completion, ["expectedResult", "invalidSignals"], "content.completionCheck", errors);
            requireTextField(completion.expectedResult, "content.completionCheck.expectedResult", errors);
            requireStringList(completion.invalidSignals, "content.completionCheck.invalidSignals", errors);
        }
        const warnings = content.errorsAndWarnings;
        if (!isObject(warnings)) {
            errors.push("content.errorsAndWarnings 객체가 필요합니다.");
        } else {
            reportExtraKeys(warnings, ["stopConditions", "commonRisks"], "content.errorsAndWarnings", errors);
            requireStringList(warnings.stopConditions, "content.errorsAndWarnings.stopConditions", errors);
            requireStringList(warnings.commonRisks, "content.errorsAndWarnings.commonRisks", errors);
        }
        requireStringList(content.versionsAndSources, "content.versionsAndSources", errors);
    }
    return finalizeLeanValidation(packet, errors);
}

export function validateLeanEducationMaterialPacket(packet = {}) {
    const errors = [];
    if (!isObject(packet)) return ["JSON 객체가 아닙니다."];
    validateLeanEnvelope(packet, "교육자료", errors);
    const content = packet.content;
    if (!isObject(content)) {
        errors.push("content 객체가 필요합니다.");
    } else {
        reportExtraKeys(content, [
            "learningObjectives", "audienceAndPrerequisites", "outline", "activities",
            "completionCriteria", "sourcesAndVersion"
        ], "content", errors);
        requireStringList(content.learningObjectives, "content.learningObjectives", errors, { min: 1, max: 3 });
        const audience = content.audienceAndPrerequisites;
        if (!isObject(audience)) {
            errors.push("content.audienceAndPrerequisites 객체가 필요합니다.");
        } else {
            reportExtraKeys(audience, ["audience", "prerequisites"], "content.audienceAndPrerequisites", errors);
            requireTextField(audience.audience, "content.audienceAndPrerequisites.audience", errors);
            allowEmptyStringList(audience.prerequisites, "content.audienceAndPrerequisites.prerequisites", errors);
        }
        requireStringList(content.outline, "content.outline", errors);
        const activities = content.activities;
        if (!isObject(activities)) {
            errors.push("content.activities 객체가 필요합니다.");
        } else {
            reportExtraKeys(activities, ["methods", "expectedDuration", "materials"], "content.activities", errors);
            requireStringList(activities.methods, "content.activities.methods", errors);
            requireTextField(activities.expectedDuration, "content.activities.expectedDuration", errors);
            allowEmptyStringList(activities.materials, "content.activities.materials", errors);
        }
        requireStringList(content.completionCriteria, "content.completionCriteria", errors);
        requireStringList(content.sourcesAndVersion, "content.sourcesAndVersion", errors);
    }
    return finalizeLeanValidation(packet, errors);
}

export function validateLeanHandoffPacket(packet = {}) {
    if (!isObject(packet)) return ["JSON 객체가 아닙니다."];
    const cardType = handoffCardType(packet);
    if (cardType === "VD Request") return validateLeanVdRequestPacket(packet);
    if (cardType === "CoR") return validateLeanCorPacket(packet);
    if (cardType === "방법론") return validateLeanMethodologyPacket(packet);
    if (cardType === "BP") return validateLeanBpPacket(packet);
    if (cardType === "기술보고서") return validateLeanTechnicalReportPacket(packet);
    if (cardType === "외부 보고 자료") return validateLeanExternalReportPacket(packet);
    if (cardType === "노하우") return validateLeanKnowhowPacket(packet);
    if (cardType === "Tool Manual") return validateLeanToolManualPacket(packet);
    if (cardType === "교육자료") return validateLeanEducationMaterialPacket(packet);
    const errors = [];
    if (text(packet.packetVersion) !== "0.3") errors.push('packetVersion은 "0.3"이어야 합니다.');
    errors.push(`v0.3에서 지원하지 않는 cardType입니다: ${cardType || "(없음)"}`);
    return [...new Set(errors)];
}
