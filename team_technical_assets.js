const technologyDomains = [
    { id: "deformation", label: "01. 변형", description: "형상 안정성, warpage, 구조 변형, 공정 조건 변화에 따른 치수/응력 판단" },
    { id: "delamination", label: "02. 박리", description: "계면 박리, 접착/층간 취약 조건, 파단면/실험 피드백 기반 판단" },
    { id: "impact", label: "03. 충격", description: "Drop, 충격 취약부, 접촉/재료 비선형, 평가 조건과 연결되는 구조 리스크" },
    { id: "thermal-flow", label: "04. 열유동", description: "온도장, 열-구조 연계, 유동/공정 조건이 구조 판단에 미치는 영향" },
    { id: "fatigue", label: "05. 피로", description: "반복 하중, 열사이클, 손상 누적, 수명 예측과 신뢰성 판단" },
    { id: "vibration", label: "06. 진동", description: "모드, 가진 조건, 동특성, 설계 취약 조건과 실험 비교" },
    { id: "other", label: "07. 기타", description: "복합 Domain, AI/자동화, 공통 기준, 교육/운영 자산" }
];

const contextOptions = [
    { value: "연구", group: "업무 단계", description: "원리 규명, 가능성 검토, 방법론·물성 개발" },
    { value: "설계", group: "업무 단계", description: "구조·치수·설계안 비교와 최적화 판단" },
    { value: "개발", group: "업무 단계", description: "제품 개발 과제, 검증과 개발 일정 의사결정" },
    { value: "공정", group: "업무 단계", description: "공정 조건, Recipe와 Process Window 판단" },
    { value: "제조", group: "업무 단계", description: "양산 라인, 설비, 생산성·수율 판단" },
    { value: "품질", group: "업무 단계", description: "불량, 신뢰성, 품질 기준과 판정" },
    { value: "고객", group: "대응 대상", description: "외부 고객 설명, 협의와 대응" },
    { value: "사업부", group: "대응 대상", description: "사내 사업부 요청과 의사결정 대응" },
    { value: "CTO", group: "대응 대상", description: "CTO 조직의 기술 판단과 연구개발 의사결정 대응" },
    { value: "AX", group: "대응 대상", description: "AX 과제와 데이터·AI 활용 의사결정 대응" },
    { value: "품질경영", group: "대응 대상", description: "품질 기준, 불량과 신뢰성 판단 대응" },
    { value: "생산기술", group: "대응 대상", description: "공정, 설비와 양산 기술 판단 대응" }
];

const publicationScopeOptions = [
    { value: "published", label: "게시 자료만", statuses: ["게시"] },
    { value: "review", label: "검토 중 포함", statuses: ["게시", "검토 중"] },
    { value: "draft", label: "초안까지 포함", statuses: ["게시", "검토 중", "초안"] },
    { value: "working", label: "전체 작업 자료", statuses: ["게시", "검토 중", "초안", "개정 필요"] }
];

const simulationLevels = [
    {
        id: "L1",
        score: 1,
        title: "개념 검증",
        short: "PoC",
        summary: "입력 데이터 기반으로 방향성만 타진하는 수준",
        decision: "Idea",
        data: "Input",
        next: "물리적 특성, 경계조건 등 기초 데이터 구체화"
    },
    {
        id: "L2",
        score: 2,
        title: "초기 예측",
        short: "Initial",
        summary: "일부 데이터로 대략적 추세 파악은 가능하나 오차가 큰 수준",
        decision: "Trend 준비",
        data: "Indirect Test",
        next: "간접 실험 데이터 확보와 유사 사례 매칭"
    },
    {
        id: "L3",
        score: 3,
        title: "경향성 예측",
        short: "Pivot Point",
        summary: "절대값은 제한적이나 설계 변경에 따른 경향 분석과 의사결정이 가능한 수준",
        decision: "Decision",
        data: "Direct Test",
        next: "측정 방법론 정립과 반복 실험을 통한 직접 데이터 정합성 확보"
    },
    {
        id: "L4",
        score: 4,
        title: "준정밀 예측",
        short: "Optimization",
        summary: "높은 정확도로 설계 개선과 최적화에 활용 가능한 수준",
        decision: "Optimization",
        data: "Cross Validation",
        next: "타 모델/케이스 교차 검증으로 모델 범용성 확보"
    },
    {
        id: "L5",
        score: 5,
        title: "고정밀 예측",
        short: "Digital Twin",
        summary: "입력값만으로 실험을 대체할 수 있을 정도의 신뢰도를 확보한 수준",
        decision: "Prediction",
        data: "Feedback Loop",
        next: "지속적인 데이터 피드백 루프와 신뢰도 관리"
    }
];

const methodologyGroups = [
    {
        id: "deformation",
        label: "01. 변형",
        description: "형상 안정성, warpage, 조립/공정 조건에 따른 변형 판단",
        methods: [
            {
                id: "warpage-stack",
                name: "박막 적층 Warpage 예측",
                level: 3,
                target: 4,
                evidence: "대표 BP와 물성 민감도 비교는 있으나 교차 검증 확대 필요",
                gap: "제품군별 온도 의존 물성 및 실험 비교 데이터",
                nextAction: "대표 구조 2종으로 교차 검증 케이스를 추가"
            },
            {
                id: "assembly-deformation",
                name: "조립 변형/공차 영향 분석",
                level: 2,
                target: 3,
                evidence: "유사 사례 기반 추세 판단 가능",
                gap: "조립 조건별 직접 측정 데이터와 boundary condition 표준",
                nextAction: "반복 사용되는 조립 조건 Template을 먼저 정리"
            },
            {
                id: "process-sensitivity",
                name: "공정 조건 변형 민감도",
                level: 3,
                target: 4,
                evidence: "조건 변경에 따른 상대 비교와 의사결정 활용 이력 보유",
                gap: "공정 window별 정량 검증과 범용성 확인",
                nextAction: "공정 연계 BP를 Library 근거 자료로 연결"
            }
        ]
    },
    {
        id: "delamination",
        label: "02. 박리",
        description: "계면, 접착, 층간 취약 조건과 파단/실험 피드백 기반 판단",
        methods: [
            {
                id: "interface-risk",
                name: "Interface 박리 Risk Ranking",
                level: 2,
                target: 3,
                evidence: "계면 취약 조건 후보와 CoR 제안 구조 보유",
                gap: "접착/계면 물성, 파단면 피드백, 반복 실험 데이터",
                nextAction: "계면 물성 확보 항목과 측정 방법론을 CoR로 분리"
            },
            {
                id: "adhesive-material",
                name: "Adhesive 물성/파단 기준",
                level: 1,
                target: 3,
                evidence: "PoC 수준의 입력 가정과 문헌/유사값 활용",
                gap: "실측 물성, 온도/속도 의존성, failure criterion",
                nextAction: "L3 진입을 위한 최소 물성 Card 후보 정의"
            }
        ]
    },
    {
        id: "impact",
        label: "03. 충격",
        description: "Drop, Tumble, Set Drop과 접촉/재료 비선형 조건 판단",
        methods: [
            {
                id: "drop-platform",
                name: "Set Drop/Tumble Drop Platform",
                level: 4,
                target: 5,
                evidence: "대표 충격 조건과 취약부 비교, 평가 연결 이력 보유",
                gap: "다수 제품군 Cross Validation과 feedback loop",
                nextAction: "평가 결과와 모델 업데이트 이력을 한 세트로 보존"
            },
            {
                id: "impact-ranking",
                name: "충격 취약부 Ranking",
                level: 3,
                target: 4,
                evidence: "상대 비교 기반으로 설계안 우선순위 판단 가능",
                gap: "재료 비선형/접촉 조건 정합성",
                nextAction: "대표 취약부별 결과 해석 기준을 BP로 분리"
            }
        ]
    },
    {
        id: "thermal-flow",
        label: "04. 열유동",
        description: "온도장, 유동, 열-구조 연계와 공정 조건 전환",
        methods: [
            {
                id: "thermal-structure-coupling",
                name: "열유동-구조 연계",
                level: 2,
                target: 4,
                evidence: "VD Request 결과와 데이터 변환 규칙 초안 보유",
                gap: "mesh/시간축 변환 검증, 온도장 보수성 기준",
                nextAction: "변환 규칙과 한계 조건을 Tool Manual로 정리"
            },
            {
                id: "thermal-shock",
                name: "Thermal Shock 신뢰성 검토",
                level: 3,
                target: 4,
                evidence: "조건별 경향성과 상대 비교 기준 보유",
                gap: "온도 의존 물성 및 반복 실험 직접 비교",
                nextAction: "피로/신뢰성 영역과 연결해 공통 조건 Template 작성"
            }
        ]
    },
    {
        id: "fatigue",
        label: "05. 피로",
        description: "반복 하중, 열사이클, 손상 누적, 수명 예측과 신뢰성 판단",
        methods: [
            {
                id: "thermal-cycle-fatigue",
                name: "열사이클 피로 상대 비교",
                level: 2,
                target: 3,
                evidence: "교육 자료와 기본 개념 정리는 있으나 직접 정합성 부족",
                gap: "반복 실험 데이터, damage assumption, 적용 한계",
                nextAction: "절대 수명 예측보다 L3 경향성 예측 기준부터 표준화"
            },
            {
                id: "crack-risk",
                name: "Crack/Risk Growth 판단",
                level: 1,
                target: 3,
                evidence: "문제 유형과 후보 접근법 수준",
                gap: "crack 성장 데이터, 물성, failure mode 검증",
                nextAction: "대표 실패 사례를 모아 입력 데이터 요구사항 도출"
            }
        ]
    },
    {
        id: "vibration",
        label: "06. 진동",
        description: "모드, 가진 조건, 주파수 응답, 실험 비교 기반 동특성 판단",
        methods: [
            {
                id: "modal-correlation",
                name: "Modal/실험 Matching",
                level: 3,
                target: 4,
                evidence: "모드 해석 세팅과 실험 비교 절차 보유",
                gap: "경계조건 민감도와 반복 케이스 비교",
                nextAction: "자주 틀리는 설정과 검증 기준을 매뉴얼에 보강"
            },
            {
                id: "frequency-response",
                name: "주파수 응답 취약 조건",
                level: 2,
                target: 3,
                evidence: "초기 예측과 조건별 추세 확인 가능",
                gap: "가진 조건 표준화와 실험 응답 데이터",
                nextAction: "대표 가진 조건과 응답 해석 기준을 Library 자료로 연결"
            }
        ]
    },
    {
        id: "other",
        label: "07. 기타/연계",
        description: "복합 물리, AI/자동화, 타 Domain 연계와 신규 방법론 후보",
        methods: [
            {
                id: "ai-asset-search",
                name: "AI 기반 기술자산 검색/요약",
                level: 2,
                target: 3,
                evidence: "검색 키워드와 검증 기준 초안 보유",
                gap: "요약 결과 신뢰도 검증과 보안 기준",
                nextAction: "요약 결과를 그대로 쓰지 않는 review rule 정의"
            },
            {
                id: "multiphysics-coupling",
                name: "Multiphysics 연계 방법론",
                level: 2,
                target: 4,
                evidence: "복합 Domain VD Request 사례 보유",
                gap: "입력/출력 변환 규칙, 책임 Domain, cross validation",
                nextAction: "타 Domain 입력값 검증 체크리스트 작성"
            },
            {
                id: "equivalent-model",
                name: "등가모델/자동화 기반",
                level: 3,
                target: 4,
                evidence: "후속 모델 개발 기반과 전파 이력 보유",
                gap: "모델 범용성, 자동 생성 품질 기준, owner review",
                nextAction: "표준 입력 형식과 검증 샘플을 패키지화"
            }
        ]
    }
];

