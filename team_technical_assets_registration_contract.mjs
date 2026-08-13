/**
 * Technical Asset 등록 화면에서 공통으로 사용하는 안정적인 계약값.
 *
 * 화면 렌더링, Handoff 검증, GitLab Wiki 변환이 같은 분류·상태·필수값을
 * 바라보도록 DOM 이벤트 코드와 분리해서 관리한다.
 */

export const REGISTRATION_CARD_TYPES = Object.freeze([
    "방법론",
    "BP",
    "VD Request",
    "CoR",
    "기술보고서",
    "외부 보고 자료",
    "노하우",
    "Tool Manual",
    "교육자료"
]);

export const REGISTRATION_PUBLICATION_STATUSES = Object.freeze([
    "초안",
    "검토 중",
    "게시",
    "개정 필요",
    "폐기"
]);

export const REGISTRATION_TYPE_STATUSES = Object.freeze({
    "방법론": Object.freeze(["방법론 후보", "정식 방법론"]),
    "BP": Object.freeze(["BP 후보", "BP", "승격 보류", "자격 해제"]),
    "VD Request": Object.freeze(["접수", "수행 중", "완료", "보류", "취소"]),
    "CoR": Object.freeze(["완료", "Drop"]),
    "기술보고서": Object.freeze(["작성 중", "검토 중", "검토 완료", "보완 필요"]),
    "외부 보고 자료": Object.freeze(["작성 중", "검토 중", "검토 완료", "보완 필요"]),
    "노하우": Object.freeze(["작성 중", "검토 중", "검토 완료", "보완 필요"]),
    "Tool Manual": Object.freeze(["작성 중", "검토 중", "검토 완료", "보완 필요"]),
    "교육자료": Object.freeze(["작성 중", "검토 중", "검토 완료", "보완 필요"])
});

/**
 * 최초 등록 화면에서 등록자가 직접 결정해야 하는 최소 상태값.
 * REGISTRATION_TYPE_STATUSES는 기존 Wiki의 이력 호환을 위해 유지하고,
 * 신규 등록 UI는 이 값을 사용해 작성·검토 중 같은 운영 상태를 만들지 않는다.
 */
export const REGISTRATION_INITIAL_TYPE_STATUSES = Object.freeze({
    "방법론": Object.freeze(["방법론 후보", "정식 방법론"]),
    "BP": Object.freeze(["BP 후보", "BP"]),
    "VD Request": Object.freeze(["완료"]),
    "CoR": Object.freeze(["완료", "Drop"]),
    "기술보고서": Object.freeze(["검토 완료"]),
    "외부 보고 자료": Object.freeze(["검토 완료"]),
    "노하우": Object.freeze(["검토 완료"]),
    "Tool Manual": Object.freeze(["검토 완료"]),
    "교육자료": Object.freeze(["검토 완료"])
});

export const SOURCE_LINK_DECISION_STATUSES = Object.freeze([
    "linked",
    "no_internal_asset"
]);

export const REGISTRATION_REQUIRED_CONTENT_FIELDS = Object.freeze({
    "방법론": Object.freeze(["problemAndPurpose", "technicalPrinciples", "inputsAndPrerequisites", "standardProcedure", "resultsAndCriteria", "scopeAndLimits", "validationAndReuse"]),
    "BP": Object.freeze(["businessContext", "simulationResponse", "businessFeedback", "businessImpact", "reproductionConditions", "evidence"]),
    "VD Request": Object.freeze([
        "context",
        "primaryQuestion",
        "inputsAndConstraints",
        "approach",
        "evidenceSummary",
        "result",
        "applicability.judgmentScope",
        "applicability.validConditions",
        "applicability.limitations"
    ]),
    "CoR": Object.freeze(["backgroundAndGap", "objectiveAndSuccessCriteria", "scopeAndPlan", "validationDesign", "progressDecisions", "resultAndJudgment", "outputsAndFollowUp"]),
    "기술보고서": Object.freeze(["questionAndPurpose", "scopeAndConditions", "methodAndEvidence", "findingsAndConclusion", "validConditionsAndDecisions", "limitations", "sourceAndRelationRoles"]),
    "외부 보고 자료": Object.freeze(["reportPurpose", "audienceAndDecision", "approvedMessages", "sourceAssetsAndEvidence", "disclosureScope", "versionAndValidity", "limitationsAndNotes"]),
    "노하우": Object.freeze(["knowhowCategory", "symptomAndConditions", "causeAndDiagnosis", "resolution", "effectAndEvidence", "risksAndRecovery", "versionsAndSources"]),
    "Tool Manual": Object.freeze(["purposeAndOutput", "prerequisites", "procedure", "completionCheck", "errorsAndWarnings", "versionsAndSources"]),
    "교육자료": Object.freeze(["learningObjectives", "audienceAndPrerequisites", "outline", "activities", "completionCriteria", "sourcesAndVersion"])
});

export const CONTROLLED_VISIBLE_TAG_GROUPS = Object.freeze({
    "모델·해석": Object.freeze(["물성/재료모델", "경계조건", "접촉/계면", "비선형", "Mesh/요소", "수렴/안정화", "계산 효율화"]),
    "검증·판단": Object.freeze(["실험 상관", "민감도 분석", "불확실성 검토", "설계안 비교", "원인 규명", "판단 기준", "최적화"]),
    "재사용·확산": Object.freeze(["자동화/AI", "재사용 템플릿"])
});