const statusMeta = {
    "초안": { className: "draft", icon: "bx bx-edit-alt" },
    "방법론 후보": { className: "draft", icon: "bx bx-git-branch" },
    "BP 후보": { className: "draft", icon: "bx bx-star" },
    "제안": { className: "draft", icon: "bx bx-bulb" },
    "작성 중": { className: "draft", icon: "bx bx-pencil" },
    "작성중": { className: "draft", icon: "bx bx-pencil" },
    "수행 중": { className: "review", icon: "bx bx-run" },
    "선정·계획": { className: "review", icon: "bx bx-list-check" },
    "검토 중": { className: "review", icon: "bx bx-search-alt" },
    "검토중": { className: "review", icon: "bx bx-search-alt" },
    "게시": { className: "ready", icon: "bx bx-check-circle" },
    "등록 완료": { className: "ready", icon: "bx bx-check-circle" },
    "등록완료": { className: "ready", icon: "bx bx-check-circle" },
    "정식 방법론": { className: "ready", icon: "bx bx-badge-check" },
    "BP": { className: "ready", icon: "bx bx-star" },
    "완료": { className: "ready", icon: "bx bx-check-circle" },
    "검토 완료": { className: "ready", icon: "bx bx-check-circle" },
    "보완 필요": { className: "need", icon: "bx bx-error-circle" },
    "보완필요": { className: "need", icon: "bx bx-error-circle" },
    "개정 필요": { className: "need", icon: "bx bx-revision" },
    "보류": { className: "need", icon: "bx bx-pause-circle" },
    "취소": { className: "need", icon: "bx bx-x-circle" },
    "중단": { className: "need", icon: "bx bx-stop-circle" },
    "미선정": { className: "need", icon: "bx bx-minus-circle" },
    "폐기": { className: "need", icon: "bx bx-archive" }
};

const publicationStatusMeta = {
    "초안": { className: "draft", icon: "bx bx-edit-alt" },
    "검토 중": { className: "review", icon: "bx bx-search-alt" },
    "게시": { className: "ready", icon: "bx bx-check-circle" },
    "개정 필요": { className: "need", icon: "bx bx-revision" },
    "폐기": { className: "need", icon: "bx bx-archive" }
};

const libraryItems = Array.isArray(window.TECHNICAL_ASSET_LIBRARY?.cards)
    ? window.TECHNICAL_ASSET_LIBRARY.cards
    : [];
const reuseRelationTypes = new Set(["USES", "REFERENCES", "VALIDATES", "VALIDATED_BY", "DERIVED_FROM", "DOCUMENTS", "BASED_ON"]);
const incomingReuseCountById = new Map(libraryItems.map((item) => [item.id, 0]));
libraryItems.forEach((candidate) => {
    const reusedIds = new Set([
        ...(candidate.searchReuse?.foundAssetIds ?? []),
        ...(candidate.relations ?? [])
            .filter((relation) => reuseRelationTypes.has(relation.type))
            .map((relation) => relation.targetId)
    ]);
    reusedIds.forEach((targetId) => {
        if (targetId !== candidate.id && incomingReuseCountById.has(targetId)) {
            incomingReuseCountById.set(targetId, incomingReuseCountById.get(targetId) + 1);
        }
    });
});

const techTreeStages = [
    {
        level: "Level 0",
        title: "Simulation 결과를 판단 근거로 읽기",
        focus: "해석 이미지나 수치보다 의사결정 질문, 비교 기준, 한계를 먼저 읽습니다.",
        practices: ["결과 해석 메모 작성", "특이점/실제 리스크 구분", "상대 비교와 절대값 판단 구분"],
        outputs: ["결과 검토 체크리스트", "판단 질문 3개"]
    },
    {
        level: "Level 1",
        title: "모델링 기본기",
        focus: "Geometry, mesh, contact, material, boundary condition이 결과에 미치는 영향을 익힙니다.",
        practices: ["기존 모델 재현", "입력값 민감도 비교", "경계조건 변경 실험"],
        outputs: ["재현 모델", "조건 변경 비교표"]
    },
    {
        level: "Level 2",
        title: "7개 기술영역별 핵심 메커니즘",
        focus: "변형, 박리, 충격, 열유동, 피로, 진동, 기타 영역에서 문제를 설명하는 물리 메커니즘을 익힙니다.",
        practices: ["영역별 대표 BP 읽기", "CoR 보고서 한 건 분해", "관련 실험/평가 조건 확인"],
        outputs: ["기술영역별 요약 노트", "대표 사례 설명"]
    },
    {
        level: "Level 3",
        title: "CoR/VD Request 과제화",
        focus: "요청을 그대로 처리하지 않고 문제 정의, 필요한 데이터, 판단 기준, 산출물로 전환합니다.",
        practices: ["CoR 제안서 작성", "VD Request 결과 정리", "의사결정 시점 확인"],
        outputs: ["과제 제안서", "결과 보고서 초안"]
    },
    {
        level: "Level 4",
        title: "BP와 Tool Manual로 자산화",
        focus: "한 번의 대응이 다음 사람이 학습, 재현, 변형, 활용할 수 있는 구조로 남게 합니다.",
        practices: ["BP 템플릿 작성", "Tool Manual 작성", "Reviewer Comment 반영"],
        outputs: ["등록 가능한 BP", "Tool Manual", "교육 활용 메모"]
    },
    {
        level: "Level 5",
        title: "AI/타 Domain 연계와 확산",
        focus: "기술자산을 검색, 요약, 자동화, 타 Domain 연결, 신규 교육과 연결합니다.",
        practices: ["검색/요약 가이드 적용", "타 Domain 입력값 검증", "교육 과정과 연결"],
        outputs: ["연계 태그 정리", "교육/확산 패키지"]
    }
];

const cultureRecords = [
    {
        id: "leader-letter",
        title: "팀장레터",
        type: "리더십 기록",
        status: "초안",
        summary: "팀의 방향성, 성장 기준, 일하는 방식, 기술자산화의 의미를 주기적으로 남기는 리더십 기록입니다.",
        links: [{ label: "팀장레터 모음", href: "#" }]
    },
    {
        id: "technical-workshop",
        title: "기술자산화 워크샵 결과",
        type: "워크샵 결과",
        status: "검토중",
        summary: "대표 BP 선정, 기술영역 분류, Owner/Reviewer 역할, 후속 액션을 남기는 팀 운영 기록입니다.",
        links: [{ label: "워크샵 결과", href: "#" }, { label: "후속 액션", href: "#" }]
    },
    {
        id: "team-culture-workshop",
        title: "팀 문화 워크샵 결과",
        type: "워크샵 결과",
        status: "초안",
        summary: "정직한 결과 공유, 자유로운 논의, 집단지성, 개인 성장과 팀 성과의 연결을 기록합니다.",
        links: [{ label: "팀 문화 워크샵", href: "#" }]
    },
    {
        id: "operating-principles",
        title: "우리팀 일하는 원칙",
        type: "운영 원칙",
        status: "초안",
        summary: "요청 대응, 리뷰, 자산 등록, 교육 연결에서 반복적으로 적용할 팀 내부 원칙입니다.",
        links: [{ label: "운영 원칙", href: "#" }]
    }
];

const domainById = Object.fromEntries(technologyDomains.map((domain) => [domain.id, domain]));
const libraryTypeOrder = ["방법론", "BP", "VD Request", "CoR", "기술보고서", "노하우", "Tool Manual", "교육자료"];
const workflowStageOptions = contextOptions.filter((context) => context.group === "업무 단계");
const responseTargetOptions = contextOptions.filter((context) => context.group === "대응 대상");
const publicationScopeByValue = Object.fromEntries(publicationScopeOptions.map((scope) => [scope.value, scope]));
const filters = {
    search: "",
    domains: new Set(),
    stages: new Set(),
    targets: new Set(),
    type: "all",
    publicationScope: "working",
    sort: "relevance"
};
const libraryBatchSize = 60;
const libraryContentLabels = {
    context: "요청 맥락",
    primaryQuestion: "판단 질문",
    inputsAndConstraints: "입력·제약",
    approach: "대응 접근",
    result: "결과",
    judgmentScope: "판단 가능 범위",
    limitations: "한계",
    followUp: "후속조치",
    problemAndPurpose: "문제·목적",
    technicalPrinciples: "기술 원리",
    inputsAndPrerequisites: "입력·사전조건",
    standardProcedure: "표준 절차",
    resultsAndCriteria: "결과·판단기준",
    scopeAndLimits: "적용범위·한계",
    validationAndReuse: "검증·재사용",
    businessContext: "사업 맥락",
    simulationResponse: "Simulation 대응",
    businessFeedback: "사업부 피드백",
    businessImpact: "경영성과",
    reproductionConditions: "재현 조건",
    evidence: "근거",
    backgroundAndGap: "기술 Gap",
    objectiveAndSuccessCriteria: "목표·성공기준",
    scopeAndPlan: "범위·계획",
    validationDesign: "검증 설계",
    progressDecisions: "수행 중 판단",
    resultAndJudgment: "결과·판단",
    outputsAndFollowUp: "산출물·후속조치",
    questionAndPurpose: "기술 질문·목적",
    scopeAndConditions: "검토 범위·조건",
    methodAndEvidence: "분석 방법·근거",
    findingsAndConclusion: "발견·결론",
    validConditionsAndDecisions: "유효조건·판단",
    officialSource: "공식 원본",
    symptomAndConditions: "증상·조건",
    causeAndDiagnosis: "원인·진단",
    resolution: "해결 절차",
    effectAndEvidence: "효과·근거",
    risksAndRecovery: "위험·복구",
    versionsAndSources: "버전·출처",
    purposeAndOutput: "작업 목적·결과물",
    prerequisites: "사전 준비",
    procedure: "실행 절차",
    completionCheck: "완료 확인",
    errorsAndWarnings: "오류·주의사항",
    learningObjectives: "학습목표",
    audienceAndPrerequisites: "대상·사전지식",
    outline: "학습 구성",
    activities: "학습활동",
    completionCriteria: "이해 확인",
    sourcesAndVersion: "출처·버전"
};
const previewFieldKeysByType = {
    "VD Request": ["primaryQuestion", "result", "judgmentScope", "limitations"],
    "CoR": ["objectiveAndSuccessCriteria", "progressDecisions", "resultAndJudgment", "outputsAndFollowUp"],
    "BP": ["businessContext", "businessFeedback", "businessImpact", "reproductionConditions"],
    "방법론": ["problemAndPurpose", "resultsAndCriteria", "scopeAndLimits", "validationAndReuse"],
    "기술보고서": ["questionAndPurpose", "findingsAndConclusion", "validConditionsAndDecisions", "limitations"],
    "노하우": ["symptomAndConditions", "resolution", "effectAndEvidence", "risksAndRecovery"],
    "Tool Manual": ["purposeAndOutput", "procedure", "completionCheck", "errorsAndWarnings"],
    "교육자료": ["learningObjectives", "audienceAndPrerequisites", "outline", "completionCriteria"]
};
let selectedItemId = null;
let detailFocusTimer = null;
let visibleLibraryLimit = libraryBatchSize;
let librarySearchTimer = null;
let fullDetailReturnFocus = null;

const landingMethodGrowth = [
    {
        method: "박막 적층 Warpage 예측",
        domain: "01. 변형",
        from: "L2",
        to: "L3",
        contributor: "김OO",
        evidence: "BP 기반으로 물성 민감도와 공정 조건 비교 기준을 정리",
        basis: "박막 적층 구조 변형 예측 BP",
        next: "제품군 교차 검증 데이터가 보강되면 L4 진입 후보"
    },
    {
        method: "Set Drop/Tumble Drop Platform",
        domain: "03. 충격",
        from: "L3",
        to: "L4",
        contributor: "이OO",
        evidence: "VD Request 결과와 평가 피드백을 연결해 취약부 ranking 재현성을 확보",
        basis: "Drop 충격 취약부 CoR 결과 보고서",
        next: "여러 제품군의 feedback loop를 축적하면 L5 후보"
    },
    {
        method: "Modal/실험 Matching",
        domain: "06. 진동",
        from: "L2",
        to: "L3",
        contributor: "박OO",
        evidence: "시험 모드 비교 기준과 경계조건 체크리스트를 Tool Manual로 정리",
        basis: "진동 모드 검토 Tool Manual",
        next: "반복 케이스 확보 후 L4 검증 기준으로 확장"
    }
];

const landingContributions = [
    {
        kind: "신규 등록",
        title: "계면 박리 CoR 과제 제안서",
        contributor: "최OO",
        meta: "CoR 제안서 · 02. 박리",
        relation: "기반 자산: Interface 박리 Risk Ranking",
        date: "2026.07"
    },
    {
        kind: "재사용",
        title: "변형 예측 BP를 신규 CoR 착수 자료로 활용",
        contributor: "정OO",
        meta: "BP → CoR · 01. 변형",
        relation: "관계 유형: 참고 / 확장",
        date: "2026.07"
    },
    {
        kind: "리뷰 완료",
        title: "진동 모드 검토 Tool Manual",
        contributor: "한OO",
        meta: "Tool Manual · 06. 진동",
        relation: "후속 활용: 온보딩 교육자료 후보",
        date: "2026.06"
    },
    {
        kind: "교육자료화",
        title: "열유동-구조 연계 체크리스트 초안",
        contributor: "윤OO",
        meta: "VD Request 결과 · 04. 열유동",
        relation: "관계 유형: 교육자료화",
        date: "2026.06"
    }
];