export const CONTROLLED_VISIBLE_TAGS = Object.freeze(
    Object.values(CONTROLLED_VISIBLE_TAG_GROUPS).flat()
);

export const REGISTRATION_TYPE_TAG_FOCUS = Object.freeze({
    "VD Request": Object.freeze(["설계안 비교", "원인 규명", "판단 기준", "실험 상관", "불확실성 검토"]),
    "CoR": Object.freeze(["원인 규명", "판단 기준", "실험 상관", "최적화", "재사용 템플릿"]),
    "방법론": Object.freeze(["물성/재료모델", "경계조건", "접촉/계면", "비선형", "Mesh/요소", "수렴/안정화", "계산 효율화", "실험 상관"]),
    "BP": Object.freeze(["설계안 비교", "원인 규명", "판단 기준", "최적화", "재사용 템플릿"]),
    "기술보고서": Object.freeze(["원인 규명", "판단 기준", "실험 상관", "민감도 분석", "불확실성 검토"]),
    "노하우": Object.freeze(["수렴/안정화", "계산 효율화", "자동화/AI", "재사용 템플릿", "판단 기준"]),
    "Tool Manual": Object.freeze(["Mesh/요소", "수렴/안정화", "계산 효율화", "자동화/AI", "재사용 템플릿"]),
    "교육자료": Object.freeze(["물성/재료모델", "경계조건", "접촉/계면", "비선형", "실험 상관", "판단 기준"]),
    "외부 보고 자료": Object.freeze(["설계안 비교", "원인 규명", "판단 기준", "실험 상관", "불확실성 검토"])
});

export const FRAMEWORK_TARGETS = Object.freeze({
    technologyMap: Object.freeze({ framework: "technology-map", targetType: "methodology" }),
    learningPath: Object.freeze({ framework: "learning-path", targetType: "capability" })
});

export const TECHNOLOGY_MAP_STATUSES = Object.freeze(["linked", "unlisted_new", "unlisted_omitted", "pending"]);

export const LEARNING_PATH_STATUSES = Object.freeze(["linked", "not_applicable", "target_missing"]);

export const FRAMEWORK_STATUSES = Object.freeze([
    ...new Set([...TECHNOLOGY_MAP_STATUSES, ...LEARNING_PATH_STATUSES])
]);

export const FRAMEWORK_RELATION_TYPES = Object.freeze([
    "DEFINES",
    "TEACHES",
    "PRACTICES",
    "ENABLES",
    "EXAMPLE_OF",
    "APPLIES",
    "VALIDATES",
    "EVIDENCE_FOR",
    "REFERENCES"
]);

export const VD_REQUEST_REQUIRED_EVIDENCE_STATUSES = Object.freeze([
    "confirmed",
    "deferred",
    "not_applicable"
]);

export const VD_REQUEST_REQUIRED_EVIDENCE_FIELDS = Object.freeze({
    requesterFeedback: "요청자 피드백",
    decisionImpact: "의사결정 영향"
});

export const RELATION_TYPES = Object.freeze([
    "USES",
    "EVIDENCE_FOR",
    "DERIVED_FROM",
    "IMPROVES",
    "RELATED_TO",
    "SUPERSEDES",
    "REQUESTED_BY",
    "RESULTED_IN",
    "REFERENCES"
]);

export const VD_RELATION_USAGE_OPTIONS = Object.freeze([
    Object.freeze(["직접 재사용", "USES"]),
    Object.freeze(["조건 변경 적용", "USES"]),
    Object.freeze(["참고", "REFERENCES"]),
    Object.freeze(["검증 근거", "EVIDENCE_FOR"]),
    Object.freeze(["발견했으나 미사용", "RELATED_TO"])
]);

export const LINK_TYPES = Object.freeze([
    "VD Request 원문",
    "Simulation 결과보고서",
    "기술보고서",
    "BP",
    "CoR",
    "모델·해석 파일",
    "시험 결과",
    "요구사항·회의체 결정",
    "교육자료",
    "기타 사내 시스템"
]);

export const LINK_ROLES = Object.freeze([
    Object.freeze(["source", "원본"]),
    Object.freeze(["evidence", "검증 근거"]),
    Object.freeze(["deliverable", "결과물"]),
    Object.freeze(["model", "모델·해석 파일"]),
    Object.freeze(["decision", "의사결정 기록"]),
    Object.freeze(["reference", "참고자료"])
]);

export const ACCESS_SCOPES = Object.freeze([
    "VDE 내부",
    "CTO 내부",
    "사업부 협업",
    "회사 전체",
    "권한 확인 필요"
]);

export const REQUIRED_EVIDENCE_STATUS_OPTIONS = Object.freeze([
    Object.freeze(["", "처리 상태 선택"]),
    Object.freeze(["confirmed", "확인 완료"]),
    Object.freeze(["deferred", "추후 확인"]),
    Object.freeze(["not_applicable", "해당 없음"])
]);

export const VD_CONTENT_FIELD_NAMES = Object.freeze([
    "vdContext",
    "vdPrimaryQuestion",
    "vdInputsAndConstraints",
    "vdApproach",
    "vdEvidenceSummary",
    "vdResult",
    "vdJudgmentScope",
    "vdValidConditions",
    "vdLimitations",
    "vdFollowUp"
]);