const landingReusedAssets = [
    {
        title: "박막 적층 구조 변형 예측 BP",
        count: 5,
        owner: "1파트",
        relation: "후속 활용: Warpage L3 판단 기준, 신규 CoR 착수 자료",
        note: "유사 구조 검토와 교육자료에서 반복 참고"
    },
    {
        title: "Drop 충격 취약부 CoR 결과 보고서",
        count: 4,
        owner: "3파트",
        relation: "후속 활용: 충격 방법론 L4 근거, 평가 조건 체크리스트",
        note: "취약부 ranking과 평가 feedback loop 정리에 사용"
    },
    {
        title: "진동 모드 검토 Tool Manual",
        count: 3,
        owner: "1파트",
        relation: "후속 활용: 신규 담당자 온보딩, 리뷰 기준 정리",
        note: "시험 matching 기준과 반복 설정 확인에 사용"
    }
];
function getUniqueValues(key) {
    return [...new Set(libraryItems.map((item) => item[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ko"));
}

function makeOption(label, value) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
}

function setText(id, value) {
    const node = document.getElementById(id);
    if (node) node.textContent = value;
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function flattenLibraryText(value) {
    if (value === null || value === undefined) return "";
    if (Array.isArray(value)) return value.map(flattenLibraryText).join(" ");
    if (typeof value === "object") return Object.values(value).map(flattenLibraryText).join(" ");
    return String(value);
}

function normalizeLibraryText(value) {
    return String(value ?? "")
        .normalize("NFKC")
        .toLocaleLowerCase("ko")
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim();
}

function getDomainLabel(domainId) {
    return domainById[domainId]?.label ?? domainId ?? "공통";
}

function getContextLabel(value) {
    return contextOptions.find((context) => context.value === value)?.value ?? value;
}

function getResponsiblePerson(item) {
    const owner = String(item.owner ?? "").trim();
    if (owner && !(/파트$|팀$/.test(owner) || owner === "공통")) return owner;
    return item.registrant || "담당자 미정";
}

function getTypeStatusLabel(type) {
    if (type === "VD Request" || type === "CoR") return "업무 상태";
    if (type === "방법론" || type === "BP") return "자산 자격";
    return "검토 상태";
}

function getIncomingReuseCount(itemId) {
    return incomingReuseCountById.get(itemId) ?? 0;
}

function getLibrarySearchScore(item, query) {
    const normalizedQuery = normalizeLibraryText(query);
    if (!normalizedQuery) return 0;

    const terms = normalizedQuery.split(/\s+/).filter(Boolean);
    const fields = {
        id: normalizeLibraryText(item.id),
        title: normalizeLibraryText(item.title),
        summary: normalizeLibraryText(item.summary),
        useCase: normalizeLibraryText(item.useCase),
        contexts: normalizeLibraryText(flattenLibraryText(item.contexts)),
        aliases: normalizeLibraryText(flattenLibraryText(item.aliases)),
        tags: normalizeLibraryText(flattenLibraryText(item.tags)),
        content: normalizeLibraryText(flattenLibraryText(item.content)),
        relations: normalizeLibraryText(flattenLibraryText(item.relations))
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

function safeHref(value) {
    const href = String(value ?? "").trim();
    if (href === "#" || href.startsWith("/") || href.startsWith("./") || href.startsWith("../")) return href || "#";
    try {
        const url = new URL(href);
        return ["http:", "https:"].includes(url.protocol) ? href : "#";
    } catch {
        return "#";
    }
}


function renderLandingMetrics() {
    setText("metric-new-assets", landingContributions.filter((item) => item.kind === "신규 등록" || item.kind === "교육자료화").length);
    setText("metric-level-up", landingMethodGrowth.length);
    setText("metric-reused", landingReusedAssets.reduce((sum, item) => sum + item.count, 0));
    setText("metric-reviewed", landingContributions.filter((item) => item.kind === "리뷰 완료").length);
}

function renderLandingMethodGrowth() {
    const wrap = document.getElementById("landing-method-growth");
    if (!wrap) return;
    wrap.innerHTML = landingMethodGrowth.map((item) => `
        <article class="growth-card">
            <header>
                <span class="badge domain">${item.domain}</span>
                <span class="badge ready"><i class="bx bx-user-check"></i>${item.contributor}</span>
            </header>
            <h3>${item.method}</h3>
            <div class="level-transition">
                <span class="level-chip level-${item.from.replace("L", "")}">${item.from}</span>
                <i class="bx bx-right-arrow-alt"></i>
                <span class="level-chip level-${item.to.replace("L", "")}">${item.to}</span>
            </div>
            <p>${item.evidence}</p>
            <div class="relation-line"><span>기반 자산</span><strong>${item.basis}</strong></div>
            <div class="relation-line"><span>다음 성장 포인트</span><strong>${item.next}</strong></div>
        </article>
    `).join("");
}

function renderLandingContributionFeed() {
    const wrap = document.getElementById("landing-contribution-feed");
    if (!wrap) return;
    wrap.innerHTML = landingContributions.map((item) => `
        <article class="feed-item">
            <div>
                <span class="badge review">${item.kind}</span>
                <h3>${item.title}</h3>
                <p>${item.meta}</p>
                <strong>${item.relation}</strong>
            </div>
            <div class="feed-side">
                <span>${item.date}</span>
                <strong>${item.contributor}</strong>
            </div>
        </article>
    `).join("");
}

function renderLandingReusedAssets() {
    const wrap = document.getElementById("landing-reused-assets");
    if (!wrap) return;
    wrap.innerHTML = landingReusedAssets.map((item) => `
        <article class="reuse-card">
            <div class="reuse-count"><strong>${item.count}</strong><span>회 재사용</span></div>
            <div>
                <h3>${item.title}</h3>
                <p>${item.note}</p>
                <div class="relation-line"><span>Owner</span><strong>${item.owner}</strong></div>
                <div class="relation-line"><span>관계</span><strong>${item.relation}</strong></div>
            </div>
        </article>
    `).join("");
}

function renderLanding() {
    renderLandingMetrics();
    renderLandingMethodGrowth();
    renderLandingContributionFeed();
    renderLandingReusedAssets();
}
function renderMetrics() {
    setText("metric-total", libraryItems.length);
    setText("metric-domain", technologyDomains.length);
    setText("metric-linked", libraryItems.filter((item) => item.tags?.includes("AI 연계") || item.tags?.includes("타 Domain 연계")).length);
    setText("metric-stage", techTreeStages.length);
    setText("metric-culture", cultureRecords.length);
}

function alignActiveNavigation() {
    if (!window.matchMedia("(max-width: 720px)").matches) return;
    const nav = document.querySelector(".topnav");
    const active = nav?.querySelector("a.active");
    if (!nav || !active) return;
    window.requestAnimationFrame(() => {
        nav.scrollLeft = active.offsetLeft - ((nav.clientWidth - active.offsetWidth) / 2);
    });
}

function createChip(label, isActive, onClick, count = null) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    const labelNode = document.createElement("span");
    labelNode.textContent = label;
    button.appendChild(labelNode);
    if (count !== null) {
        const countNode = document.createElement("span");
        countNode.className = "filter-count";
        countNode.textContent = count;
        button.appendChild(countNode);
    }
    button.setAttribute("aria-pressed", String(isActive));
    button.addEventListener("click", onClick);
    return button;
}

function initSelect(id, values, allLabel) {
    const select = document.getElementById(id);
    if (!select) return;
    select.innerHTML = "";
    select.appendChild(makeOption(allLabel, "all"));
    values.forEach((value) => select.appendChild(makeOption(value, value)));
}

function initPublicationScopeSelect() {
    const select = document.getElementById("publication-scope-filter");
    if (!select) return;
    select.innerHTML = "";
    publicationScopeOptions.forEach((scope) => select.appendChild(makeOption(scope.label, scope.value)));
    select.value = filters.publicationScope;
}

function toggleSetValue(values, value) {
    if (values.has(value)) values.delete(value);
    else values.add(value);
}

function matchesSelectedContext(item, selectedValues) {
    return selectedValues.size === 0 || item.contexts?.some((context) => selectedValues.has(context));
}

function getFacetBaseItems(excludedAxis) {
    const keyword = filters.search.trim();
    const publicationStatuses = publicationScopeByValue[filters.publicationScope]?.statuses ?? publicationScopeByValue.working.statuses;
    return libraryItems.filter((item) => {
        const score = getLibrarySearchScore(item, keyword);
        return (!keyword || score > 0)
            && (filters.type === "all" || item.type === filters.type)
            && publicationStatuses.includes(item.publicationStatus)
            && (excludedAxis === "domains" || filters.domains.size === 0 || filters.domains.has(item.domain))
            && (excludedAxis === "stages" || matchesSelectedContext(item, filters.stages))
            && (excludedAxis === "targets" || matchesSelectedContext(item, filters.targets));
    });
}

function getFilteredLibraryItems() {
    const keyword = filters.search.trim();
    const publicationStatuses = publicationScopeByValue[filters.publicationScope]?.statuses ?? publicationScopeByValue.working.statuses;
    return libraryItems
        .map((item) => ({ item, score: getLibrarySearchScore(item, keyword) }))
        .filter(({ item, score }) => {
            return (!keyword || score > 0)
                && (filters.domains.size === 0 || filters.domains.has(item.domain))
                && matchesSelectedContext(item, filters.stages)
                && matchesSelectedContext(item, filters.targets)
                && (filters.type === "all" || item.type === filters.type)
                && publicationStatuses.includes(item.publicationStatus);
        })
        .sort((a, b) => {
            if (filters.sort === "owner") {
                return getResponsiblePerson(a.item).localeCompare(getResponsiblePerson(b.item), "ko")
                    || String(b.item.updatedAt).localeCompare(String(a.item.updatedAt));
            }
            if (filters.sort === "updated") return String(b.item.updatedAt).localeCompare(String(a.item.updatedAt));
            if (keyword) return b.score - a.score || String(b.item.updatedAt).localeCompare(String(a.item.updatedAt));
            return String(b.item.updatedAt).localeCompare(String(a.item.updatedAt));
        })
        .map(({ item }) => item);
}

function renderFilterChips() {
    const domainWrap = document.getElementById("domain-chips");
    const stageWrap = document.getElementById("stage-chips");
    const targetWrap = document.getElementById("target-chips");
    if (!domainWrap || !stageWrap || !targetWrap) return;

    const domainBaseItems = getFacetBaseItems("domains");
    const stageBaseItems = getFacetBaseItems("stages");
    const targetBaseItems = getFacetBaseItems("targets");

    domainWrap.innerHTML = "";
    domainWrap.appendChild(createChip("전체", filters.domains.size === 0, () => {
        filters.domains.clear();
        resetLibraryBatch();
        renderLibrary();
    }, domainBaseItems.length));
    technologyDomains.forEach((domain) => {
        const count = domainBaseItems.filter((item) => item.domain === domain.id).length;
        const chip = createChip(domain.label, filters.domains.has(domain.id), () => {
            toggleSetValue(filters.domains, domain.id);
            resetLibraryBatch();
            renderLibrary();
        }, count);
        chip.disabled = count === 0 && !filters.domains.has(domain.id);
        domainWrap.appendChild(chip);
    });

    [
        { wrap: stageWrap, values: filters.stages, options: workflowStageOptions, baseItems: stageBaseItems },
        { wrap: targetWrap, values: filters.targets, options: responseTargetOptions, baseItems: targetBaseItems }
    ].forEach(({ wrap, values, options, baseItems }) => {
        wrap.innerHTML = "";
        wrap.appendChild(createChip("전체", values.size === 0, () => {
            values.clear();
            resetLibraryBatch();
            renderLibrary();
        }, baseItems.length));
        options.forEach((context) => {
            const count = baseItems.filter((item) => item.contexts?.includes(context.value)).length;
            const chip = createChip(context.value, values.has(context.value), () => {
                toggleSetValue(values, context.value);
                resetLibraryBatch();
                renderLibrary();
            }, count);
            chip.title = `${context.group}: ${context.description}${count ? "" : " (현재 조건의 카드 없음)"}`;
            chip.disabled = count === 0 && !values.has(context.value);
            wrap.appendChild(chip);
        });
    });
}

function renderLibraryMetrics() {
    setText("library-total-count", libraryItems.length);
    setText("library-published-count", libraryItems.filter((item) => item.publicationStatus === "게시").length);
    setText("library-reused-count", libraryItems.filter((item) => getIncomingReuseCount(item.id) > 0).length);
}

function getLibraryResultContext() {
    const sortLabels = {
        relevance: filters.search.trim() ? `“${filters.search.trim()}” 관련도순` : "최근 수정순",
        updated: "최근 수정순",
        owner: "담당자순"
    };
    const activeFilters = [];
    if (filters.type !== "all") activeFilters.push(filters.type);
    activeFilters.push(publicationScopeByValue[filters.publicationScope]?.label ?? "전체 작업 자료");
    if (filters.domains.size) activeFilters.push([...filters.domains].map(getDomainLabel).join(", "));
    if (filters.stages.size) activeFilters.push([...filters.stages].join(", "));
    if (filters.targets.size) activeFilters.push([...filters.targets].join(", "));
    return [sortLabels[filters.sort] ?? "최근 수정순", ...activeFilters].join(" · ");
}

function formatDisplayDate(value) {
    return String(value || "-").replaceAll("-", ".");
}

function resetLibraryBatch() {
    visibleLibraryLimit = libraryBatchSize;
    selectedItemId = null;
}

function renderLibrary() {
    renderFilterChips();
    const list = document.getElementById("asset-list");
    if (!list) return;

    const items = getFilteredLibraryItems();
    setText("result-count", items.length);
    setText("result-context", getLibraryResultContext());
    list.innerHTML = "";

    if (!items.length) {
        selectedItemId = null;
        list.innerHTML = `<div class="empty-state"><i class="bx bx-search-alt"></i><strong>조건에 맞는 자료가 없습니다.</strong><p>검색어를 바꾸거나 선택한 필터를 줄여보세요.</p></div>`;
        renderDetail(null);
        closeDetailDrawer(false);
        return;
    }

    if (!selectedItemId || !items.some((item) => item.id === selectedItemId)) {
        selectedItemId = items[0].id;
    }

    const selectedIndex = items.findIndex((item) => item.id === selectedItemId);
    const firstBatch = items.slice(0, visibleLibraryLimit);
    const visibleItems = selectedIndex >= visibleLibraryLimit
        ? [items[selectedIndex], ...firstBatch]
        : firstBatch;

    visibleItems.forEach((item) => {
        const publicationStatus = publicationStatusMeta[item.publicationStatus] ?? publicationStatusMeta["초안"];
        const domainLabel = getDomainLabel(item.domain);
        const reuseCount = getIncomingReuseCount(item.id);
        const card = document.createElement("button");
        card.type = "button";
        card.className = `asset-row${item.id === selectedItemId ? " active" : ""}`;
        card.dataset.itemId = item.id;
        card.setAttribute("aria-pressed", String(item.id === selectedItemId));
        card.setAttribute("aria-controls", "detail-panel");
        card.innerHTML = `
            <div class="asset-row-top">
                <div class="badge-row">
                    <span class="badge domain">${escapeHtml(domainLabel)}</span>
                    <span class="badge">${escapeHtml(item.type)}</span>
                    ${item.demo ? '<span class="badge draft">샘플</span>' : ""}
                </div>
                <span class="badge ${publicationStatus.className}"><i class="${publicationStatus.icon}"></i>${escapeHtml(item.publicationStatus)}</span>
            </div>
            <div class="asset-row-copy">
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.summary)}</p>
            </div>
            <div class="asset-row-footer">
                <div class="asset-row-meta">
                    <span><i class="bx bx-user"></i>${escapeHtml(getResponsiblePerson(item))}</span>
                    <span><i class="bx bx-calendar"></i>${escapeHtml(formatDisplayDate(item.updatedAt))}</span>
                </div>
                <span class="reuse-indicator${reuseCount ? " reused" : ""}"><i class="bx bx-revision"></i>재사용 ${reuseCount}회</span>
            </div>
        `;
        card.addEventListener("click", () => selectItem(item.id, true));
        list.appendChild(card);
    });

    const renderedBatchCount = Math.min(visibleLibraryLimit, items.length);
    if (renderedBatchCount < items.length) {
        const remaining = items.length - renderedBatchCount;
        const loadMore = document.createElement("button");
        loadMore.type = "button";
        loadMore.className = "load-more";
        loadMore.innerHTML = `<i class="bx bx-chevron-down"></i><span>${escapeHtml(Math.min(libraryBatchSize, remaining))}개 더 보기</span><small>남은 ${escapeHtml(remaining)}개</small>`;
        loadMore.addEventListener("click", () => {
            visibleLibraryLimit += libraryBatchSize;
            renderLibrary();
        });
        list.appendChild(loadMore);
    }

    renderDetail(libraryItems.find((item) => item.id === selectedItemId));
}

function isCompactLibraryView() {
    return window.matchMedia("(max-width: 900px)").matches;
}

function openDetailDrawer() {
    if (!isCompactLibraryView()) return;
    const panel = document.getElementById("detail-panel");
    panel?.setAttribute("role", "dialog");
    panel?.setAttribute("aria-modal", "true");
    document.body.classList.add("detail-open");
    window.clearTimeout(detailFocusTimer);
    detailFocusTimer = window.setTimeout(() => document.getElementById("close-detail")?.focus({ preventScroll: true }), 220);
}

function closeDetailDrawer(restoreFocus = true) {
    window.clearTimeout(detailFocusTimer);
    detailFocusTimer = null;
    const panel = document.getElementById("detail-panel");
    panel?.removeAttribute("role");
    panel?.removeAttribute("aria-modal");
    document.body.classList.remove("detail-open");
    if (restoreFocus) {
        document.querySelector('.asset-row[aria-pressed="true"]')?.focus({ preventScroll: true });
    }
}

function setMobileFiltersOpen(isOpen) {
    document.body.classList.toggle("mobile-filters-open", isOpen);
    const toggle = document.getElementById("toggle-mobile-filters");
    if (!toggle) return;
    toggle.setAttribute("aria-expanded", String(isOpen));
    const label = toggle.querySelector("span");
    if (label) label.textContent = isOpen ? "필터 닫기" : "필터 열기";
}

function resetLibraryFilters() {
    window.clearTimeout(librarySearchTimer);
    librarySearchTimer = null;
    filters.search = "";
    filters.domains.clear();
    filters.stages.clear();
    filters.targets.clear();
    filters.type = "all";
    filters.publicationScope = "working";
    filters.sort = "relevance";
    resetLibraryBatch();
    const searchInput = document.getElementById("search-input");
    if (searchInput) searchInput.value = "";
    const typeSelect = document.getElementById("type-filter");
    if (typeSelect) typeSelect.value = "all";
    const scopeSelect = document.getElementById("publication-scope-filter");
    if (scopeSelect) scopeSelect.value = "working";
    const sortSelect = document.getElementById("sort-filter");
    if (sortSelect) sortSelect.value = "relevance";
    setMobileFiltersOpen(false);
}

function selectRelatedItem(itemId, shouldOpenPreview = true) {
    resetLibraryFilters();
    selectedItemId = itemId;
    renderLibrary();
    if (shouldOpenPreview) openDetailDrawer();
}

function selectItem(itemId, shouldOpenDetail = false) {
    selectedItemId = itemId;
    renderLibrary();
    if (shouldOpenDetail) openDetailDrawer();
}

function getLibraryContentEntries(item) {
    return Object.entries(item.content ?? {})
        .map(([key, value]) => {
            const text = Array.isArray(value) ? value.join(" · ") : flattenLibraryText(value);
            return { key, label: libraryContentLabels[key] ?? key, text: text.trim() };
        })
        .filter((entry) => entry.text);
}

function getPreviewContentEntries(item) {
    const entries = getLibraryContentEntries(item);
    const byKey = new Map(entries.map((entry) => [entry.key, entry]));
    const preferred = (previewFieldKeysByType[item.type] ?? [])
        .map((key) => byKey.get(key))
        .filter(Boolean);
    const remaining = entries.filter((entry) => !preferred.some((candidate) => candidate.key === entry.key));
    return [...preferred, ...remaining].slice(0, 4);
}

function renderDetailFields(entries) {
    return entries.map((entry) => `
        <div class="detail-field">
            <dt>${escapeHtml(entry.label)}</dt>
            <dd>${escapeHtml(entry.text)}</dd>
        </div>
    `).join("");
}

function renderDetail(item) {
    const panel = document.getElementById("detail-panel");
    if (!panel) return;
    if (!item) {
        panel.dataset.previewItemId = "";
        panel.innerHTML = `
            <button class="icon-button detail-close" type="button" id="close-detail" aria-label="미리보기 닫기" title="미리보기 닫기"><i class="bx bx-x"></i></button>
            <div class="detail-empty"><strong>자료를 선택하세요.</strong><p>검색 결과를 선택하면 활용 상황과 핵심 판단 정보를 미리 볼 수 있습니다.</p></div>
        `;
        return;
    }

    const publicationStatus = publicationStatusMeta[item.publicationStatus] ?? publicationStatusMeta["초안"];
    const domainLabel = getDomainLabel(item.domain);
    const sourceIds = item.sourceIds ?? [];
    const previewEntries = getPreviewContentEntries(item);
    const contexts = item.contexts ?? [];
    const reuseCount = getIncomingReuseCount(item.id);
    const relatedIds = [...new Set([
        ...(item.relations ?? []).map((relation) => relation.targetId),
        ...(item.searchReuse?.foundAssetIds ?? [])
    ])];
    const relatedTitles = relatedIds
        .map((id) => libraryItems.find((candidate) => candidate.id === id)?.title ?? id)
        .slice(0, 3);
    const remainingRelations = Math.max(0, relatedIds.length - relatedTitles.length);
    panel.dataset.previewItemId = item.id;
    panel.innerHTML = `
        <button class="icon-button detail-close" type="button" id="close-detail" aria-label="미리보기 닫기" title="미리보기 닫기"><i class="bx bx-x"></i></button>
        <div class="preview-card-content">
            <header class="preview-header">
                <div class="badge-row">
                    <span class="badge domain">${escapeHtml(domainLabel)}</span>
                    <span class="badge">${escapeHtml(item.type)}</span>
                    <span class="badge ${publicationStatus.className}"><i class="${publicationStatus.icon}"></i>${escapeHtml(item.publicationStatus)}</span>
                    ${item.demo ? '<span class="badge draft">샘플</span>' : ""}
                </div>
                <h2>${escapeHtml(item.title)}</h2>
                <p>${escapeHtml(item.summary)}</p>
                <div class="detail-meta">
                    <span><i class="bx bx-user"></i>${escapeHtml(getResponsiblePerson(item))}</span>
                    <span><i class="bx bx-calendar"></i>${escapeHtml(formatDisplayDate(item.updatedAt))}</span>
                    <span><i class="bx bx-info-circle"></i>${escapeHtml(getTypeStatusLabel(item.type))}: ${escapeHtml(item.status)}</span>
                    <span><i class="bx bx-file"></i>${escapeHtml(sourceIds.join(", ") || "원천 ID 없음")}</span>
                    <span class="reuse-indicator${reuseCount ? " reused" : ""}"><i class="bx bx-revision"></i>재사용 ${reuseCount}회</span>
                </div>
            </header>

            <section class="preview-section">
                <h3>활용 상황</h3>
                <p class="preview-callout">${escapeHtml(item.useCase || item.contents || "활용 상황이 아직 정리되지 않았습니다.")}</p>
            </section>

            <section class="preview-section">
                <h3>핵심 판단 정보</h3>
                <dl class="preview-definition-list">
                    ${renderDetailFields(previewEntries) || `<div class="detail-field"><dt>포함 내용</dt><dd>${escapeHtml(item.contents || "내용 보완 필요")}</dd></div>`}
                </dl>
            </section>

            ${(contexts.length || relatedTitles.length) ? `
                <section class="preview-section preview-signals">
                    ${contexts.length ? `<div><span>활용 맥락</span><div class="badge-row">${contexts.slice(0, 5).map((context) => `<span class="badge">${escapeHtml(getContextLabel(context))}</span>`).join("")}</div></div>` : ""}
                    ${relatedTitles.length ? `<div><span>연결 자산</span><p>${escapeHtml(relatedTitles.join(" · "))}${remainingRelations ? ` 외 ${remainingRelations}개` : ""}</p></div>` : ""}
                </section>
            ` : ""}

            <button class="preview-open-button" type="button" data-open-full="${escapeHtml(item.id)}">
                <span><i class="bx bx-expand-alt"></i>전체 내용 보기</span>
                <i class="bx bx-chevron-right"></i>
            </button>
        </div>
    `;
}

function renderFullDetail(item) {
    const content = document.getElementById("full-detail-content");
    if (!content || !item) return;

    const publicationStatus = publicationStatusMeta[item.publicationStatus] ?? publicationStatusMeta["초안"];
    const domainLabel = getDomainLabel(item.domain);
    const contexts = item.contexts ?? [];
    const links = item.links ?? [];
    const sourceIds = item.sourceIds ?? [];
    const relations = item.relations ?? [];
    const changeLog = item.changeLog ?? [];
    const contentRows = renderDetailFields(getLibraryContentEntries(item));
    const reuseCount = getIncomingReuseCount(item.id);
    const reuseText = item.searchReuse?.performed
        ? `${item.searchReuse.usageType || "검색 완료"}${item.searchReuse.outcome ? ` · ${item.searchReuse.outcome}` : ""}`
        : "검색 기록 없음";
    const relationRows = relations.map((relation) => {
        const target = libraryItems.find((candidate) => candidate.id === relation.targetId);
        const rowContent = `<span>${escapeHtml(relation.type)}</span><strong>${escapeHtml(target?.title ?? relation.targetId)}</strong>${relation.note ? `<small>${escapeHtml(relation.note)}</small>` : ""}`;
        return target
            ? `<button class="relation-item" type="button" data-related-id="${escapeHtml(target.id)}">${rowContent}<i class="bx bx-chevron-right"></i></button>`
            : `<div class="relation-item">${rowContent}</div>`;
    }).join("");
    const reuseAssetRows = (item.searchReuse?.foundAssetIds ?? []).map((assetId) => {
        const target = libraryItems.find((candidate) => candidate.id === assetId);
        if (!target) return `<span class="reuse-reference">${escapeHtml(assetId)}</span>`;
        return `<button class="reuse-reference" type="button" data-related-id="${escapeHtml(target.id)}"><i class="bx bx-link"></i>${escapeHtml(target.title)}</button>`;
    }).join("");
    const changeLogRows = changeLog.slice().reverse().map((entry) => `
        <li>
            <span>${escapeHtml(formatDisplayDate(entry.changedAt))} · ${escapeHtml(entry.changedBy || "수정자 미상")}</span>
            <strong>${escapeHtml(entry.changeType || "수정")}</strong>
            ${entry.reason ? `<p>${escapeHtml(entry.reason)}</p>` : ""}
        </li>
    `).join("");
    const linkRows = links.map((link) => {
        const href = safeHref(link.href);
        const disabled = href === "#";
        return `<a class="btn btn-secondary${disabled ? " is-disabled" : ""}" href="${escapeHtml(href)}"${disabled ? ' aria-disabled="true" onclick="return false;"' : ' target="_blank" rel="noopener"'}><i class="bx bx-link-external"></i>${escapeHtml(link.label)}</a>`;
    }).join("");

    content.innerHTML = `
        <div class="full-detail-shell">
            <button class="icon-button full-detail-close" type="button" id="close-full-detail" aria-label="전체 내용 닫기" title="전체 내용 닫기"><i class="bx bx-x"></i></button>
            <header class="detail-header full-detail-header">
                <div class="badge-row">
                    <span class="badge domain">${escapeHtml(domainLabel)}</span>
                    <span class="badge">${escapeHtml(item.type)}</span>
                    <span class="badge ${publicationStatus.className}"><i class="${publicationStatus.icon}"></i>${escapeHtml(item.publicationStatus)}</span>
                    ${item.demo ? '<span class="badge draft">샘플</span>' : ""}
                </div>
                <h2 id="full-detail-title">${escapeHtml(item.title)}</h2>
                <p class="detail-summary">${escapeHtml(item.summary)}</p>
                <div class="detail-meta">
                    <span><i class="bx bx-user"></i>${escapeHtml(getResponsiblePerson(item))}</span>
                    <span><i class="bx bx-calendar"></i>${escapeHtml(formatDisplayDate(item.updatedAt))}</span>
                    <span><i class="bx bx-info-circle"></i>${escapeHtml(getTypeStatusLabel(item.type))}: ${escapeHtml(item.status)}</span>
                    <span><i class="bx bx-file"></i>${escapeHtml(sourceIds.join(", ") || "원천 ID 없음")}</span>
                </div>
            </header>

            <div class="full-detail-columns">
                <div class="full-detail-primary">
                    <section class="detail-section">
                        <h3>언제 활용하는가</h3>
                        <p class="detail-callout">${escapeHtml(item.useCase || item.contents || "활용 상황이 아직 정리되지 않았습니다.")}</p>
                    </section>
                    <section class="detail-section">
                        <h3>전체 카드 내용</h3>
                        <dl class="detail-definition-list">
                            ${contentRows || `<div class="detail-field"><dt>포함 내용</dt><dd>${escapeHtml(item.contents || "내용 보완 필요")}</dd></div>`}
                        </dl>
                    </section>
                </div>

                <div class="full-detail-secondary">
                    <section class="detail-section">
                        <h3>검색·재사용 기록</h3>
                        <p class="reuse-summary"><strong>이 카드 재사용 ${reuseCount}회</strong><span>등록 시 기존 자산 활용: ${escapeHtml(reuseText)}</span></p>
                        ${reuseAssetRows ? `<div class="reuse-reference-list">${reuseAssetRows}</div>` : '<p class="section-empty">연결된 선행 자산이 없습니다.</p>'}
                    </section>
                    ${relationRows ? `<section class="detail-section"><h3>연결된 기술자산</h3><div class="relation-list">${relationRows}</div></section>` : ""}
                    <section class="detail-section">
                        <h3>관리 정보</h3>
                        <dl class="detail-metadata-grid">
                            <div><dt>담당자</dt><dd>${escapeHtml(getResponsiblePerson(item))}</dd></div>
                            <div><dt>등록자</dt><dd>${escapeHtml(item.registrant || "-")}</dd></div>
                            <div><dt>등록일</dt><dd>${escapeHtml(formatDisplayDate(item.createdAt))}</dd></div>
                            <div><dt>검토자</dt><dd>${escapeHtml(item.reviewer || "미지정")}</dd></div>
                            <div><dt>게시 상태</dt><dd>${escapeHtml(item.publicationStatus || "-")}</dd></div>
                            <div><dt>${escapeHtml(getTypeStatusLabel(item.type))}</dt><dd>${escapeHtml(item.status || "-")}</dd></div>
                        </dl>
                        ${changeLogRows ? `<ol class="change-log">${changeLogRows}</ol>` : ""}
                    </section>
                    ${contexts.length ? `<section class="detail-section"><h3>활용 맥락</h3><div class="badge-row">${contexts.map((context) => `<span class="badge">${escapeHtml(getContextLabel(context))}</span>`).join("")}</div></section>` : ""}
                    <section class="detail-section detail-source-section">
                        <h3>사내 원본</h3>
                        <div class="detail-actions">${linkRows || '<span class="section-empty">연결된 원본 링크가 없습니다.</span>'}</div>
                    </section>
                </div>
            </div>
        </div>
    `;
}

function openFullDetail(itemId, returnFocusTarget = null) {
    const item = libraryItems.find((candidate) => candidate.id === itemId);
    const dialog = document.getElementById("full-detail-dialog");
    if (!item || !dialog) return;
    fullDetailReturnFocus = returnFocusTarget
        || (isCompactLibraryView() ? document.getElementById("close-detail") : document.querySelector(".preview-open-button"));
    renderFullDetail(item);
    document.body.classList.add("full-detail-open");
    if (!dialog.open) dialog.showModal();
    window.setTimeout(() => document.getElementById("close-full-detail")?.focus({ preventScroll: true }), 0);
}

function closeFullDetail() {
    const dialog = document.getElementById("full-detail-dialog");
    if (dialog?.open) dialog.close();
}

function getSimulationLevel(level) {
    return simulationLevels.find((item) => item.score === Number(level)) ?? simulationLevels[0];
}

function renderLevelSummary() {
    const wrap = document.getElementById("level-summary");
    if (!wrap) return;
    wrap.innerHTML = `
        <table class="level-table">
            <thead>
                <tr>
                    <th>Level</th>
                    <th>정의</th>
                    <th>판단 가능 수준</th>
                    <th>필요 데이터</th>
                    <th>다음 조건</th>
                </tr>
            </thead>
            <tbody>
                ${simulationLevels.map((level) => `
                    <tr>
                        <td><span class="level-chip level-${level.score}">${level.id}</span></td>
                        <td><strong>${level.title}</strong><small>${level.summary}</small></td>
                        <td>${level.decision}</td>
                        <td>${level.data}</td>
                        <td>${level.next}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
}

function renderLevelGraph() {
    const wrap = document.getElementById("level-graph");
    if (!wrap) return;
    wrap.innerHTML = `
        <div class="graph-title">
            <strong>L1에서 L5로 갈 때 달라지는 것</strong>
            <span>데이터와 검증이 보강될수록 활용 가능한 의사결정 범위가 넓어집니다.</span>
        </div>
        <div class="level-ladder">
            ${simulationLevels.map((level) => `
                <article class="level-step-card">
                    <span class="level-chip level-${level.score}">${level.id}</span>
                    <div>
                        <strong>${level.title}</strong>
                        <small>${level.data} / ${level.decision}</small>
                    </div>
                </article>
            `).join("")}
        </div>
        <div class="graph-note">
            <span>L1~L2 Data Gap</span>
            <span>L3 Pivot Point</span>
            <span>L4~L5 Golden Standard</span>
        </div>
    `;
}

function renderMap() {
    renderLevelSummary();
    renderLevelGraph();

    const wrap = document.getElementById("method-heatmap");
    if (!wrap) return;
    wrap.innerHTML = "";

    const rows = methodologyGroups.flatMap((group) => [
        `<tr class="domain-row"><th colspan="8"><strong>${group.label}</strong><span>${group.description}</span></th></tr>`,
        ...group.methods.map((method) => {
            const current = getSimulationLevel(method.level);
            const target = getSimulationLevel(method.target);
            return `
                <tr class="method-row" data-method-id="${method.id}" tabindex="0">
                    <td class="domain-name">${group.label}</td>
                    <td class="method-name"><strong>${method.name}</strong><small>${method.evidence}</small></td>
                    ${simulationLevels.map((level) => {
                        const isFilled = level.score <= method.level;
                        const isCurrent = level.score === method.level;
                        const isTarget = level.score === method.target;
                        return `
                            <td>
                                <button class="heat-cell ${isFilled ? `level-${level.score}` : "empty"}${isCurrent ? " current" : ""}${isTarget ? " target" : ""}" type="button" data-method-id="${method.id}" aria-label="${method.name} ${level.id}">
                                    ${isCurrent ? "현재" : isTarget ? "목표" : level.id}
                                </button>
                            </td>
                        `;
                    }).join("")}
                    <td><span class="level-chip level-${current.score}">${current.id}</span> → <span class="level-chip level-${target.score}">${target.id}</span></td>
                </tr>
            `;
        })
    ]).join("");

    wrap.innerHTML = `
        <table class="heatmap-table">
            <thead>
                <tr>
                    <th>대분류</th>
                    <th>세부 Simulation 방법론</th>
                    ${simulationLevels.map((level) => `<th>${level.id}</th>`).join("")}
                    <th>현재→목표</th>
                </tr>
            </thead>
            <tbody>${rows}</tbody>
        </table>
    `;

    wrap.querySelectorAll("[data-method-id]").forEach((node) => {
        const show = () => {
            const methodId = node.getAttribute("data-method-id");
            const group = methodologyGroups.find((item) => item.methods.some((method) => method.id === methodId));
            const method = group?.methods.find((item) => item.id === methodId);
            if (group && method) renderMethodDetail(group, method);
        };
        node.addEventListener("click", show);
        node.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                show();
            }
        });
    });

    renderMethodDetail(methodologyGroups[0], methodologyGroups[0].methods[0]);
}

function renderMethodDetail(group, method) {
    const panel = document.getElementById("method-detail");
    if (!panel) return;
    const current = getSimulationLevel(method.level);
    const target = getSimulationLevel(method.target);
    panel.innerHTML = `
        <div class="badge-row">
            <span class="badge domain">${group.label}</span>
            <span class="level-chip level-${current.score}">현재 ${current.id}</span>
            <span class="level-chip level-${target.score}">목표 ${target.id}</span>
        </div>
        <h2 style="font-size: 1.25rem; line-height: 1.28; margin: 0.85rem 0 0.6rem;">${method.name}</h2>
        <div class="detail-list">
            <div class="detail-item"><span>현재 수준</span><strong>${current.title}: ${method.evidence}</strong></div>
            <div class="detail-item"><span>Data Gap</span><strong>${method.gap}</strong></div>
            <div class="detail-item"><span>다음 액션</span><strong>${method.nextAction}</strong></div>
            <div class="detail-item"><span>목표 조건</span><strong>${target.title}: ${target.next}</strong></div>
        </div>
        <a class="btn btn-secondary" href="team_technical_assets_library.html?domain=${encodeURIComponent(group.id)}"><i class="bx bx-folder-open"></i> 관련 Library 보기</a>
    `;
}

function renderTechTree() {
    const wrap = document.getElementById("tech-tree");
    if (!wrap) return;
    wrap.innerHTML = "";

    techTreeStages.forEach((stage) => {
        const card = document.createElement("article");
        card.className = "tree-stage";
        card.innerHTML = `
            <span>${stage.level}</span>
            <h3>${stage.title}</h3>
            <p>${stage.focus}</p>
            <div class="tree-columns">
                <div>
                    <strong>익힐 활동</strong>
                    <ul>${stage.practices.map((item) => `<li>${item}</li>`).join("")}</ul>
                </div>
                <div>
                    <strong>남길 산출물</strong>
                    <ul>${stage.outputs.map((item) => `<li>${item}</li>`).join("")}</ul>
                </div>
            </div>
        `;
        wrap.appendChild(card);
    });
}

function renderCulture() {
    const wrap = document.getElementById("culture-records");
    if (!wrap) return;
    wrap.innerHTML = "";

    cultureRecords.forEach((record) => {
        const status = statusMeta[record.status] ?? statusMeta["초안"];
        const card = document.createElement("article");
        card.className = "asset-card";
        card.innerHTML = `
            <div class="asset-top">
                <span class="badge">${record.type}</span>
                <span class="badge ${status.className}"><i class="${status.icon}"></i>${record.status}</span>
            </div>
            <h3>${record.title}</h3>
            <p>${record.summary}</p>
            <div class="badge-row" style="margin-top: 0.8rem;">
                ${record.links.map((link) => `<a class="badge" href="${link.href}" onclick="return false;" title="내부 환경에서 실제 링크로 교체">${link.label}</a>`).join("")}
            </div>
        `;
        wrap.appendChild(card);
    });
}

function bindLibraryEvents() {
    const existingTypes = getUniqueValues("type");
    const orderedTypes = [
        ...libraryTypeOrder.filter((type) => existingTypes.includes(type)),
        ...existingTypes.filter((type) => !libraryTypeOrder.includes(type))
    ];
    initSelect("type-filter", orderedTypes, "자료 유형 전체");
    initPublicationScopeSelect();

    const params = new URLSearchParams(window.location.search);
    const domainParam = params.get("domain");
    if (domainParam && domainById[domainParam]) filters.domains.add(domainParam);

    document.getElementById("search-input")?.addEventListener("input", (event) => {
        filters.search = event.target.value;
        window.clearTimeout(librarySearchTimer);
        librarySearchTimer = window.setTimeout(() => {
            resetLibraryBatch();
            renderLibrary();
        }, 120);
    });
    document.getElementById("type-filter")?.addEventListener("change", (event) => {
        filters.type = event.target.value;
        resetLibraryBatch();
        renderLibrary();
    });
    document.getElementById("publication-scope-filter")?.addEventListener("change", (event) => {
        filters.publicationScope = event.target.value;
        resetLibraryBatch();
        renderLibrary();
    });
    document.getElementById("sort-filter")?.addEventListener("change", (event) => {
        filters.sort = event.target.value;
        resetLibraryBatch();
        renderLibrary();
    });
    document.getElementById("reset-filters")?.addEventListener("click", () => {
        resetLibraryFilters();
        renderLibrary();
    });
    document.getElementById("toggle-mobile-filters")?.addEventListener("click", () => {
        setMobileFiltersOpen(!document.body.classList.contains("mobile-filters-open"));
    });

    document.getElementById("detail-panel")?.addEventListener("click", (event) => {
        if (event.target.closest("#close-detail")) {
            closeDetailDrawer();
            return;
        }
        const itemId = event.currentTarget.dataset.previewItemId;
        const explicitTrigger = event.target.closest(".preview-open-button");
        const returnTarget = explicitTrigger
            || (isCompactLibraryView() ? event.currentTarget.querySelector("#close-detail") : event.currentTarget.querySelector(".preview-open-button"));
        if (itemId) openFullDetail(itemId, returnTarget);
    });
    document.getElementById("detail-backdrop")?.addEventListener("click", () => closeDetailDrawer());
    const fullDetailDialog = document.getElementById("full-detail-dialog");
    fullDetailDialog?.addEventListener("click", (event) => {
        if (event.target === fullDetailDialog || event.target.closest("#close-full-detail")) {
            closeFullDetail();
            return;
        }
        const relatedItem = event.target.closest("[data-related-id]");
        if (!relatedItem?.dataset.relatedId) return;
        selectRelatedItem(relatedItem.dataset.relatedId, false);
        const relatedAsset = libraryItems.find((item) => item.id === relatedItem.dataset.relatedId);
        renderFullDetail(relatedAsset);
        fullDetailReturnFocus = isCompactLibraryView()
            ? document.getElementById("close-detail")
            : document.querySelector(".preview-open-button");
        document.getElementById("close-full-detail")?.focus({ preventScroll: true });
    });
    fullDetailDialog?.addEventListener("close", () => {
        document.body.classList.remove("full-detail-open");
        const returnTarget = fullDetailReturnFocus;
        fullDetailReturnFocus = null;
        window.setTimeout(() => returnTarget?.isConnected && returnTarget.focus({ preventScroll: true }), 0);
    });
    document.addEventListener("keydown", (event) => {
        if (fullDetailDialog?.open) {
            if (event.key === "Escape") {
                event.preventDefault();
                closeFullDetail();
            }
            return;
        }
        if (!document.body.classList.contains("detail-open")) return;
        if (event.key === "Escape") {
            closeDetailDrawer();
            return;
        }
        if (event.key !== "Tab") return;
        const panel = document.getElementById("detail-panel");
        if (!panel) return;
        const focusable = [...panel.querySelectorAll('button:not([disabled]), a[href]:not([aria-disabled="true"]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')]
            .filter((node) => node.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
    const compactView = window.matchMedia("(max-width: 900px)");
    compactView.addEventListener?.("change", (event) => {
        if (!event.matches) closeDetailDrawer(false);
    });
}

function initPage() {
    const page = document.body.dataset.page;
    renderMetrics();
    alignActiveNavigation();

    if (page === "landing") {
        renderLanding();
    }

    if (page === "library") {
        renderLibraryMetrics();
        bindLibraryEvents();
        renderLibrary();
    }
    if (page === "map") {
        renderMap();
    }
    if (page === "techtree") {
        renderTechTree();
    }
    if (page === "culture") {
        renderCulture();
    }
}

document.addEventListener("DOMContentLoaded", initPage);
