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

const legacyMethodologySamples = [
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

const methodologyLevelData = window.SIMULATION_METHODOLOGY_LEVELS ?? null;
const methodologyDisplayNameOverrides = {
    "structural-002": "Push Probe on Bend",
    "structural-028": "Package 파괴 Simulation"
};
const methodologyMapState = {
    businessUnitId: "sc",
    selectedCategoryId: null,
    selectedMethodId: null,
    showAllMethods: false
};

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

const learningCareerStages = [
    { id: "years-1-2", label: "1~2년" },
    { id: "years-3-5", label: "3~5년" },
    { id: "years-5-plus", label: "5년 이상" }
];

// Landing의 기존 단계 수 지표와의 호환을 유지합니다.
const techTreeStages = [
    { id: "team-common", label: "팀 공통 기반" },
    ...learningCareerStages
];

const learningChannelMeta = {
    self: { label: "자체학습", icon: "bx bx-book-open", className: "is-self" },
    external: { label: "사외교육", icon: "bx bx-world", className: "is-external" },
    hrd: { label: "HRD/e-learning", icon: "bx bx-laptop", className: "is-hrd" },
    internal: { label: "사내교육", icon: "bx bx-building", className: "is-unknown" },
    ojt: { label: "OJT", icon: "bx bx-user-voice", className: "is-unknown" },
    unknown: { label: "교육 방식 미분류", icon: "bx bx-help-circle", className: "is-unknown" }
};

const learningCommonFoundation = {
    id: "team-common-foundation",
    title: "팀 공통 기반",
    source: "사진 1 · 팀 전체 필요역량",
    items: [
        "재료역학·열역학",
        "구조·열 해석(FEM)",
        "Material Plastic/Hyperelastic",
        "인장·압축 물성 측정",
        "박리 물성 측정 프로세스",
        "Application별 제품 구조 이해",
        "Panel 기술 이해(OLED/LCD)",
        "TFT/CELL 기술 일반",
        "Module Process 이해",
        "Panel Process 이해",
        "Creo/ProE 기본",
        "HyperMesh 기본",
        "Abaqus 기본",
        "FloEFD 기본"
    ]
};

const learningPartTracks = [
    {
        id: "part-1-years-1-2",
        stageId: "years-1-2",
        title: "현 1파트",
        parts: [1],
        source: "사진 3 · 기존 2파트 → 현 1파트",
        items: [
            "HyperMesh 기본", "Defeature", "2D Shell", "3D Tetra", "3D Hexa",
            "Creo/ProE 기본", "Abaqus 기본", "Direct Bonding", "Bending",
            "FloEFD 기본", "ANSYS 열유동", "Abaqus Thermal Stress"
        ]
    },
    {
        id: "parts-2-3-years-1-2",
        stageId: "years-1-2",
        title: "현 2·3파트 공유",
        parts: [2, 3],
        source: "사진 2 · 기존 1파트 → 현 2·3파트",
        items: [
            "Bending", "Thermal Cycle 고온·고습", "Slow Puncture(제품 구조)",
            "Bending + Thermal Cycle", "Sub-modeling", "Ball Impact", "PPOB/POHE",
            "ACF(COP) Bonding", "HyperMesh 2D/3D", "Creo 기본/Origin"
        ]
    },
    {
        id: "parts-4-5-years-1-2",
        stageId: "years-1-2",
        title: "현 4·5파트 공유",
        parts: [4, 5],
        source: "사진 4 · 기존 3파트 → 현 4·5파트",
        items: [
            "ANSYS/Abaqus 자동처짐", "ANSYS/Abaqus Bonding 공정", "Curved/Bendable",
            "FloEFD 기본", "ANSYS 열유동(고온 구동 열변형)",
            "ANSYS/Abaqus 고온·저온 보존 열변형"
        ]
    },
    {
        id: "part-1-years-3-5",
        stageId: "years-3-5",
        title: "현 1파트",
        parts: [1],
        source: "사진 3 · 기존 2파트 → 현 1파트",
        items: [
            "Abaqus Implicit", "Thermal Cycle (Visco)", "Static Analysis", "박리", "진동",
            "Abaqus Explicit", "Ball Impact", "Set Drop", "Abaqus Coupled Thermal Stress",
            "Heat Transfer", "Coupled Thermal Stress", "유동해석"
        ]
    },
    {
        id: "parts-2-3-years-3-5",
        stageId: "years-3-5",
        title: "현 2·3파트 공유",
        parts: [2, 3],
        source: "사진 2 · 기존 1파트 → 현 2·3파트",
        items: [
            "박리/Crack Propagation", "Protect Film 박리 공정", "Fatigue", "고온·고습",
            "온도 분포", "Slow Puncture(GDS)", "Front Face Ball Impact", "Set Drop",
            "Direct Bonding", "Wrinkle", "ACF Flow"
        ]
    },
    {
        id: "parts-4-5-years-3-5",
        stageId: "years-3-5",
        title: "현 4·5파트 공유",
        parts: [4, 5],
        source: "사진 4 · 기존 3파트 → 현 4·5파트",
        items: [
            "LS-Dyna HIT", "RecurDyn 포장 진동", "ANSYS/Abaqus 박리", "통합 열해석",
            "ANSYS 투습 Simulation", "ANSYS 고온·고습 보존 열변형"
        ]
    },
    {
        id: "part-1-years-5-plus",
        stageId: "years-5-plus",
        title: "현 1파트",
        parts: [1],
        source: "사진 3 · 기존 2파트 → 현 1파트",
        items: [
            "Abaqus Advanced", "Fracture", "Fatigue", "Script", "Submodel",
            "Optimization (iSight)", "FloEFD 심화", "Circuit", "Joule Heating"
        ]
    },
    {
        id: "parts-2-3-years-5-plus",
        stageId: "years-5-plus",
        title: "현 2·3파트 공유",
        parts: [2, 3],
        source: "사진 2 · 기존 1파트 → 현 2·3파트",
        items: ["Optimization(iSight)", "Creep", "Script(공통)"]
    },
    {
        id: "parts-4-5-years-5-plus",
        stageId: "years-5-plus",
        title: "현 4·5파트 공유",
        parts: [4, 5],
        source: "사진 4 · 기존 3파트 → 현 4·5파트",
        items: [],
        emptyMessage: "사진 4의 5년 이상 영역은 실제로 비어 있습니다."
    }
];

const learningSharedCapabilities = [
    { title: "Bending", parts: [1, 2, 3] },
    { title: "Direct Bonding", parts: [1, 2, 3] },
    { title: "Ball Impact 계열", parts: [1, 2, 3] },
    { title: "Set Drop", parts: [1, 2, 3] },
    { title: "Thermal Cycle", parts: [1, 2, 3] },
    { title: "박리 계열", parts: [1, 2, 3, 4, 5] },
    { title: "Bonding 계열", parts: [1, 2, 3, 4, 5] },
    { title: "FloEFD 기본·열유동", parts: [1, 4, 5] },
    { title: "Fatigue", parts: [1, 2, 3] },
    { title: "Script", parts: [1, 2, 3] },
    { title: "Optimization(iSight)", parts: [1, 2, 3] },
    { title: "Submodel", parts: [1, 2, 3] }
];

const learningEducationGroups = [
    {
        id: "self",
        status: "확정",
        source: "사진 2 · 자체학습 구획",
        items: ["인장·압축", "비선형 재료", "재료역학·열역학", "구조·열 해석(FEM)"],
        note: "사진 2에서 자체학습 구획으로 확인했습니다."
    },
    {
        id: "external",
        status: "확정",
        source: "사진 2 · 사외교육 구획",
        items: [
            "HyperMesh 기본", "Contact/Convergence", "Intro to Abaqus", "Rubber and Viscoelastic",
            "Heat and Thermal Stress", "Explicit Advanced", "Intro to FE-Safe", "iSight 기본",
            "박리 물성 측정 프로세스"
        ],
        note: "사진 2에서 사외교육 구획으로 확인했습니다."
    },
    {
        id: "hrd",
        status: "구획 확정 · 표기 확인 필요",
        source: "사진 2 · HRD교육(e-learning) 구획",
        items: [
            "OLED A-cube Panel / IT Panel_차이나는 클래스2",
            "OLED A-CUBE 기구",
            "OLED A-cube 소자공정",
            "계열사 DX 우수사례"
        ],
        note: "과정명은 사진에서 판독한 값이며 대소문자와 구두점은 원본 확인이 필요합니다."
    },
    {
        id: "internal",
        status: "확인 필요",
        source: "사진 1~4",
        items: [],
        note: "원자료에 사내교육이라는 별도 구획이 확인되지 않았습니다. 과정 매핑이 필요합니다."
    },
    {
        id: "ojt",
        status: "확인 필요",
        source: "사진 1~4",
        items: [],
        note: "원자료에 OJT 과정 또는 완료 기준이 표시되지 않았습니다."
    },
    {
        id: "unknown",
        status: "미분류",
        source: "사진 3·4",
        items: ["사진 3 · 현 1파트 역량", "사진 4 · 현 4·5파트 역량"],
        note: "사진 3과 사진 4에는 교육 채널 구분이 없습니다."
    }
];

const learningUncertaintyGroups = [
    {
        title: "사진 1 · 팀 전체",
        items: [
            "사외교육 괄호 안 플랫폼명",
            "HyperMesh/Abaqus 앞뒤의 작은 녹색 부기",
            "작은 분류명과 빨강·파랑 약어",
            "Crack Propagation 인접 짧은 항목",
            "ACF Flow 옆 ELB 약어의 정확한 의미",
            "Curved/Bendable 뒤 패널돔으로 보이는 정확한 명칭",
            "열 영역의 열경화로 보이는 항목 정확 표기",
            "최하단 제품·공정 범위의 전체 문구",
            "DTube/DType로 보이는 문구",
            "일부 교육 구획의 정확한 경계",
            "화면상 경력 구간 표기와 사용자 확인값이 충돌해, 구현은 사용자 Ground Truth인 1~2년/3~5년/5년 이상을 우선 적용"
        ]
    },
    {
        title: "사진 2 · 기존 1파트 → 현 2·3파트",
        items: [
            "PseudoHyperelastic로 보이는 정확한 표기",
            "A-cube 과정명의 대소문자와 구두점",
            "원형 담당자 배지의 인명·역할",
            "유동 전공자만 해당 주석의 정확한 적용 범위",
            "5년 이상 열 영역의 열경화로 보이는 항목 정확 표기",
            "HRD/e-learning을 사내교육으로 볼 근거는 원자료에서 확인되지 않음"
        ]
    },
    {
        title: "사진 3 · 기존 2파트 → 현 1파트",
        items: [
            "열 영역 Level 2의 짧은 한글 항목 1개",
            "우측 메모에 항목별 Item 추가와 전파 아이템 선정이 필요하다고 표시되어 원자료 자체가 미완성",
            "교육 방식이 별도로 표시되지 않음"
        ]
    },
    {
        title: "사진 4 · 기존 3파트 → 현 4·5파트",
        items: [
            "상단 주석과 Curved/Bendable 뒤 패널돔으로 보이는 정확한 표기",
            "교육 방식이 별도로 표시되지 않음",
            "5년 이상과 공통 영역은 판독 실패가 아니라 실제 공란"
        ]
    },
    {
        title: "공통 확인사항",
        items: [
            "박스 사이 선이 단순 정렬선인지 선수관계인지 불명확해 세부 항목 간 화살표는 연결하지 않음",
            "현 2·3파트와 현 4·5파트 내부의 개별 담당 구분은 확인되지 않아 현재는 공유 트랙으로 표시"
        ]
    }
];

const learningPathState = {
    selectedPart: "all",
    selectedRequirement: "all",
    selectedChannel: "all"
};

const learningEducationChannelLabels = {
    team: "팀 자체",
    internal: "사내",
    external: "사외"
};

const learningRequirementLabels = {
    required: "필수",
    optional: "선택"
};

const learningRequiredFamilyIds = new Set([
    "core-theory-properties",
    "product-process-understanding"
]);

const learningAllParts = [1, 2, 3, 4, 5];

const learningCapabilityFamilies = [
    {
        id: "core-theory-properties",
        label: "핵심 이론과 물성 이해",
        description: "재료·열역학, FEM, 재료 모델과 물성 측정의 공통 토대",
        nodes: [
            {
                id: "mechanics-thermodynamics",
                label: "재료역학·열역학",
                masterCapabilityId: "core-theory-properties",
                placements: [{ stageId: "years-1-2", parts: learningAllParts, channels: ["team"] }]
            },
            {
                id: "fem-foundation",
                label: "구조·열 해석(FEM)",
                masterCapabilityId: "core-theory-properties",
                placements: [{ stageId: "years-1-2", parts: learningAllParts, channels: ["team"] }]
            },
            {
                id: "nonlinear-material-foundation",
                label: "비선형 재료 모델 (Plastic·Hyperelastic·Rubber·Viscoelastic)",
                masterCapabilityId: "core-theory-properties",
                placements: [{ stageId: "years-1-2", parts: learningAllParts, channels: ["team", "external"] }]
            },
            {
                id: "tension-compression-properties",
                label: "인장·압축 물성 이해·측정",
                masterCapabilityId: "core-theory-properties",
                placements: [{ stageId: "years-1-2", parts: learningAllParts, channels: ["team"] }]
            }
        ]
    },
    {
        id: "product-process-understanding",
        label: "자사 제품 및 공정 이해",
        description: "Panel·TFT/CELL·Module과 자사 제품·공정 구조 이해",
        nodes: [
            {
                id: "application-product-structure",
                label: "Application별 제품 구조 이해",
                masterCapabilityId: "product-process-understanding",
                placements: [{ stageId: "years-1-2", parts: learningAllParts, channels: ["team"] }]
            },
            {
                id: "panel-technology-foundation",
                label: "Panel 기술 이해(OLED/LCD)",
                masterCapabilityId: "product-process-understanding",
                placements: [{ stageId: "years-1-2", parts: learningAllParts, channels: ["team"] }]
            },
            {
                id: "tft-cell-foundation",
                label: "TFT/CELL 기술 일반",
                masterCapabilityId: "product-process-understanding",
                placements: [{ stageId: "years-1-2", parts: learningAllParts, channels: ["team"] }]
            },
            {
                id: "module-process-foundation",
                label: "Module Process 이해",
                masterCapabilityId: "product-process-understanding",
                placements: [{ stageId: "years-1-2", parts: learningAllParts, channels: ["team"] }]
            },
            {
                id: "panel-process-foundation",
                label: "Panel Process 이해",
                masterCapabilityId: "product-process-understanding",
                placements: [{ stageId: "years-1-2", parts: learningAllParts, channels: ["team"] }]
            },
            {
                id: "oled-panel-it-class",
                label: "OLED A-cube Panel / IT Panel 차이나는 클래스 2",
                masterCapabilityId: "product-process-understanding",
                placements: [{ stageId: "years-1-2", parts: learningAllParts, channels: ["internal"] }]
            },
            {
                id: "oled-acube-mechanism",
                label: "OLED A-CUBE 기구",
                masterCapabilityId: "product-process-understanding",
                placements: [{ stageId: "years-1-2", parts: learningAllParts, channels: ["internal"] }]
            },
            {
                id: "oled-acube-device-process",
                label: "OLED A-cube 소자공정",
                masterCapabilityId: "product-process-understanding",
                placements: [{ stageId: "years-3-5", parts: learningAllParts, channels: ["internal"] }]
            },
            {
                id: "affiliate-dx-case",
                label: "계열사 DX 우수사례",
                masterCapabilityId: "product-process-understanding",
                placements: [{ stageId: "years-5-plus", parts: learningAllParts, channels: ["internal"] }]
            }
        ]
    },
    {
        id: "analysis-modeling",
        label: "해석 기반·모델링",
        description: "Geometry·Mesh·Solver 기반과 해석 모델 고도화",
        nodes: [
            {
                id: "hypermesh-basic-p1",
                label: "HyperMesh 기본",
                masterCapabilityId: "analysis-modeling",
                placements: [{ stageId: "years-1-2", parts: learningAllParts, channels: ["team", "external"] }]
            },
            {
                id: "mesh-elements-p1",
                label: "Defeature · 2D Shell · 3D Tetra · 3D Hexa",
                masterCapabilityId: "analysis-modeling",
                placements: [{ stageId: "years-1-2", parts: [1], source: "사진 3 · 현 1파트" }]
            },
            {
                id: "creo-proe-p1",
                label: "Creo/ProE 기본",
                masterCapabilityId: "analysis-modeling",
                placements: [{ stageId: "years-1-2", parts: learningAllParts, channels: ["team", "external"] }]
            },
            {
                id: "abaqus-basic-p1",
                label: "Abaqus 기본",
                masterCapabilityId: "analysis-modeling",
                placements: [{ stageId: "years-1-2", parts: learningAllParts, channels: ["team", "external"] }]
            },
            {
                id: "ansys-basic",
                label: "ANSYS 기본",
                masterCapabilityId: "analysis-modeling",
                placements: [{ stageId: "years-1-2", parts: learningAllParts, channels: ["team", "external"] }]
            },
            {
                id: "ls-dyna-basic",
                label: "LS-Dyna 기본",
                masterCapabilityId: "analysis-modeling",
                placements: [{ stageId: "years-1-2", parts: learningAllParts, channels: ["team", "external"] }]
            },
            {
                id: "contact-convergence",
                label: "Contact/Convergence",
                masterCapabilityId: "analysis-modeling",
                placements: [{ stageId: "years-1-2", parts: learningAllParts, channels: ["external"] }]
            },
            {
                id: "hypermesh-2d-3d-p23",
                label: "HyperMesh 2D/3D",
                masterCapabilityId: "analysis-modeling",
                placements: [{ stageId: "years-1-2", parts: [2, 3], source: "사진 2 · 현 2·3파트" }]
            },
            {
                id: "creo-origin-p23",
                label: "Creo 기본/Origin",
                masterCapabilityId: "analysis-modeling",
                placements: [{ stageId: "years-1-2", parts: [2, 3], source: "사진 2 · 현 2·3파트" }]
            },
            {
                id: "submodel",
                label: "Sub-modeling / Submodel",
                masterCapabilityId: "analysis-modeling",
                placements: [
                    { stageId: "years-1-2", parts: [2, 3], source: "사진 2 · 현 2·3파트" },
                    { stageId: "years-5-plus", parts: [1], source: "사진 3 · 현 1파트" }
                ]
            },
            {
                id: "abaqus-implicit-static-p1",
                label: "Abaqus Implicit · Static Analysis",
                masterCapabilityId: "analysis-modeling",
                placements: [{ stageId: "years-3-5", parts: [1], source: "사진 3 · 현 1파트" }]
            },
            {
                id: "abaqus-explicit-p1",
                label: "Abaqus Explicit",
                masterCapabilityId: "analysis-modeling",
                placements: [
                    { stageId: "years-1-2", parts: learningAllParts, channels: ["external"], label: "Explicit Advanced" },
                    { stageId: "years-3-5", parts: [1], source: "사진 3 · 현 1파트" }
                ]
            },
            {
                id: "abaqus-advanced-p1",
                label: "Abaqus Advanced",
                masterCapabilityId: "analysis-modeling",
                placements: [{ stageId: "years-5-plus", parts: [1], source: "사진 3 · 현 1파트" }]
            }
        ]
    },
    {
        id: "deformation-bonding",
        label: "변형·Bonding",
        description: "변형 거동, 접합 공정과 형상·계면 문제",
        nodes: [
            {
                id: "bending",
                label: "Bending",
                masterCapabilityId: "deformation-bonding",
                placements: [{ stageId: "years-1-2", parts: [1, 2, 3], source: "사진 2·3" }]
            },
            {
                id: "bending-thermal-cycle",
                label: "Bending + Thermal Cycle",
                masterCapabilityId: "deformation-bonding",
                placements: [{ stageId: "years-1-2", parts: [2, 3], source: "사진 2 · 현 2·3파트" }]
            },
            {
                id: "direct-bonding",
                label: "Direct Bonding",
                masterCapabilityId: "deformation-bonding",
                placements: [
                    { stageId: "years-1-2", parts: [1], source: "사진 3 · 현 1파트" },
                    {
                        stageId: "years-3-5",
                        parts: [2, 3],
                        source: "사진 2 · 현 2·3파트",
                        parentIds: ["ppob-pohe"],
                        relationType: "source-link",
                        relationParts: [2, 3]
                    }
                ]
            },
            {
                id: "acf-bonding",
                label: "ACF(COP) Bonding",
                masterCapabilityId: "deformation-bonding",
                placements: [{ stageId: "years-1-2", parts: [2, 3], source: "사진 2 · 현 2·3파트" }]
            },
            {
                id: "acf-flow",
                label: "ACF Flow",
                masterCapabilityId: "deformation-bonding",
                placements: [{
                    stageId: "years-3-5",
                    parts: [2, 3],
                    source: "사진 2 · 현 2·3파트",
                    parentIds: ["acf-bonding"],
                    relationType: "source-link",
                    relationParts: [2, 3]
                }]
            },
            {
                id: "automatic-deflection-p45",
                label: "ANSYS/Abaqus 자동처짐",
                masterCapabilityId: "deformation-bonding",
                placements: [{ stageId: "years-1-2", parts: [4, 5], source: "사진 4 · 현 4·5파트" }]
            },
            {
                id: "bonding-process-p45",
                label: "ANSYS/Abaqus Bonding 공정",
                masterCapabilityId: "deformation-bonding",
                placements: [{ stageId: "years-1-2", parts: [4, 5], source: "사진 4 · 현 4·5파트" }]
            },
            {
                id: "curved-bendable-p45",
                label: "Curved/Bendable",
                masterCapabilityId: "deformation-bonding",
                placements: [{ stageId: "years-1-2", parts: [4, 5], source: "사진 4 · 현 4·5파트" }]
            },
            {
                id: "wrinkle",
                label: "Wrinkle",
                masterCapabilityId: "deformation-bonding",
                placements: [{
                    stageId: "years-3-5",
                    parts: [2, 3],
                    source: "사진 2 · 현 2·3파트",
                    parentIds: ["direct-bonding"],
                    relationType: "source-link",
                    relationParts: [2, 3]
                }]
            }
        ]
    },
    {
        id: "impact-reliability",
        label: "충격·신뢰성",
        description: "충격·낙하·진동 응답에서 피로·파괴·Creep 신뢰성으로 확장",
        mapCategories: ["충격", "진동", "피로"],
        nodes: [
            {
                id: "slow-puncture-product",
                label: "Slow Puncture(제품 구조)",
                masterCapabilityId: "impact-reliability",
                placements: [{ stageId: "years-1-2", parts: [2, 3], source: "사진 2 · 현 2·3파트" }]
            },
            {
                id: "slow-puncture-gds",
                label: "Slow Puncture(GDS)",
                masterCapabilityId: "impact-reliability",
                placements: [{
                    stageId: "years-3-5",
                    parts: [2, 3],
                    source: "사진 2 · 현 2·3파트",
                    parentIds: ["submodel"],
                    relationType: "source-link",
                    relationParts: [2, 3]
                }]
            },
            {
                id: "ball-impact",
                label: "Ball Impact",
                masterCapabilityId: "impact-reliability",
                placements: [
                    { stageId: "years-1-2", parts: [2, 3], source: "사진 2 · 현 2·3파트" },
                    { stageId: "years-3-5", parts: [1], source: "사진 3 · 현 1파트" }
                ]
            },
            {
                id: "front-face-ball-impact",
                label: "Front Face Ball Impact",
                masterCapabilityId: "impact-reliability",
                placements: [{
                    stageId: "years-3-5",
                    parts: [2, 3],
                    source: "사진 2 · 현 2·3파트",
                    parentIds: ["submodel", "ball-impact"],
                    relationType: "source-link",
                    relationParts: [2, 3]
                }]
            },
            {
                id: "set-drop",
                label: "Set Drop",
                masterCapabilityId: "impact-reliability",
                placements: [{
                    stageId: "years-3-5",
                    parts: [1, 2, 3],
                    source: "사진 2·3",
                    parentIds: ["front-face-ball-impact"],
                    relationType: "source-link",
                    relationParts: [2, 3]
                }]
            },
            {
                id: "ppob-pohe",
                label: "PPOB/POHE",
                masterCapabilityId: "impact-reliability",
                placements: [{ stageId: "years-1-2", parts: [2, 3], source: "사진 2 · 현 2·3파트" }]
            },
            {
                id: "vibration-p1",
                label: "진동",
                masterCapabilityId: "impact-reliability",
                placements: [{ stageId: "years-3-5", parts: [1], source: "사진 3 · 현 1파트" }]
            },
            {
                id: "ls-dyna-hit-p45",
                label: "LS-Dyna HIT",
                masterCapabilityId: "impact-reliability",
                placements: [{ stageId: "years-3-5", parts: [4, 5], source: "사진 4 · 현 4·5파트" }]
            },
            {
                id: "recurdyn-vibration-p45",
                label: "RecurDyn 포장 진동",
                masterCapabilityId: "impact-reliability",
                placements: [{ stageId: "years-3-5", parts: [4, 5], source: "사진 4 · 현 4·5파트" }]
            },
            {
                id: "fatigue",
                label: "Fatigue",
                masterCapabilityId: "impact-reliability",
                placements: [
                    {
                        stageId: "years-3-5",
                        parts: [2, 3],
                        source: "사진 2 · 현 2·3파트",
                        parentIds: ["bending-thermal-cycle"],
                        relationType: "source-link",
                        relationParts: [2, 3]
                    },
                    { stageId: "years-5-plus", parts: [1], source: "사진 3 · 현 1파트" }
                ]
            },
            {
                id: "fe-safe-basic",
                label: "FE-Safe 기본",
                masterCapabilityId: "impact-reliability",
                placements: [{ stageId: "years-3-5", parts: learningAllParts, channels: ["external"] }]
            },
            {
                id: "fracture-p1",
                label: "Fracture",
                masterCapabilityId: "impact-reliability",
                placements: [{ stageId: "years-5-plus", parts: [1], source: "사진 3 · 현 1파트" }]
            },
            {
                id: "creep-p23",
                label: "Creep",
                masterCapabilityId: "impact-reliability",
                placements: [{ stageId: "years-5-plus", parts: [2, 3], source: "사진 2 · 현 2·3파트" }]
            }
        ]
    },
    {
        id: "delamination",
        label: "박리",
        description: "박리·Crack Propagation과 박리 공정의 단계별 확장",
        mapCategories: ["박리"],
        nodes: [
            {
                id: "delamination-properties",
                label: "박리 물성 이해·측정",
                masterCapabilityId: "delamination",
                placements: [{ stageId: "years-3-5", parts: learningAllParts, channels: ["team", "external"] }]
            },
            {
                id: "delamination-p1",
                label: "박리",
                masterCapabilityId: "delamination",
                placements: [{ stageId: "years-3-5", parts: [1], source: "사진 3 · 현 1파트" }]
            },
            {
                id: "delamination-crack-p23",
                label: "박리/Crack Propagation",
                masterCapabilityId: "delamination",
                placements: [{
                    stageId: "years-3-5",
                    parts: [2, 3],
                    source: "사진 2 · 현 2·3파트",
                    parentIds: ["bending-thermal-cycle"],
                    relationType: "source-link",
                    relationParts: [2, 3]
                }]
            },
            {
                id: "protect-film-delamination-p23",
                label: "Protect Film 박리 공정",
                masterCapabilityId: "delamination",
                placements: [{
                    stageId: "years-3-5",
                    parts: [2, 3],
                    source: "사진 2 · 현 2·3파트",
                    parentIds: ["delamination-crack-p23"],
                    relationType: "source-link",
                    relationParts: [2, 3]
                }]
            },
            {
                id: "delamination-p45",
                label: "ANSYS/Abaqus 박리",
                masterCapabilityId: "delamination",
                placements: [{ stageId: "years-3-5", parts: [4, 5], source: "사진 4 · 현 4·5파트" }]
            }
        ]
    },
    {
        id: "thermal-flow",
        label: "열·유동",
        description: "열변형·열응력·유동·투습의 연성 해석",
        nodes: [
            {
                id: "floefd-basic",
                label: "FloEFD 기본",
                masterCapabilityId: "thermal-flow",
                placements: [{ stageId: "years-1-2", parts: learningAllParts, channels: ["team", "external"] }]
            },
            {
                id: "ansys-thermal-flow-p1",
                label: "ANSYS 열유동",
                masterCapabilityId: "thermal-flow",
                placements: [{ stageId: "years-1-2", parts: [1], source: "사진 3 · 현 1파트" }]
            },
            {
                id: "abaqus-thermal-stress-p1",
                label: "Abaqus · Heat and Thermal Stress",
                masterCapabilityId: "thermal-flow",
                placements: [{ stageId: "years-1-2", parts: learningAllParts, channels: ["external"] }]
            },
            {
                id: "thermal-cycle-hh-p23",
                label: "Thermal Cycle 고온·고습",
                masterCapabilityId: "thermal-flow",
                placements: [{ stageId: "years-1-2", parts: [2, 3], source: "사진 2 · 현 2·3파트" }]
            },
            {
                id: "ansys-thermal-flow-p45",
                label: "ANSYS 열유동(고온 구동 열변형)",
                masterCapabilityId: "thermal-flow",
                placements: [{ stageId: "years-1-2", parts: [4, 5], source: "사진 4 · 현 4·5파트" }]
            },
            {
                id: "storage-thermal-deformation-p45",
                label: "ANSYS/Abaqus 고온·저온 보존 열변형",
                masterCapabilityId: "thermal-flow",
                placements: [{ stageId: "years-1-2", parts: [4, 5], source: "사진 4 · 현 4·5파트" }]
            },
            {
                id: "thermal-cycle-visco-p1",
                label: "Thermal Cycle(Visco)",
                masterCapabilityId: "thermal-flow",
                placements: [{ stageId: "years-3-5", parts: [1], source: "사진 3 · 현 1파트" }]
            },
            {
                id: "high-temp-humidity-p23",
                label: "고온·고습",
                masterCapabilityId: "thermal-flow",
                placements: [{
                    stageId: "years-3-5",
                    parts: [2, 3],
                    source: "사진 2 · 현 2·3파트",
                    parentIds: ["submodel"],
                    relationType: "source-link",
                    relationParts: [2, 3]
                }]
            },
            {
                id: "thermal-moisture-properties",
                label: "열·투습 물성 이해·측정",
                masterCapabilityId: "thermal-flow",
                placements: [{ stageId: "years-3-5", parts: learningAllParts, channels: ["team"] }]
            },
            {
                id: "temperature-distribution-p23",
                label: "온도 분포",
                masterCapabilityId: "thermal-flow",
                placements: [{
                    stageId: "years-3-5",
                    parts: [2, 3],
                    source: "사진 2 · 현 2·3파트",
                    parentIds: ["high-temp-humidity-p23"],
                    relationType: "source-link",
                    relationParts: [2, 3]
                }]
            },
            {
                id: "coupled-thermal-p1",
                label: "Abaqus Coupled / Coupled Thermal Stress",
                masterCapabilityId: "thermal-flow",
                placements: [{ stageId: "years-3-5", parts: [1], source: "사진 3 · 현 1파트" }]
            },
            {
                id: "heat-transfer-p1",
                label: "Heat Transfer",
                masterCapabilityId: "thermal-flow",
                placements: [{ stageId: "years-3-5", parts: [1], source: "사진 3 · 현 1파트" }]
            },
            {
                id: "flow-analysis-p1",
                label: "유동해석",
                masterCapabilityId: "thermal-flow",
                placements: [{ stageId: "years-3-5", parts: [1], source: "사진 3 · 현 1파트" }]
            },
            {
                id: "integrated-thermal-p45",
                label: "통합 열해석",
                masterCapabilityId: "thermal-flow",
                placements: [{ stageId: "years-3-5", parts: learningAllParts, channels: ["external"] }]
            },
            {
                id: "moisture-simulation-p45",
                label: "ANSYS 투습 Simulation",
                masterCapabilityId: "thermal-flow",
                placements: [{ stageId: "years-3-5", parts: [4, 5], source: "사진 4 · 현 4·5파트" }]
            },
            {
                id: "hh-storage-deformation-p45",
                label: "ANSYS 고온·고습 보존 열변형",
                masterCapabilityId: "thermal-flow",
                placements: [{ stageId: "years-3-5", parts: [4, 5], source: "사진 4 · 현 4·5파트" }]
            },
            {
                id: "floefd-advanced-p1",
                label: "FloEFD 심화",
                masterCapabilityId: "thermal-flow",
                placements: [
                    { stageId: "years-3-5", parts: learningAllParts, channels: ["external"], label: "FloEFD 심화 교육" },
                    { stageId: "years-5-plus", parts: [1], source: "사진 3 · 현 1파트" }
                ]
            },
            {
                id: "circuit-joule-p1",
                label: "Circuit · Joule Heating",
                masterCapabilityId: "thermal-flow",
                placements: [{ stageId: "years-5-plus", parts: [1], source: "사진 3 · 현 1파트" }]
            }
        ]
    },
    {
        id: "automation-optimization",
        label: "자동화·최적화",
        description: "반복 해석 자동화와 설계 최적화",
        nodes: [
            {
                id: "script",
                label: "Script",
                masterCapabilityId: "automation-optimization",
                placements: [{ stageId: "years-5-plus", parts: [1, 2, 3], source: "사진 2·3" }]
            },
            {
                id: "optimization-isight",
                label: "Optimization(iSight)",
                masterCapabilityId: "automation-optimization",
                placements: [
                    { stageId: "years-3-5", parts: learningAllParts, channels: ["external"], label: "iSight 기본" },
                    { stageId: "years-5-plus", parts: [1, 2, 3], source: "사진 2·3" }
                ]
            }
        ]
    }
];

const learningCapabilityById = Object.fromEntries(
    learningCapabilityFamilies.flatMap((family) => family.nodes.map((node) => [node.id, node]))
);
const learningCapabilityDetails = window.LEARNING_CAPABILITY_DETAILS ?? {};
const learningFamilyByCapabilityId = new Map(
    learningCapabilityFamilies.flatMap((family) => family.nodes.map((node) => [node.id, family]))
);

window.TECHNICAL_ASSET_FRAMEWORKS = {
    decisionOptions: [
        { id: "linked", label: "연결됨" },
        { id: "not_applicable", label: "해당 없음" },
        { id: "target_missing", label: "대상 없음" }
    ],
    technologyMap: {
        methodologies: (methodologyLevelData?.methodologies ?? []).map((methodology) => ({
            id: methodology.id,
            label: methodologyDisplayNameOverrides[methodology.id] ?? methodology.name,
            categoryId: methodology.categoryId,
            categoryLabel: methodology.categoryLabel
        }))
    },
    learningPath: {
        stages: learningCareerStages.map((stage) => ({ ...stage })),
        families: learningCapabilityFamilies.map((family) => ({
            id: family.id,
            label: family.label,
            capabilities: family.nodes.map((node) => ({ id: node.id, label: node.label }))
        }))
    }
};

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
    knowhowCategory: "노하우 범주",
    symptomAndConditions: "적용 상황·목표",
    causeAndDiagnosis: "난점·사전 확인",
    resolution: "실행 절차·판단",
    effectAndEvidence: "품질·효과·근거",
    risksAndRecovery: "예외·위험·대응",
    versionsAndSources: "재사용·연결 자료",
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
    "노하우": ["knowhowCategory", "symptomAndConditions", "resolution", "effectAndEvidence"],
    "Tool Manual": ["purposeAndOutput", "procedure", "completionCheck", "errorsAndWarnings"],
    "교육자료": ["learningObjectives", "audienceAndPrerequisites", "outline", "completionCriteria"]
};
let selectedItemId = null;
let detailFocusTimer = null;
let visibleLibraryLimit = libraryBatchSize;
let librarySearchTimer = null;
let fullDetailReturnFocus = null;

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



const landingSpotlightFeatures = [
    {
        cardId: "methodology-impact-risk-ranking",
        label: "판단 기준",
        tone: "core",
        reason: "충격 설계안의 취약 위치와 상대 위험을 같은 절차로 비교하는 핵심 방법론입니다.",
        nextAction: "검증 결과와 적용 사례를 한곳에 연결하기"
    },
    {
        cardId: "cor-impact",
        label: "검증 근거",
        tone: "validated",
        reason: "Risk Ranking 방법론의 반복성과 평가 피드백을 확인하는 근거 과제입니다.",
        nextAction: "후속 검증 결과가 생기면 연결해 갱신하기"
    },
    {
        cardId: "methodology-warpage-relative-comparison",
        label: "확산 후보",
        tone: "emerging",
        reason: "변형 과제의 상대 비교 판단을 다른 과제에서도 재현할 수 있게 만드는 후보입니다.",
        nextAction: "실제 적용 근거를 추가로 연결하기"
    }
];

const overviewWorkTypes = new Set(["VD Request", "CoR"]);
const overviewWorkRelationTypes = {
    USES: "직접 재사용",
    ADAPTS: "조건 변경 적용",
    REFERENCES: "참고",
    VALIDATES: "검증 근거",
    EVIDENCE_FOR: "검증 근거"
};
const overviewUsageTypeRank = {
    "참고": 1,
    "직접 재사용": 2,
    "조건 변경 적용": 3,
    "검증 근거": 4
};

function getOverviewDataContext() {
    const available = libraryItems.filter((item) => item.publicationStatus !== "폐기");
    const operational = available.filter((item) => item.demo !== true);
    const demo = available.filter((item) => item.demo === true);
    if (operational.length > 0) {
        return { mode: "operational", items: operational, totalCount: operational.length, demoCount: demo.length };
    }
    return { mode: demo.length > 0 ? "demo" : "empty", items: demo, totalCount: demo.length, demoCount: demo.length };
}

function normalizeOverviewUsageType(value) {
    const text = String(value ?? "").trim();
    if (!text || text === "적합 자산 없음") return "";
    if (text.includes("검증")) return "검증 근거";
    if (text.includes("조건")) return "조건 변경 적용";
    if (text.includes("직접")) return "직접 재사용";
    if (text.includes("참고") || text.includes("보고 근거")) return "참고";
    return text;
}

function getWorkUsageLinks(item, cardsById) {
    const byTargetId = new Map();
    const addLink = (targetId, usageType, outcome, source, actor = "") => {
        if (!targetId || targetId === item.id || !cardsById.has(targetId)) return;
        const normalizedType = normalizeOverviewUsageType(usageType);
        if (!normalizedType) return;
        const next = {
            sourceCardId: item.id,
            targetCardId: targetId,
            usageType: normalizedType,
            outcome: String(outcome ?? "").trim(),
            actor: String(actor ?? "").trim(),
            evidenceSource: source
        };
        const previous = byTargetId.get(targetId);
        const previousRank = overviewUsageTypeRank[previous?.usageType] ?? 0;
        const nextRank = overviewUsageTypeRank[next.usageType] ?? 0;
        if (!previous || nextRank > previousRank) {
            byTargetId.set(targetId, {
                ...next,
                outcome: next.outcome || previous?.outcome || "",
                actor: next.actor || previous?.actor || ""
            });
        } else if (previous) {
            byTargetId.set(targetId, {
                ...previous,
                outcome: previous.outcome || next.outcome,
                actor: previous.actor || next.actor
            });
        }
    };

    const searchReuse = item.searchReuse ?? {};
    const searchUsageType = normalizeOverviewUsageType(searchReuse.usageType);
    if (searchReuse.performed && searchUsageType) {
        (searchReuse.foundAssetIds ?? []).forEach((targetId) => {
            addLink(targetId, searchUsageType, searchReuse.outcome, "searchReuse", searchReuse.searchedBy);
        });
    }

    (item.relations ?? []).forEach((relation) => {
        if (relation.status === "해제" || relation.status === "확인 필요") return;
        const usageType = overviewWorkRelationTypes[relation.type];
        if (usageType) addLink(relation.targetId, usageType, relation.note, "relation", relation.createdBy);
    });

    return [...byTargetId.values()];
}

function buildOverviewModel() {
    const context = getOverviewDataContext();
    const cardsById = new Map(context.items.map((item) => [item.id, item]));
    const workItems = context.items.filter((item) => overviewWorkTypes.has(item.type));
    const completedWorkItems = workItems.filter((item) => item.status === "완료");
    const completedUsageLinks = completedWorkItems.flatMap((item) => getWorkUsageLinks(item, cardsById));
    const allWorkUsageLinks = workItems.flatMap((item) => getWorkUsageLinks(item, cardsById));
    const searchedWorkItems = completedWorkItems.filter((item) => item.searchReuse?.performed === true);
    const utilizedSourceIds = new Set(completedUsageLinks.map((link) => link.sourceCardId));
    const utilizedAssetIds = new Set(completedUsageLinks.map((link) => link.targetCardId));
    const gapWorkItems = completedWorkItems.filter((item) => item.searchReuse?.performed === true
        && (item.searchReuse?.usageType === "적합 자산 없음" || item.searchReuse?.decision === "no-candidate"));

    const spotlights = landingSpotlightFeatures.map((feature) => {
        const card = cardsById.get(feature.cardId);
        if (!card) return null;
        const completedLinks = completedUsageLinks.filter((link) => link.targetCardId === card.id);
        const registeredLinks = allWorkUsageLinks.filter((link) => link.targetCardId === card.id);
        return { ...feature, card, completedLinks, registeredLinks };
    }).filter(Boolean);

    const usageEvents = completedUsageLinks.map((link) => {
        const sourceCard = cardsById.get(link.sourceCardId);
        const targetCard = cardsById.get(link.targetCardId);
        return {
            kind: link.usageType,
            title: targetCard?.title ?? link.targetCardId,
            meta: `${sourceCard?.type ?? "과제"} · ${sourceCard?.title ?? link.sourceCardId}`,
            detail: link.outcome || "활용 관계가 등록되었습니다.",
            actor: link.actor,
            sortDate: sourceCard?.updatedAt ?? ""
        };
    });
    const reviewEvents = completedWorkItems.filter((item) => item.reviewer).map((item) => ({
        kind: "리뷰 기록",
        title: item.title,
        meta: `${item.type} · 검토자 ${item.reviewer}`,
        detail: "완료 과제의 Reviewer와 검토 이력이 명시되었습니다.",
        actor: item.reviewer,
        sortDate: item.updatedAt ?? ""
    }));
    const contributions = [...usageEvents, ...reviewEvents]
        .sort((a, b) => String(b.sortDate).localeCompare(String(a.sortDate), "ko"))
        .slice(0, 5);

    const attentionById = new Map();
    const addAttention = (card, priority, reason, action) => {
        const previous = attentionById.get(card.id);
        if (!previous || priority > previous.priority) attentionById.set(card.id, { card, priority, reason, action });
    };
    context.items.forEach((card) => {
        if (card.status === "보완 필요" || card.publicationStatus === "개정 필요") {
            addAttention(card, 4, "보완 필요 상태", "적용조건과 완료 기준을 10분 안에 보완하기");
        }
        if (card.searchReuse?.usageType === "적합 자산 없음") {
            addAttention(card, 3, "적합 자산 없음", "기술 Gap 후보와 다음 검증 질문을 연결하기");
        }
        if ((incomingReuseCountById.get(card.id) ?? 0) > 0 && !card.reviewer && card.publicationStatus !== "게시") {
            addAttention(card, 2, "활용 관계가 있지만 Reviewer 미지정", "적용범위와 한계를 확인할 Reviewer 지정하기");
        }
    });
    const needsAttention = [...attentionById.values()]
        .sort((a, b) => b.priority - a.priority || String(b.card.updatedAt).localeCompare(String(a.card.updatedAt), "ko"))
        .slice(0, 4);

    return {
        context,
        cardsById,
        completedWorkItems,
        completedUsageLinks,
        searchedWorkItems,
        utilizedSourceIds,
        utilizedAssetIds,
        gapWorkItems,
        spotlights,
        contributions,
        needsAttention
    };
}

const overviewModel = buildOverviewModel();

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

function getMaturityMethodologies() {
    return Array.isArray(methodologyLevelData?.methodologies) ? methodologyLevelData.methodologies : [];
}

function getMethodologyDisplayName(method) {
    return methodologyDisplayNameOverrides[method?.id] ?? String(method?.name ?? "");
}

function getMaturityBusinessUnits() {
    return Array.isArray(methodologyLevelData?.businessUnits) ? methodologyLevelData.businessUnits : [];
}

function getMaturityScore(method, periodId, businessUnitId) {
    const value = method?.scores?.[periodId]?.[businessUnitId];
    return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function formatMaturityScore(value) {
    if (value === null || value === undefined) return "미적용";
    const score = Number(value);
    if (!Number.isFinite(score)) return "미적용";
    return `L${Number.isInteger(score) ? score : score.toFixed(1).replace(/\.0$/, "")}`;
}

function getMaturityBand(value) {
    if (value === null || value === undefined || !Number.isFinite(Number(value))) return null;
    return Math.min(5, Math.max(1, Math.floor(Number(value))));
}

function describeMaturityScore(value) {
    if (value === null || value === undefined) return "미적용";
    const score = Number(value);
    const exact = simulationLevels.find((item) => item.score === score);
    if (exact) return `${exact.id} ${exact.title}`;
    const lower = Math.max(1, Math.floor(score));
    const upper = Math.min(5, Math.ceil(score));
    return `L${lower}과 L${upper} 사이의 중간 성숙도`;
}

function renderMaturityScore(value, extraClass = "") {
    const className = extraClass ? ` ${extraClass}` : "";
    if (value === null || value === undefined) {
        return `<span class="score-token is-na" title="미적용: 점수와 평균 계산에서 제외">미적용</span>`;
    }
    const band = getMaturityBand(value);
    const changeTitle = extraClass.split(/\s+/).includes("has-change") ? " · 현황 대비 목표 변동" : "";
    return `<span class="score-token score-band-${band}${className}" title="${escapeHtml(describeMaturityScore(value))}${changeTitle}">${escapeHtml(formatMaturityScore(value))}</span>`;
}

function getMaturityChange(current, target) {
    if (current === null && target === null) return { kind: "not-applicable", label: "미적용 유지", delta: null };
    if (current === null && target !== null) return { kind: "new", label: "신규 적용", delta: null };
    if (current !== null && target === null) return { kind: "removed", label: "적용 해제", delta: null };
    const delta = Number((target - current).toFixed(1));
    if (delta > 0) return { kind: "level-up", label: `+${delta}`, delta };
    if (delta < 0) return { kind: "lowered", label: `${delta}`, delta };
    return { kind: "stable", label: "유지", delta: 0 };
}

function getMaturityTargetClass(current, target) {
    const change = getMaturityChange(current, target);
    return ["stable", "not-applicable"].includes(change.kind) ? "is-target" : "is-target has-change";
}

function getLandingMethodGrowth() {
    const businessUnits = getMaturityBusinessUnits();
    return getMaturityMethodologies()
        .map((method) => {
            const changes = businessUnits.map((businessUnit) => {
                const current = getMaturityScore(method, "current", businessUnit.id);
                const target = getMaturityScore(method, "target", businessUnit.id);
                return { businessUnit, current, target, change: getMaturityChange(current, target) };
            }).filter((item) => ["new", "level-up"].includes(item.change.kind));
            return { method, changes };
        })
        .filter((item) => item.changes.length > 0)
        .sort((a, b) => {
            const aNew = a.changes.some((item) => item.change.kind === "new") ? 1 : 0;
            const bNew = b.changes.some((item) => item.change.kind === "new") ? 1 : 0;
            return bNew - aNew || a.method.no - b.method.no;
        });
}


function renderLandingMetrics() {
    const total = overviewModel.completedWorkItems.length;
    const formatFraction = (value) => total > 0 ? `${value} / ${total}` : "-";
    setText("metric-search-complete", formatFraction(overviewModel.searchedWorkItems.length));
    setText("metric-utilized-work", formatFraction(overviewModel.utilizedSourceIds.size));
    setText("metric-used-assets", overviewModel.utilizedAssetIds.size || "-");
    setText("metric-gap-count", overviewModel.gapWorkItems.length || "-");

    const dataCard = document.getElementById("overview-data-card");
    const dataNote = document.getElementById("overview-data-note");
    const metricScope = document.getElementById("overview-metric-scope");
    if (overviewModel.context.mode === "demo") {
        dataCard?.classList.add("is-demo");
        if (dataNote) dataNote.textContent = `아래 수치와 사례는 가상 카드 ${overviewModel.context.totalCount}건으로 계산한 화면 예시이며 실제 팀 실적·평가 데이터가 아닙니다.`;
        if (metricScope) metricScope.textContent = `기능시험용 샘플 ${overviewModel.context.totalCount}건 전체`;
    } else if (overviewModel.context.mode === "operational") {
        dataCard?.classList.add("is-operational");
        if (dataNote) dataNote.textContent = `운영 카드 ${overviewModel.context.totalCount}건의 명시적 관계만 집계합니다.`;
        if (metricScope) metricScope.textContent = `운영 데이터 ${overviewModel.context.totalCount}건`;
    } else {
        if (dataNote) dataNote.textContent = "연결된 Library 카드가 없습니다.";
        if (metricScope) metricScope.textContent = "운영 데이터 연결 전";
    }
}

function getOverviewCardUrl(card) {
    return `team_technical_assets_library.html?asset=${encodeURIComponent(card.id)}`;
}

function renderLandingSpotlights() {
    const wrap = document.getElementById("landing-spotlight-assets");
    if (!wrap) return;
    if (!overviewModel.spotlights.length) {
        wrap.innerHTML = `<p class="section-empty">큐레이션된 핵심 자산이 없습니다.</p>`;
        return;
    }
    wrap.innerHTML = overviewModel.spotlights.map((item) => {
        const usageTypes = [...new Set(item.registeredLinks.map((link) => link.usageType))];
        const status = statusMeta[item.card.status] ?? statusMeta[item.card.publicationStatus] ?? statusMeta["초안"];
        return `
            <article class="overview-spotlight-card" data-tone="${escapeHtml(item.tone)}">
                <header>
                    <span class="spotlight-label">${escapeHtml(item.label)}</span>
                    ${item.card.demo ? '<span class="sample-token">샘플 데이터</span>' : ""}
                </header>
                <span class="overview-card-type">${escapeHtml(item.card.type)}</span>
                <h3>${escapeHtml(item.card.title)}</h3>
                <p class="spotlight-reason">${escapeHtml(item.reason)}</p>
                <dl class="spotlight-evidence">
                    <section><dt>완료 과제 활용</dt><dd>${item.completedLinks.length}건</dd></section>
                    <section><dt>등록된 업무 연결</dt><dd>${item.registeredLinks.length}건</dd></section>
                </dl>
                <p class="spotlight-usage-types">${usageTypes.length ? usageTypes.map((type) => `<span>${escapeHtml(type)}</span>`).join("") : "<span>활용 근거 보완 필요</span>"}</p>
                <p class="spotlight-next"><strong>다음 행동</strong>${escapeHtml(item.nextAction)}</p>
                <footer>
                    <span class="status-token ${status.className}"><i class="${status.icon}"></i>${escapeHtml(item.card.status)}</span>
                    <a class="text-link" href="${getOverviewCardUrl(item.card)}">상세 보기 <i class="bx bx-right-arrow-alt"></i></a>
                </footer>
            </article>
        `;
    }).join("");
}

function renderLandingContributionFeed() {
    const wrap = document.getElementById("landing-contribution-feed");
    if (!wrap) return;
    if (!overviewModel.contributions.length) {
        wrap.innerHTML = `<li class="section-empty">표시할 명시적 활용·리뷰 기록이 없습니다.</li>`;
        return;
    }
    wrap.innerHTML = overviewModel.contributions.map((item) => `
        <li class="overview-row contribution-row">
            <span class="row-icon"><i class="bx ${item.kind === "리뷰 기록" ? "bx-check-shield" : "bx-link-alt"}"></i></span>
            <section>
                <span class="row-kicker">${escapeHtml(item.kind)}</span>
                <h3>${escapeHtml(item.title)}</h3>
                <p>${escapeHtml(item.detail)}</p>
                <small>${escapeHtml(item.meta)}${item.actor ? ` · ${escapeHtml(item.actor)}` : ""}</small>
            </section>
        </li>
    `).join("");
}

function renderLandingUsageFlow() {
    const wrap = document.getElementById("landing-usage-flow");
    if (!wrap) return;
    if (!overviewModel.completedUsageLinks.length) {
        wrap.innerHTML = `<li class="section-empty">완료 과제에 명시된 자산 활용 관계가 없습니다.</li>`;
        return;
    }
    wrap.innerHTML = overviewModel.completedUsageLinks.map((link) => {
        const sourceCard = overviewModel.cardsById.get(link.sourceCardId);
        const targetCard = overviewModel.cardsById.get(link.targetCardId);
        return `
            <li class="overview-row usage-flow-row">
                <span class="row-icon"><i class="bx bx-transfer-alt"></i></span>
                <section>
                    <span class="row-kicker">${escapeHtml(link.usageType)}</span>
                    <h3>${escapeHtml(sourceCard?.title ?? link.sourceCardId)}</h3>
                    <p class="usage-target"><i class="bx bx-right-arrow-alt"></i><a href="${targetCard ? getOverviewCardUrl(targetCard) : "team_technical_assets_library.html"}">${escapeHtml(targetCard?.title ?? link.targetCardId)}</a></p>
                    <small>${escapeHtml(link.outcome || "활용 결과가 등록되었습니다.")}</small>
                </section>
            </li>
        `;
    }).join("");
}

function renderLandingCareList() {
    const wrap = document.getElementById("landing-care-list");
    if (!wrap) return;
    if (!overviewModel.needsAttention.length) {
        wrap.innerHTML = `<li class="section-empty">현재 표시할 보완 요청이 없습니다.</li>`;
        return;
    }
    wrap.innerHTML = overviewModel.needsAttention.map((item) => `
        <li class="overview-row care-row">
            <span class="row-icon"><i class="bx bx-wrench"></i></span>
            <section>
                <span class="row-kicker">${escapeHtml(item.reason)}</span>
                <h3><a href="${getOverviewCardUrl(item.card)}">${escapeHtml(item.card.title)}</a></h3>
                <p>${escapeHtml(item.action)}</p>
                <small>${escapeHtml(item.card.type)} · ${escapeHtml(item.card.status)}${item.card.demo ? " · 샘플" : ""}</small>
            </section>
        </li>
    `).join("");
}

function getLandingMostUsedAssets() {
    const usageByAsset = new Map();
    overviewModel.completedUsageLinks.filter((link) => {
        const sourceCard = overviewModel.cardsById.get(link.sourceCardId);
        return isLandingCurrentMonth(sourceCard?.updatedAt);
    }).forEach((link) => {
        const entry = usageByAsset.get(link.targetCardId) ?? {
            card: overviewModel.cardsById.get(link.targetCardId),
            workIds: new Set(),
            usageTypes: new Set()
        };
        entry.workIds.add(link.sourceCardId);
        entry.usageTypes.add(link.usageType);
        usageByAsset.set(link.targetCardId, entry);
    });
    return [...usageByAsset.values()]
        .filter((item) => item.card)
        .sort((a, b) => b.workIds.size - a.workIds.size || String(a.card.title).localeCompare(String(b.card.title), "ko"))
        .slice(0, 5);
}

function renderLandingMostUsedAssets() {
    const wrap = document.getElementById("landing-most-used-assets");
    if (!wrap) return;
    const items = getLandingMostUsedAssets();
    if (!items.length) {
        wrap.innerHTML = `<li class="section-empty">완료 과제에 연결된 활용 기록이 없습니다.</li>`;
        return;
    }
    wrap.innerHTML = items.map((item, index) => `
        <li class="overview-ranked-item">
            <span class="overview-rank">${String(index + 1).padStart(2, "0")}</span>
            <section>
                <span class="overview-card-type">${escapeHtml(item.card.type)}</span>
                <h3><a href="${getOverviewCardUrl(item.card)}">${escapeHtml(item.card.title)}</a></h3>
                <p>${escapeHtml(item.card.summary || item.card.useCase || "등록된 자산의 상세 내용을 확인하세요.")}</p>
                <small>${[...item.usageTypes].map(escapeHtml).join(" · ") || "활용 관계"}</small>
            </section>
            <strong>${item.workIds.size}<small>개 과제</small></strong>
        </li>
    `).join("");
}

function getLandingContributors() {
    const contributors = new Map();
    const add = (name, kind) => {
        const normalized = String(name ?? "").trim();
        if (!normalized) return;
        const entry = contributors.get(normalized) ?? { name: normalized, total: 0, kinds: new Set() };
        entry.total += 1;
        entry.kinds.add(kind);
        contributors.set(normalized, entry);
    };
    overviewModel.context.items.filter((item) => isLandingCurrentMonth(item.updatedAt)).forEach((item) => add(item.registrant, "등록"));
    overviewModel.completedWorkItems.filter((item) => isLandingCurrentMonth(item.updatedAt)).forEach((item) => add(item.reviewer, "검토"));
    overviewModel.completedUsageLinks.filter((link) => {
        const sourceCard = overviewModel.cardsById.get(link.sourceCardId);
        return isLandingCurrentMonth(sourceCard?.updatedAt);
    }).forEach((link) => add(link.actor, "활용 연결"));
    return [...contributors.values()]
        .sort((a, b) => b.total - a.total || a.name.localeCompare(b.name, "ko"))
        .slice(0, 3);
}

function renderLandingContributors() {
    const wrap = document.getElementById("landing-contributors");
    if (!wrap) return;
    const items = getLandingContributors();
    if (!items.length) {
        wrap.innerHTML = `<li class="section-empty">집계할 기여 기록이 없습니다.</li>`;
        return;
    }
    wrap.innerHTML = items.map((item, index) => `
        <li>
            <span class="contributor-avatar">${escapeHtml(item.name.slice(0, 1))}</span>
            <section><strong>${escapeHtml(item.name)}</strong><small>${[...item.kinds].map(escapeHtml).join(" · ")}</small></section>
            <span class="contributor-count">${item.total}<small>건</small></span>
        </li>
    `).join("");
}

function getKoreanDateParts() {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Seoul",
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(new Date());
    return Object.fromEntries(parts.map((part) => [part.type, part.value]));
}

function isLandingCurrentMonth(value) {
    const date = getKoreanDateParts();
    return String(value ?? "").startsWith(`${date.year}-${date.month}`);
}

function renderLandingDailyAsset() {
    const wrap = document.getElementById("landing-daily-asset");
    if (!wrap) return;
    const candidates = overviewModel.context.items
        .filter((item) => !overviewWorkTypes.has(item.type))
        .sort((a, b) => String(a.id).localeCompare(String(b.id), "ko"));
    if (!candidates.length) {
        wrap.innerHTML = `<p class="section-empty">오늘 소개할 자산이 없습니다.</p>`;
        return;
    }
    const date = getKoreanDateParts();
    const dateKey = Number(`${date.year}${date.month}${date.day}`);
    const item = candidates[dateKey % candidates.length];
    setText("daily-asset-date", `${date.month}.${date.day}`);
    wrap.innerHTML = `
        <article class="overview-daily-asset">
            <span class="overview-card-type">${escapeHtml(item.type)}</span>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.summary || item.useCase || "오늘의 기술자산을 확인해 보세요.")}</p>
            <div class="overview-daily-tags">${(item.tags ?? []).slice(0, 3).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
            <a class="btn btn-secondary" href="${getOverviewCardUrl(item)}">자산 확인하기 <i class="bx bx-right-arrow-alt"></i></a>
        </article>
    `;
}

function renderLandingGapSummary() {
    const note = document.getElementById("overview-data-note");
    if (!note) return;
    if (overviewModel.context.mode === "demo") {
        note.textContent = `현재는 기능시험용 등록 기록에서 ${overviewModel.gapWorkItems.length}건을 확인했습니다. 실제 검색 로그 집계에는 저장소 연결이 필요합니다.`;
    } else if (overviewModel.context.mode === "operational") {
        note.textContent = `운영 카드에 저장된 검색 결과를 기준으로 집계했습니다. 실시간 검색어와 무결과 검색까지 보려면 로그 저장이 필요합니다.`;
    } else {
        note.textContent = "등록된 검색 기록이 없습니다.";
    }
}

function renderLanding() {
    renderLandingMetrics();
    renderLandingMostUsedAssets();
    renderLandingContributors();
    renderLandingDailyAsset();
    renderLandingGapSummary();
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
    const score = Number(level);
    if (!Number.isFinite(score)) return null;
    return simulationLevels.find((item) => item.score === score)
        ?? [...simulationLevels].reverse().find((item) => item.score <= score)
        ?? null;
}

function renderLevelSummary() {
    const wrap = document.getElementById("level-summary");
    if (!wrap) return;
    wrap.innerHTML = `
        <table class="level-table">
            <caption class="visually-hidden">Simulation 방법론 L1부터 L5까지의 정의와 판단 기준</caption>
            <thead>
                <tr>
                    <th scope="col">레벨</th>
                    <th scope="col">정의</th>
                    <th scope="col">판단 가능 수준</th>
                    <th scope="col">필요 데이터</th>
                    <th scope="col">다음 조건</th>
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
            <span>L1~L2 · 기초 데이터와 초기 예측</span>
            <span>L3 · 경향성 기반 의사결정의 Pivot Point</span>
            <span>L4~L5 · 최적화와 선별적 실험 대체</span>
            <span>소수 · 인접한 두 정수 레벨 사이의 중간 성숙도</span>
        </div>
    `;
}

const methodologyCategoryLibraryDomains = {
    "static-deformation": "deformation",
    delamination: "delamination",
    vibration: "vibration",
    fatigue: "fatigue",
    impact: "impact",
    "thermal-flow": "thermal-flow"
};

const maturityPeriodFallbackLabels = {
    baseline: "25.12",
    current: "26.02",
    target: "26.12"
};

function getMaturityPeriodLabel(periodId) {
    const period = Array.isArray(methodologyLevelData?.periods)
        ? methodologyLevelData.periods.find((item) => item.id === periodId)
        : null;
    const label = typeof period?.label === "string" ? period.label.trim() : "";
    return label || maturityPeriodFallbackLabels[periodId] || "-";
}

function getMaturityPeriodPairLabel() {
    return `${getMaturityPeriodLabel("current")} 현황 → ${getMaturityPeriodLabel("target")} 목표`;
}

function renderMapPeriodCopy() {
    const currentPeriod = getMaturityPeriodLabel("current");
    const targetPeriod = getMaturityPeriodLabel("target");
    const periodPair = getMaturityPeriodPairLabel();
    const copyById = {
        "map-brand-period": `구조 Simulation 방법론 ${currentPeriod} 현황과 ${targetPeriod} 목표`,
        "map-na-period-note": `미적용은 미확보와 적용 필요 없음이 함께 포함된 ${currentPeriod} 현황 값이며, 자체적으로 부족이나 우선순위를 뜻하지 않습니다.`,
        "portfolio-title": `중분류별 ${currentPeriod} 현황과 ${targetPeriod} 목표`,
        "map-category-coverage-heading": `적용 · ${periodPair}`,
        "map-category-average-heading": `평균 성숙도 · ${currentPeriod} → ${targetPeriod}`,
        "map-category-change-heading": `${targetPeriod} 목표 변화`,
        "map-comparison-description": `동일한 55개 방법론을 기준으로 사업부별 ${currentPeriod} 현황과 ${targetPeriod} 목표를 비교합니다.`
    };
    Object.entries(copyById).forEach(([id, copy]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = copy;
    });
}

function getMaturityCategories() {
    if (Array.isArray(methodologyLevelData?.categories)) return methodologyLevelData.categories;
    const categories = new Map();
    getMaturityMethodologies().forEach((method) => {
        if (!categories.has(method.categoryId)) {
            categories.set(method.categoryId, { id: method.categoryId, label: method.categoryLabel, methodologyCount: 0 });
        }
        categories.get(method.categoryId).methodologyCount += 1;
    });
    return [...categories.values()];
}

function averageMaturityScore(values) {
    const applied = values.filter((value) => typeof value === "number" && Number.isFinite(value));
    if (applied.length === 0) return null;
    return applied.reduce((sum, value) => sum + value, 0) / applied.length;
}

function formatMaturityAverage(value) {
    return value === null ? "-" : value.toFixed(2);
}

function formatMaturityAverageLevel(value) {
    return value === null ? "미적용" : `L${formatMaturityAverage(value)}`;
}

function getMaturityAverageChange(current, target) {
    if (current === null && target === null) {
        return { kind: "is-na", label: "미적용", description: "미적용 유지" };
    }
    if (current === null) {
        return { kind: "is-new", label: "신규", description: "신규 적용" };
    }
    if (target === null) {
        return { kind: "is-removed", label: "해제", description: "적용 해제" };
    }
    const delta = target - current;
    if (delta > 0.005) {
        return { kind: "is-up", label: `+${delta.toFixed(2)}`, description: `평균 ${delta.toFixed(2)} 상승` };
    }
    if (delta < -0.005) {
        return { kind: "is-down", label: delta.toFixed(2), description: `평균 ${Math.abs(delta).toFixed(2)} 하락` };
    }
    return { kind: "is-stable", label: "유지", description: "동일 수준 유지" };
}

function renderCategoryAverageComparison(current, target, change) {
    const currentLabel = formatMaturityAverageLevel(current);
    const targetLabel = formatMaturityAverageLevel(target);
    const currentPeriod = getMaturityPeriodLabel("current");
    const targetPeriod = getMaturityPeriodLabel("target");
    const toPercent = (value) => Math.max(0, Math.min(100, value / 5 * 100));
    const currentPercent = current === null ? null : toPercent(current);
    const targetPercent = target === null ? null : toPercent(target);
    return `
        <span class="category-comparison-line" aria-hidden="true">
            <span class="category-comparison-value is-current${current === null ? " is-na" : ""}"><small>${escapeHtml(currentPeriod)} 현황</small><strong>${currentLabel}</strong></span>
            <span class="category-comparison-track">
                ${targetPercent !== null ? `<i class="category-bar-target" style="width:${targetPercent.toFixed(1)}%"></i>` : ""}
                ${currentPercent !== null ? `<i class="category-bar-current" style="width:${currentPercent.toFixed(1)}%"></i>` : ""}
                ${targetPercent !== null ? `<i class="category-bar-target-marker" style="left:${targetPercent.toFixed(1)}%"></i>` : ""}
            </span>
            <span class="category-comparison-value is-target${target === null ? " is-na" : ""}"><small>${escapeHtml(targetPeriod)} 목표</small><strong>${targetLabel}</strong></span>
            <strong class="category-comparison-delta ${change.kind}">${change.label}</strong>
        </span>
    `;
}

function getBusinessMaturityStats(businessUnitId, methods = getMaturityMethodologies()) {
    const currentScores = methods.map((method) => getMaturityScore(method, "current", businessUnitId));
    const targetScores = methods.map((method) => getMaturityScore(method, "target", businessUnitId));
    const changes = methods.map((method) => getMaturityChange(
        getMaturityScore(method, "current", businessUnitId),
        getMaturityScore(method, "target", businessUnitId)
    ));
    return {
        total: methods.length,
        currentApplied: currentScores.filter((value) => value !== null).length,
        targetApplied: targetScores.filter((value) => value !== null).length,
        currentAverage: averageMaturityScore(currentScores),
        targetAverage: averageMaturityScore(targetScores),
        levelUp: changes.filter((change) => change.kind === "level-up").length,
        newApplications: changes.filter((change) => change.kind === "new").length,
        currentL3Plus: currentScores.filter((value) => value !== null && value >= 3).length,
        targetL3Plus: targetScores.filter((value) => value !== null && value >= 3).length
    };
}

function renderMapDataStatus() {
    const status = document.getElementById("methodology-data-status");
    if (!methodologyLevelData) return;
    if (status) {
        status.innerHTML = `<span class="status-dot is-ready" aria-hidden="true"></span><span>원본 검증 완료</span>`;
    }
}

function renderMaturityKpis() {
    const wrap = document.getElementById("maturity-kpis");
    if (!wrap) return;
    const stats = getBusinessMaturityStats(methodologyMapState.businessUnitId);
    const businessUnit = getMaturityBusinessUnits().find((item) => item.id === methodologyMapState.businessUnitId);
    const targetPeriod = getMaturityPeriodLabel("target");
    const periodPair = getMaturityPeriodPairLabel();
    wrap.innerHTML = `
        <div class="map-summary-cell map-summary-business">
            <small>선택 사업부</small><strong>${escapeHtml(businessUnit?.label ?? "-")}</strong>
        </div>
        <div class="map-summary-cell"><small>평균 성숙도 · ${escapeHtml(periodPair)}</small><strong>${formatMaturityAverageLevel(stats.currentAverage)} → ${formatMaturityAverageLevel(stats.targetAverage)}</strong></div>
        <div class="map-summary-cell"><small>적용 · ${escapeHtml(periodPair)}</small><strong>${stats.currentApplied} → ${stats.targetApplied}</strong></div>
        <div class="map-summary-cell"><small>신규 적용 · ${escapeHtml(targetPeriod)} 목표</small><strong>${stats.newApplications}</strong></div>
        <div class="map-summary-cell"><small>성숙도 향상 · ${escapeHtml(targetPeriod)} 목표</small><strong>${stats.levelUp}</strong></div>
    `;
}

function renderCoverageComparison(current, target, total) {
    const currentPercent = total > 0 ? Math.max(0, Math.min(100, current / total * 100)) : 0;
    const targetPercent = total > 0 ? Math.max(0, Math.min(100, target / total * 100)) : 0;
    return `
        <span class="business-coverage-lines">
            <span class="business-coverage-row is-current">
                <small>${escapeHtml(getMaturityPeriodLabel("current"))} 현황</small>
                <span class="coverage-track"><i class="coverage-bar-current" style="width:${currentPercent.toFixed(1)}%"></i></span>
                <strong>${current}</strong>
            </span>
            <span class="business-coverage-row is-target">
                <small>${escapeHtml(getMaturityPeriodLabel("target"))} 목표</small>
                <span class="coverage-track"><i class="coverage-bar-target" style="width:${targetPercent.toFixed(1)}%"></i></span>
                <strong>${target}</strong>
            </span>
        </span>
    `;
}

function renderBusinessUnitOverview() {
    const wrap = document.getElementById("business-unit-overview");
    if (!wrap) return;
    wrap.innerHTML = getMaturityBusinessUnits().map((businessUnit) => {
        const isActive = methodologyMapState.businessUnitId === businessUnit.id;
        return `
            <button type="button" class="map-business-tab${isActive ? " active" : ""}"
                data-overview-business-id="${escapeHtml(businessUnit.id)}" aria-pressed="${isActive}">
                ${escapeHtml(businessUnit.label)}
            </button>
        `;
    }).join("");
    wrap.querySelectorAll("[data-overview-business-id]").forEach((button) => {
        button.addEventListener("click", () => {
            methodologyMapState.businessUnitId = button.dataset.overviewBusinessId;
            methodologyMapState.selectedMethodId = null;
            refreshMaturityDashboard();
        });
    });
}

function isTargetChange(change) {
    return !["stable", "not-applicable"].includes(change.kind);
}

function getMapChangeLabel(change) {
    if (change.kind === "new") return "신규 적용";
    if (change.kind === "level-up") return "성숙도 향상";
    if (change.kind === "removed") return "적용 해제";
    if (change.kind === "lowered") return "목표 하향";
    if (change.kind === "not-applicable") return "미적용";
    return "유지";
}

function renderCategoryChangeSummary(stats) {
    const parts = [];
    if (stats.newApplications > 0) parts.push(`<span class="map-change-pill is-new">신규 적용 ${stats.newApplications}</span>`);
    if (stats.levelUp > 0) parts.push(`<span class="map-change-pill is-up">성숙도 향상 ${stats.levelUp}</span>`);
    return parts.length ? parts.join("") : `<span class="map-change-none">변화 없음</span>`;
}

function renderCategoryMethodArea(category, methods) {
    const businessUnitId = methodologyMapState.businessUnitId;
    const changedMethods = methods.filter((method) => isTargetChange(getMaturityChange(
        getMaturityScore(method, "current", businessUnitId),
        getMaturityScore(method, "target", businessUnitId)
    )));
    const visibleMethods = methodologyMapState.showAllMethods ? methods : changedMethods;
    const currentPeriod = getMaturityPeriodLabel("current");
    const targetPeriod = getMaturityPeriodLabel("target");
    const periodPair = getMaturityPeriodPairLabel();
    if (!visibleMethods.some((method) => method.id === methodologyMapState.selectedMethodId)) {
        methodologyMapState.selectedMethodId = null;
    }
    return `
        <div class="map-category-detail" id="map-category-detail-${escapeHtml(category.id)}">
            <div class="map-method-browser">
                <div class="map-method-toolbar">
                    <div>
                        <strong>${escapeHtml(category.label)} 방법론</strong>
                        <span>${methodologyMapState.showAllMethods ? `${escapeHtml(currentPeriod)} 현황 전체` : `${escapeHtml(targetPeriod)} 목표 변화`}를 표시합니다.</span>
                    </div>
                    <button type="button" class="map-view-switch" data-map-view-toggle role="switch"
                        aria-checked="${methodologyMapState.showAllMethods}" aria-label="전체 방법론 표시">
                        <span class="map-switch-label${methodologyMapState.showAllMethods ? "" : " active"}">올해 변화 <strong>${changedMethods.length}</strong></span>
                        <span class="map-switch-track" aria-hidden="true"><i></i></span>
                        <span class="map-switch-label${methodologyMapState.showAllMethods ? " active" : ""}">전체 <strong>${methods.length}</strong></span>
                    </button>
                </div>
                <div class="map-method-columns" aria-hidden="true"><span>방법론</span><span>${escapeHtml(periodPair)}</span><span>변화</span><span></span></div>
                <div class="map-method-list">
                    ${visibleMethods.length ? visibleMethods.map((method) => {
                        const current = getMaturityScore(method, "current", businessUnitId);
                        const target = getMaturityScore(method, "target", businessUnitId);
                        const change = getMaturityChange(current, target);
                        const selected = method.id === methodologyMapState.selectedMethodId;
                        return `
                            <button type="button" class="map-method-row${selected ? " selected" : ""}" data-map-method-id="${escapeHtml(method.id)}" aria-pressed="${selected}">
                                <strong>${escapeHtml(getMethodologyDisplayName(method))}</strong>
                                <span class="map-method-score">${escapeHtml(formatMaturityScore(current))} <i class="bx bx-right-arrow-alt" aria-hidden="true"></i> ${escapeHtml(formatMaturityScore(target))}</span>
                                <span class="map-method-change is-${escapeHtml(change.kind)}">${escapeHtml(getMapChangeLabel(change))}</span>
                                <i class="bx bx-chevron-right map-row-chevron" aria-hidden="true"></i>
                            </button>
                        `;
                    }).join("") : `
                        <div class="map-method-empty">
                            <strong>${escapeHtml(targetPeriod)} 목표 변화가 없습니다.</strong>
                            <span>전체 방법론을 선택하면 ${escapeHtml(currentPeriod)} 현황 유지 및 미적용 항목도 확인할 수 있습니다.</span>
                        </div>
                    `}
                </div>
            </div>
            <aside class="map-method-detail" id="method-detail" aria-live="polite"></aside>
        </div>
    `;
}

function renderCategoryOverview() {
    const wrap = document.getElementById("category-overview");
    if (!wrap) return;
    const businessUnitId = methodologyMapState.businessUnitId;
    const periodPair = getMaturityPeriodPairLabel();
    wrap.innerHTML = getMaturityCategories().map((category) => {
        const methods = getMaturityMethodologies().filter((method) => method.categoryId === category.id);
        const stats = getBusinessMaturityStats(businessUnitId, methods);
        const isOpen = methodologyMapState.selectedCategoryId === category.id;
        return `
            <section class="map-category-item${isOpen ? " open" : ""}" data-map-category-item="${escapeHtml(category.id)}">
                <button type="button" class="map-category-row" data-map-category-id="${escapeHtml(category.id)}" aria-expanded="${isOpen}">
                    <span class="map-category-name"><strong>${escapeHtml(category.label)}</strong><small>${methods.length}개 방법론</small></span>
                    <strong class="map-category-value" data-label="적용 · ${escapeHtml(periodPair)}">${stats.currentApplied} → ${stats.targetApplied}</strong>
                    <span class="map-category-average"><strong>${formatMaturityAverageLevel(stats.currentAverage)} → ${formatMaturityAverageLevel(stats.targetAverage)}</strong></span>
                    <span class="map-category-changes" data-label="${escapeHtml(getMaturityPeriodLabel("target"))} 목표 변화">${renderCategoryChangeSummary(stats)}</span>
                    <i class="bx bx-chevron-down map-category-chevron" aria-hidden="true"></i>
                </button>
                ${isOpen ? renderCategoryMethodArea(category, methods) : ""}
            </section>
        `;
    }).join("");

    wrap.querySelectorAll("[data-map-category-id]").forEach((button) => {
        button.addEventListener("click", () => {
            const categoryId = button.dataset.mapCategoryId;
            methodologyMapState.selectedCategoryId = methodologyMapState.selectedCategoryId === categoryId ? null : categoryId;
            methodologyMapState.selectedMethodId = null;
            methodologyMapState.showAllMethods = false;
            renderCategoryOverview();
        });
    });
    wrap.querySelectorAll("[data-map-view-toggle]").forEach((button) => {
        button.addEventListener("click", () => {
            methodologyMapState.showAllMethods = !methodologyMapState.showAllMethods;
            methodologyMapState.selectedMethodId = null;
            renderCategoryOverview();
        });
    });
    wrap.querySelectorAll("[data-map-method-id]").forEach((button) => {
        button.addEventListener("click", () => {
            methodologyMapState.selectedMethodId = button.dataset.mapMethodId;
            renderCategoryOverview();
            if (window.matchMedia("(max-width: 920px)").matches) {
                document.getElementById("method-detail")?.scrollIntoView({
                    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                    block: "start"
                });
            }
        });
    });
    renderMethodDetail(getMaturityMethodologies().find((method) => method.id === methodologyMapState.selectedMethodId));
}

function renderMaturityPath(current, target) {
    if (current === null && target === null) return `<span class="path-not-applicable">미적용</span>`;
    const position = (value) => Math.max(0, Math.min(100, (value - 1) / 4 * 100)).toFixed(1);
    const currentPosition = current === null ? null : Number(position(current));
    const targetPosition = target === null ? null : Number(position(target));
    const left = currentPosition === null || targetPosition === null ? null : Math.min(currentPosition, targetPosition);
    const width = currentPosition === null || targetPosition === null ? null : Math.abs(targetPosition - currentPosition);
    const isSamePosition = currentPosition !== null && targetPosition !== null && Math.abs(currentPosition - targetPosition) < 0.01;
    const isLowered = currentPosition !== null && targetPosition !== null && targetPosition < currentPosition;
    const currentPeriod = getMaturityPeriodLabel("current");
    const targetPeriod = getMaturityPeriodLabel("target");
    return `
        <span class="maturity-path" aria-label="${escapeHtml(currentPeriod)} 현황 ${formatMaturityScore(current)}, ${escapeHtml(targetPeriod)} 목표 ${formatMaturityScore(target)}">
            <span class="path-axis"></span>
            <span class="path-ticks" aria-hidden="true"><i style="left:0%"></i><i style="left:25%"></i><i style="left:50%"></i><i style="left:75%"></i><i style="left:100%"></i></span>
            ${left !== null && !isSamePosition ? `<span class="path-range${isLowered ? " is-lowered" : ""}" style="left:${left}%;width:${width}%"></span>` : ""}
            ${isSamePosition ? `<i class="path-marker combined" style="left:${currentPosition}%" title="${escapeHtml(currentPeriod)} 현황과 ${escapeHtml(targetPeriod)} 목표 ${escapeHtml(formatMaturityScore(current))}"></i>` : `
                ${currentPosition !== null ? `<i class="path-marker current" style="left:${currentPosition}%" title="${escapeHtml(currentPeriod)} 현황 ${escapeHtml(formatMaturityScore(current))}"></i>` : ""}
                ${targetPosition !== null ? `<i class="path-marker target" style="left:${targetPosition}%" title="${escapeHtml(targetPeriod)} 목표 ${escapeHtml(formatMaturityScore(target))}"></i>` : ""}
            `}
        </span>
    `;
}

function renderMethodTable() {
    const wrap = document.getElementById("method-heatmap");
    const count = document.getElementById("methodology-result-count");
    if (!wrap) return;
    const methods = getMaturityMethodologies();
    if (count) count.textContent = `전체 ${methods.length}개`;
    if (!methods.length) {
        wrap.innerHTML = `<div class="empty-state"><i class="bx bx-error-circle"></i><strong>표시할 방법론이 없습니다.</strong><span>원본 데이터 연결을 확인해 주세요.</span></div>`;
        methodologyMapState.selectedMethodId = null;
        renderMethodDetail(null);
        return;
    }
    if (!methods.some((method) => method.id === methodologyMapState.selectedMethodId)) {
        methodologyMapState.selectedMethodId = null;
    }
    const businessUnitId = methodologyMapState.businessUnitId;
    const baselinePeriod = getMaturityPeriodLabel("baseline");
    const currentPeriod = getMaturityPeriodLabel("current");
    const targetPeriod = getMaturityPeriodLabel("target");
    const periodPair = getMaturityPeriodPairLabel();
    const categoryGroups = getMaturityCategories().map((category) => ({
        category,
        methods: methods.filter((method) => method.categoryId === category.id)
    })).filter((group) => group.methods.length > 0);
    wrap.innerHTML = `
        <table class="heatmap-table maturity-table">
            <caption class="visually-hidden">선택 사업부의 중분류별 ${escapeHtml(baselinePeriod)} 이전 기록, ${escapeHtml(periodPair)} 비교</caption>
            <thead>
                <tr>
                    <th scope="col">방법론</th>
                    <th scope="col">${escapeHtml(baselinePeriod)}<br><small>이전 기록</small></th>
                    <th scope="col">${escapeHtml(currentPeriod)}<br><small>현황</small></th>
                    <th scope="col">${escapeHtml(targetPeriod)}<br><small>목표</small></th>
                    <th scope="col">${escapeHtml(periodPair)} <small class="path-scale">L1 · L2 · L3 · L4 · L5</small></th>
                </tr>
            </thead>
            ${categoryGroups.map(({ category, methods: groupMethods }, categoryIndex) => {
                const stats = getBusinessMaturityStats(businessUnitId, groupMethods);
                const categoryNumber = String(categoryIndex + 1).padStart(2, "0");
                return `
                    <tbody class="maturity-category-group" id="method-category-${escapeHtml(category.id)}" data-category-id="${escapeHtml(category.id)}">
                        <tr class="maturity-category-row">
                            <th colspan="5" scope="rowgroup">
                                <span class="category-group-label">
                                    <span class="category-group-index">중분류 ${categoryNumber}</span>
                                    <strong>${escapeHtml(category.label)}</strong>
                                    <small>${groupMethods.length}개 방법론</small>
                                </span>
                                <span class="category-group-meta">
                                    <span><small>${escapeHtml(currentPeriod)} 현황 적용</small><strong>${stats.currentApplied}/${stats.total}</strong></span>
                                    <span><small>${escapeHtml(targetPeriod)} 목표 적용</small><strong>${stats.targetApplied}/${stats.total}</strong></span>
                                </span>
                            </th>
                        </tr>
                        ${groupMethods.map((method) => {
                            const baseline = getMaturityScore(method, "baseline", businessUnitId);
                            const current = getMaturityScore(method, "current", businessUnitId);
                            const target = getMaturityScore(method, "target", businessUnitId);
                            const selected = method.id === methodologyMapState.selectedMethodId;
                            return `
                                <tr class="method-row${selected ? " selected" : ""}" data-method-id="${escapeHtml(method.id)}" tabindex="0" role="button" aria-selected="${selected}">
                                    <th scope="row" class="method-name"><strong>${escapeHtml(getMethodologyDisplayName(method))}</strong></th>
                                    <td>${renderMaturityScore(baseline, "is-baseline")}</td>
                                    <td>${renderMaturityScore(current, "is-current")}</td>
                                    <td>${renderMaturityScore(target, getMaturityTargetClass(current, target))}</td>
                                    <td>${renderMaturityPath(current, target)}</td>
                                </tr>
                            `;
                        }).join("")}
                    </tbody>
                `;
            }).join("")}
        </table>
    `;
    wrap.querySelectorAll("[data-method-id]").forEach((row) => {
        const selectMethod = () => {
            methodologyMapState.selectedMethodId = row.dataset.methodId;
            wrap.querySelectorAll("[data-method-id]").forEach((item) => {
                const selected = item.dataset.methodId === methodologyMapState.selectedMethodId;
                item.classList.toggle("selected", selected);
                item.setAttribute("aria-selected", String(selected));
            });
            renderMethodDetail(getMaturityMethodologies().find((method) => method.id === methodologyMapState.selectedMethodId));
            if (window.matchMedia("(max-width: 1120px)").matches) {
                document.getElementById("method-detail")?.scrollIntoView({
                    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                    block: "start"
                });
            }
        };
        row.addEventListener("click", selectMethod);
        row.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selectMethod();
            }
        });
    });
    renderMethodDetail(getMaturityMethodologies().find((method) => method.id === methodologyMapState.selectedMethodId));
}

function getMaturityInterpretation(current, target, businessUnitLabel) {
    const change = getMaturityChange(current, target);
    const currentPeriod = getMaturityPeriodLabel("current");
    const targetPeriod = getMaturityPeriodLabel("target");
    if (change.kind === "not-applicable") return `${businessUnitLabel} 기준 ${currentPeriod} 현황과 ${targetPeriod} 목표 모두 미적용입니다.`;
    if (change.kind === "new") return `${businessUnitLabel}는 ${targetPeriod}에 ${formatMaturityScore(target)} 신규 적용을 목표로 합니다.`;
    if (change.kind === "removed") return `${businessUnitLabel}는 ${targetPeriod} 목표 시점에 적용 해제로 표시되어 확인이 필요합니다.`;
    if (change.kind === "level-up") return `${businessUnitLabel}는 ${formatMaturityScore(current)}에서 ${formatMaturityScore(target)}로 성숙도 향상을 목표로 합니다.`;
    if (change.kind === "lowered") return `${businessUnitLabel}는 목표가 현황보다 낮아 기준 확인이 필요합니다.`;
    return `${businessUnitLabel}는 ${formatMaturityScore(current)} 수준을 유지하는 목표입니다.`;
}

function renderMethodDetail(method) {
    const panel = document.getElementById("method-detail");
    if (!panel) return;
    if (!method) {
        const periodPair = getMaturityPeriodPairLabel();
        panel.innerHTML = `
            <div class="map-detail-empty">
                <i class="bx bx-pointer" aria-hidden="true"></i>
                <strong>방법론을 선택해 주세요.</strong>
                <span>사업부별 ${escapeHtml(periodPair)}를 이곳에서 빠르게 비교할 수 있습니다.</span>
            </div>
        `;
        return;
    }
    const selectedBusiness = getMaturityBusinessUnits().find((item) => item.id === methodologyMapState.businessUnitId);
    const current = getMaturityScore(method, "current", methodologyMapState.businessUnitId);
    const target = getMaturityScore(method, "target", methodologyMapState.businessUnitId);
    const libraryDomain = methodologyCategoryLibraryDomains[method.categoryId] ?? "all";
    const baselinePeriod = getMaturityPeriodLabel("baseline");
    const currentPeriod = getMaturityPeriodLabel("current");
    const targetPeriod = getMaturityPeriodLabel("target");
    const periodPair = getMaturityPeriodPairLabel();
    panel.innerHTML = `
        <div class="map-detail-heading">
            <span>${escapeHtml(method.categoryLabel)}</span>
            <h3>${escapeHtml(getMethodologyDisplayName(method))}</h3>
            <p>${escapeHtml(selectedBusiness?.label ?? "선택 사업부")} · ${escapeHtml(periodPair)}</p>
        </div>
        <div class="map-detail-transition">
            <span><small>${escapeHtml(currentPeriod)} 현황</small><strong>${escapeHtml(formatMaturityScore(current))}</strong></span>
            <i class="bx bx-right-arrow-alt" aria-hidden="true"></i>
            <span><small>${escapeHtml(targetPeriod)} 목표</small><strong>${escapeHtml(formatMaturityScore(target))}</strong></span>
        </div>
        <section class="map-detail-comparison">
            <h4>사업부별 현황과 목표</h4>
            <div class="table-scroll">
                <table>
                    <caption class="visually-hidden">선택 방법론의 사업부별 ${escapeHtml(periodPair)}</caption>
                    <thead><tr><th scope="col">사업부</th><th scope="col">${escapeHtml(currentPeriod)}<br><small>현황</small></th><th scope="col">${escapeHtml(targetPeriod)}<br><small>목표</small></th></tr></thead>
                    <tbody>
                        ${getMaturityBusinessUnits().map((businessUnit) => `
                            <tr${businessUnit.id === methodologyMapState.businessUnitId ? ` class="selected"` : ""}>
                                <th scope="row">${escapeHtml(businessUnit.label)}</th>
                                <td>${escapeHtml(formatMaturityScore(getMaturityScore(method, "current", businessUnit.id)))}</td>
                                <td>${escapeHtml(formatMaturityScore(getMaturityScore(method, "target", businessUnit.id)))}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        </section>
        <a class="btn btn-secondary map-detail-library" href="team_technical_assets_library.html?domain=${encodeURIComponent(libraryDomain)}">
            <i class="bx bx-folder-open" aria-hidden="true"></i> 관련 Library 보기
        </a>
        <details class="map-previous-record">
            <summary>이전 기록</summary>
            <div class="table-scroll">
                <table>
                    <caption class="visually-hidden">선택 방법론의 사업부별 ${escapeHtml(baselinePeriod)} 이전 기록</caption>
                    <thead><tr><th scope="col">사업부</th><th scope="col">${escapeHtml(baselinePeriod)}</th></tr></thead>
                    <tbody>
                        ${getMaturityBusinessUnits().map((businessUnit) => `
                            <tr${businessUnit.id === methodologyMapState.businessUnitId ? ` class="selected"` : ""}>
                                <th scope="row">${escapeHtml(businessUnit.label)}</th>
                                <td>${escapeHtml(formatMaturityScore(getMaturityScore(method, "baseline", businessUnit.id)))}</td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        </details>
    `;
}

function renderBusinessComparison() {
    const wrap = document.getElementById("map-comparison-content");
    if (!wrap) return;
    const periodPair = getMaturityPeriodPairLabel();
    wrap.innerHTML = `
        <table class="map-comparison-table">
            <caption class="visually-hidden">전체 사업부 방법론 ${escapeHtml(periodPair)} 비교</caption>
            <thead><tr><th scope="col">사업부</th><th scope="col">평균 성숙도<br><small>${escapeHtml(periodPair)}</small></th><th scope="col">적용<br><small>${escapeHtml(periodPair)}</small></th><th scope="col">신규 적용</th><th scope="col">성숙도 향상</th></tr></thead>
            <tbody>
                ${getMaturityBusinessUnits().map((businessUnit) => {
                    const stats = getBusinessMaturityStats(businessUnit.id);
                    return `
                        <tr${businessUnit.id === methodologyMapState.businessUnitId ? ` class="selected"` : ""}>
                            <th scope="row">${escapeHtml(businessUnit.label)}</th>
                            <td>${formatMaturityAverageLevel(stats.currentAverage)} → ${formatMaturityAverageLevel(stats.targetAverage)}</td>
                            <td>${stats.currentApplied} → ${stats.targetApplied}</td>
                            <td>${stats.newApplications}</td>
                            <td>${stats.levelUp}</td>
                        </tr>
                    `;
                }).join("")}
            </tbody>
        </table>
    `;
}

function bindMapComparisonDialog() {
    const dialog = document.getElementById("map-comparison-dialog");
    const openButton = document.getElementById("map-open-comparison");
    const closeButton = document.getElementById("map-close-comparison");
    if (!dialog || !openButton || !closeButton) return;
    openButton.addEventListener("click", () => {
        renderBusinessComparison();
        if (typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "");
    });
    closeButton.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) dialog.close();
    });
}

function refreshMaturityDashboard() {
    renderMaturityKpis();
    renderBusinessUnitOverview();
    renderCategoryOverview();
    renderBusinessComparison();
}

function renderMap() {
    renderLevelSummary();
    renderMapPeriodCopy();
    const wrap = document.getElementById("category-overview");
    if (!methodologyLevelData || getMaturityMethodologies().length === 0) {
        if (wrap) wrap.innerHTML = `<div class="empty-state is-error"><i class="bx bx-error-circle"></i><strong>방법론 데이터를 불러오지 못했습니다.</strong><span>생성 데이터 파일과 배포 구성을 확인해 주세요.</span></div>`;
        const status = document.getElementById("methodology-data-status");
        if (status) status.textContent = "데이터 확인 필요";
        return;
    }
    if (!getMaturityBusinessUnits().some((item) => item.id === methodologyMapState.businessUnitId)) {
        methodologyMapState.businessUnitId = getMaturityBusinessUnits()[0]?.id ?? "sc";
    }
    bindMapComparisonDialog();
    renderMapDataStatus();
    refreshMaturityDashboard();
}

function renderCapabilityParts(parts) {
    const uniqueParts = [...new Set(parts)].sort((a, b) => a - b);
    const partTokens = uniqueParts
        .map((part) => `<span class="learning-capability-part is-part-${part}">P${part}</span>`)
        .join("");
    return `
        <span class="learning-capability-parts" aria-label="적용 파트">
            ${partTokens}
        </span>
    `;
}

function renderCapabilityRequirement(requirement) {
    return `
        <span class="learning-capability-requirement is-${escapeHtml(requirement)}">
            ${escapeHtml(learningRequirementLabels[requirement])}
        </span>
    `;
}

function getLearningPlacementChannels(node, placement) {
    return placement.channels ?? node.channels ?? [];
}

function getLearningPlacementRequirement(node, placement) {
    const explicitRequirement = placement.requirement ?? node.requirement;
    if (["required", "optional"].includes(explicitRequirement)) return explicitRequirement;

    const isCommonFoundation = learningRequiredFamilyIds.has(node.masterCapabilityId);
    const isCapabilityPlacement = getLearningPlacementChannels(node, placement).length === 0;
    return isCommonFoundation || isCapabilityPlacement ? "required" : "optional";
}

function renderCapabilityChannels(channels) {
    if (channels.length === 0) return "";
    return `
        <span class="learning-capability-channels" aria-label="교육 채널">
            ${channels.map((channel) => `
                <span class="learning-item-channel is-${escapeHtml(channel)}">
                    ${escapeHtml(learningEducationChannelLabels[channel])}
                </span>
            `).join("")}
        </span>
    `;
}

function matchesLearningFilters(node, placement) {
    const selectedPart = learningPathState.selectedPart === "all"
        ? null
        : Number(learningPathState.selectedPart);
    const channels = getLearningPlacementChannels(node, placement);
    const requirement = getLearningPlacementRequirement(node, placement);
    const partMatches = selectedPart === null || placement.parts.includes(selectedPart);
    const requirementMatches = learningPathState.selectedRequirement === "all"
        || requirement === learningPathState.selectedRequirement;
    const channelMatches = learningPathState.selectedChannel === "all"
        || channels.includes(learningPathState.selectedChannel);
    return partMatches && requirementMatches && channelMatches;
}

function renderLearningCapabilityNode(node, placement) {
    const selectedPart = learningPathState.selectedPart === "all"
        ? null
        : Number(learningPathState.selectedPart);
    const channels = getLearningPlacementChannels(node, placement);
    const requirement = getLearningPlacementRequirement(node, placement);
    const isDimmed = !matchesLearningFilters(node, placement);
    const relationApplies = !isDimmed
        && placement.relationType === "source-link"
        && (selectedPart === null
            || !placement.relationParts?.length
            || placement.relationParts.includes(selectedPart));
    const parentLabels = relationApplies
        ? (placement.parentIds ?? [])
            .map((parentId) => learningCapabilityById[parentId]?.label)
            .filter(Boolean)
        : [];
    const classNames = [
        "learning-capability-node",
        isDimmed ? "is-dimmed" : "",
        channels.length > 0 ? "has-education-channel" : "",
        parentLabels.length > 0 ? "has-source-link" : ""
    ].filter(Boolean).join(" ");
    const partsLabel = placement.parts.map((part) => `${part}파트`).join(", ");
    const channelsLabel = channels.map((channel) => learningEducationChannelLabels[channel]).join(", ");
    const requirementLabel = learningRequirementLabels[requirement];

    return `
        <button
            type="button"
            class="${classNames}"
            data-capability-id="${escapeHtml(node.id)}"
            data-stage-id="${escapeHtml(placement.stageId)}"
            data-parts="${placement.parts.join(",")}"
            data-channels="${channels.join(",")}"
            data-requirement="${escapeHtml(requirement)}"
            aria-haspopup="dialog"
            aria-controls="learning-detail-dialog"
            aria-label="${escapeHtml(`${placement.label ?? node.label}. ${partsLabel}. ${requirementLabel}${channelsLabel ? `. 교육 채널 ${channelsLabel}` : ""}. 상세 보기`)}"
        >
            <span class="learning-capability-heading">
                <strong class="learning-capability-title">${escapeHtml(placement.label ?? node.label)}</strong>
                <i class="bx bx-chevron-right" aria-hidden="true"></i>
            </span>
            <span class="learning-capability-meta">
                ${renderCapabilityParts(placement.parts)}
                ${renderCapabilityRequirement(requirement)}
                ${renderCapabilityChannels(channels)}
            </span>
            ${parentLabels.length > 0
                ? `<span class="learning-source-link">${escapeHtml(parentLabels.join(" · "))} 연관 역량</span>`
                : ""}
        </button>
    `;
}

const learningLibraryRoleMeta = {
    DEFINES: { label: "방법론·판단 기준", order: 1 },
    TEACHES: { label: "학습자료", order: 2 },
    PRACTICES: { label: "실습자료", order: 3 },
    ENABLES: { label: "실행 도구", order: 4 },
    EXAMPLE_OF: { label: "적용 사례", order: 5 },
    APPLIES: { label: "적용 사례", order: 5 },
    VALIDATES: { label: "검증 근거", order: 6 },
    EVIDENCE_FOR: { label: "검증 근거", order: 6 },
    REFERENCES: { label: "참고자료", order: 7 }
};
const learningLibrarySections = [
    { id: "learning", label: "학습자료", order: 1 },
    { id: "practice-tool", label: "실습·Tool Manual", order: 2 },
    { id: "methodology-criteria", label: "방법론·판단 기준", order: 3 },
    { id: "application-evidence", label: "적용 사례·검증 근거", order: 4 }
];
const learningLibrarySectionById = Object.fromEntries(
    learningLibrarySections.map((section) => [section.id, section])
);
const learningLibrarySectionByRelation = {
    TEACHES: "learning",
    PRACTICES: "practice-tool",
    ENABLES: "practice-tool",
    DEFINES: "methodology-criteria",
    EXAMPLE_OF: "application-evidence",
    APPLIES: "application-evidence",
    VALIDATES: "application-evidence",
    EVIDENCE_FOR: "application-evidence"
};
let learningDetailReturnFocus = null;

function getLearningLibrarySectionId(item, link) {
    const relationSection = learningLibrarySectionByRelation[link.relationType];
    if (relationSection) return relationSection;
    if (item.type === "교육자료") return "learning";
    if (item.type === "Tool Manual" || item.type === "노하우") return "practice-tool";
    if (item.type === "방법론") return "methodology-criteria";
    return "application-evidence";
}

function getLearningCapabilityContext(capabilityId, stageId) {
    const node = learningCapabilityById[capabilityId];
    const family = learningFamilyByCapabilityId.get(capabilityId);
    const placement = node?.placements?.find((candidate) => candidate.stageId === stageId) ?? node?.placements?.[0];
    const stage = learningCareerStages.find((candidate) => candidate.id === placement?.stageId);
    if (!node || !family || !placement) return null;
    return { node, family, placement, stage };
}

function getLearningLibraryConnections(capabilityId) {
    return libraryItems.flatMap((item) => (item.frameworkLinks ?? [])
        .filter((link) => link.framework === "learning-path" && link.targetId === capabilityId && link.confirmed !== false)
        .map((link) => {
            const sectionId = getLearningLibrarySectionId(item, link);
            return {
                item,
                link,
                sectionId,
                section: learningLibrarySectionById[sectionId],
                role: learningLibraryRoleMeta[link.relationType] ?? learningLibraryRoleMeta.REFERENCES
            };
        }))
        .sort((a, b) => a.section.order - b.section.order || a.role.order - b.role.order || a.item.title.localeCompare(b.item.title, "ko"));
}

function renderLearningLibraryConnection({ item, link, role }) {
    const publicationStatus = publicationStatusMeta[item.publicationStatus] ?? publicationStatusMeta["초안"];
    return `
        <a class="learning-linked-asset" href="team_technical_assets_library.html?asset=${encodeURIComponent(item.id)}">
            <span class="learning-linked-asset-top">
                <span class="learning-linked-role">${escapeHtml(role.label)}</span>
                <span class="badge ${publicationStatus.className}">${escapeHtml(item.publicationStatus ?? "초안")}</span>
            </span>
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.summary ?? "요약 정보가 없습니다.")}</p>
            ${link.note ? `<small>${escapeHtml(link.note)}</small>` : ""}
            <span class="learning-linked-open">Library에서 전체 보기 <i class="bx bx-right-arrow-alt" aria-hidden="true"></i></span>
        </a>
    `;
}

function renderLearningLibrarySections(connections) {
    const sections = learningLibrarySections.map((section, index) => {
        const sectionConnections = connections.filter((connection) => connection.sectionId === section.id);
        return `
            <section class="learning-library-section${sectionConnections.length ? " has-assets" : ""}">
                <header>
                    <span class="learning-library-section-index">${String(index + 1).padStart(2, "0")}</span>
                    <h4>${escapeHtml(section.label)}</h4>
                    <strong aria-label="연결 자료 ${sectionConnections.length}개">${sectionConnections.length}</strong>
                </header>
                ${sectionConnections.length
                    ? `<div class="learning-linked-assets">${sectionConnections.map(renderLearningLibraryConnection).join("")}</div>`
                    : `<p class="learning-library-section-empty">현재 연결 자료 없음</p>`}
            </section>
        `;
    }).join("");

    return `
        <div class="learning-library-sections" aria-label="Library 자료 4개 섹션">${sections}</div>
        ${connections.length ? "" : `<p class="learning-library-status-note">현재 연결된 자료가 없다는 현황이며, 역량의 부족이나 우선순위를 뜻하지 않습니다.</p>`}
    `;
}

function renderLearningCapabilityDetail(capabilityId, stageId) {
    const content = document.getElementById("learning-detail-content");
    const context = getLearningCapabilityContext(capabilityId, stageId);
    if (!content || !context) return false;

    const { node, family, placement, stage } = context;
    const details = learningCapabilityDetails[capabilityId] ?? {};
    const channels = getLearningPlacementChannels(node, placement);
    const requirement = getLearningPlacementRequirement(node, placement);
    const parts = [...new Set(placement.parts)].sort((a, b) => a - b);
    const partDetailTokens = parts
        .map((part) => `<span class="learning-detail-chip is-part is-part-${part}">P${part}</span>`)
        .join("");
    const parentLabels = (placement.parentIds ?? [])
        .map((parentId) => learningCapabilityById[parentId]?.label)
        .filter(Boolean);
    const libraryConnections = getLearningLibraryConnections(capabilityId);
    const mapConnectionEntries = libraryConnections.flatMap(({ item }) => (item.frameworkLinks ?? [])
        .filter((link) => link.framework === "technology-map")
        .map((link) => {
            const methodology = window.TECHNICAL_ASSET_FRAMEWORKS?.technologyMap?.methodologies
                ?.find((candidate) => candidate.id === link.targetId);
            return [link.targetId, methodology?.label ?? link.targetId];
        }));
    const mapConnections = [...new Map(mapConnectionEntries).values()];

    content.innerHTML = `
        <div class="learning-detail-shell">
            <button type="button" class="learning-detail-close" id="learning-detail-close" aria-label="역량 상세 닫기">
                <i class="bx bx-x" aria-hidden="true"></i>
            </button>
            <header class="learning-detail-header">
                <span class="learning-detail-kicker">Learning Path</span>
                <p>${escapeHtml(family.label)}</p>
                <h2 id="learning-detail-title">${escapeHtml(placement.label ?? node.label)}</h2>
                <div class="learning-detail-chips" aria-label="역량 적용 정보">
                    <span class="learning-detail-chip is-stage">${escapeHtml(stage?.label ?? placement.stageId)}</span>
                    ${partDetailTokens}
                    <span class="learning-detail-chip is-requirement is-${escapeHtml(requirement)}">${escapeHtml(learningRequirementLabels[requirement])}</span>
                    ${channels.map((channel) => `<span class="learning-detail-chip is-channel is-${escapeHtml(channel)}">${escapeHtml(learningEducationChannelLabels[channel])}</span>`).join("")}
                </div>
            </header>

            <div class="learning-detail-grid">
                <div class="learning-detail-primary">
                    <section class="learning-detail-section">
                        <span class="learning-detail-section-label">역량 설명</span>
                        <p>${escapeHtml(details.definition ?? family.description)}</p>
                    </section>
                    <section class="learning-detail-section is-performance">
                        <span class="learning-detail-section-label">기대 수행</span>
                        <p>${escapeHtml(details.expectedPerformance ?? "이 역량과 연결된 Library 자료를 확인해 기대 수행을 구체화합니다.")}</p>
                    </section>
                    ${parentLabels.length ? `
                        <section class="learning-detail-section">
                            <span class="learning-detail-section-label">연관 역량</span>
                            <div class="learning-detail-related">${parentLabels.map((label) => `<span>${escapeHtml(label)}</span>`).join("")}</div>
                        </section>
                    ` : ""}
                    ${mapConnections.length ? `
                        <section class="learning-detail-section">
                            <span class="learning-detail-section-label">관련 Technology Map</span>
                            <div class="learning-detail-related">${mapConnections.map((label) => `<span>${escapeHtml(label)}</span>`).join("")}</div>
                        </section>
                    ` : ""}
                </div>

                <aside class="learning-detail-library">
                    <div class="learning-detail-library-heading">
                        <div>
                            <span>RELATED LIBRARY</span>
                            <h3>이 역량에서 확인할 자료</h3>
                        </div>
                        <strong>${libraryConnections.length}</strong>
                    </div>
                    ${renderLearningLibrarySections(libraryConnections)}
                </aside>
            </div>
        </div>
    `;
    return true;
}

function openLearningCapabilityDetail(capabilityId, stageId, trigger) {
    const dialog = document.getElementById("learning-detail-dialog");
    if (!dialog || !renderLearningCapabilityDetail(capabilityId, stageId)) return;
    learningDetailReturnFocus = trigger;
    document.body.classList.add("learning-detail-open");
    if (!dialog.open) dialog.showModal();
    window.setTimeout(() => document.getElementById("learning-detail-close")?.focus({ preventScroll: true }), 0);
}

function closeLearningCapabilityDetail() {
    const dialog = document.getElementById("learning-detail-dialog");
    if (dialog?.open) dialog.close();
}

function bindLearningCapabilityDetails() {
    const wrap = document.getElementById("tech-tree");
    const dialog = document.getElementById("learning-detail-dialog");
    if (wrap && wrap.dataset.learningDetailBound !== "true") {
        wrap.dataset.learningDetailBound = "true";
        wrap.addEventListener("click", (event) => {
            const trigger = event.target.closest("[data-capability-id][data-stage-id]");
            if (!trigger) return;
            openLearningCapabilityDetail(trigger.dataset.capabilityId, trigger.dataset.stageId, trigger);
        });
    }
    if (dialog && dialog.dataset.learningDetailBound !== "true") {
        dialog.dataset.learningDetailBound = "true";
        dialog.addEventListener("click", (event) => {
            if (event.target === dialog || event.target.closest("#learning-detail-close")) closeLearningCapabilityDetail();
        });
        dialog.addEventListener("close", () => {
            document.body.classList.remove("learning-detail-open");
            const returnTarget = learningDetailReturnFocus;
            learningDetailReturnFocus = null;
            window.setTimeout(() => returnTarget?.isConnected && returnTarget.focus({ preventScroll: true }), 0);
        });
    }
}

function renderLearningCapabilityMap() {
    const wrap = document.getElementById("tech-tree");
    if (!wrap) return;

    const stageHeaders = learningCareerStages.map((stage) => `
        <div class="learning-map-stage-head">${escapeHtml(stage.label)}</div>
    `).join("");

    const familyRows = learningCapabilityFamilies.map((family) => {
        const stageCells = learningCareerStages.map((stage) => {
            const entries = family.nodes.flatMap((node) => (
                node.placements
                    .filter((placement) => placement.stageId === stage.id)
                    .map((placement) => ({ node, placement }))
            ));
            return `
                <div class="learning-route-stage" data-stage-label="${escapeHtml(stage.label)}">
                    ${entries.length > 0
                        ? `<div class="learning-capability-list">${entries.map(({ node, placement }) => renderLearningCapabilityNode(node, placement)).join("")}</div>`
                        : `<span class="learning-route-empty" aria-label="확인된 항목 없음">—</span>`}
                </div>
            `;
        }).join("");

        return `
            <section class="learning-route" data-family-id="${escapeHtml(family.id)}" aria-labelledby="learning-family-${escapeHtml(family.id)}">
                <header class="learning-route-label">
                    <h3 id="learning-family-${escapeHtml(family.id)}">${escapeHtml(family.label)}</h3>
                    <p>${escapeHtml(family.description)}</p>
                    ${Array.isArray(family.mapCategories) && family.mapCategories.length > 0
                        ? `<div class="learning-route-taxonomy" aria-label="Technology Map 분류">
                            ${family.mapCategories.map((category) => `<span>${escapeHtml(category)}</span>`).join("")}
                        </div>`
                        : ""}
                </header>
                ${stageCells}
            </section>
        `;
    }).join("");

    const selectedLabel = learningPathState.selectedPart === "all"
        ? "전체 파트"
        : `${learningPathState.selectedPart}파트 강조`;
    const selectedRequirementLabel = learningPathState.selectedRequirement === "all"
        ? "전체 이수 구분"
        : `${learningRequirementLabels[learningPathState.selectedRequirement]} 항목`;
    const selectedChannelLabel = learningPathState.selectedChannel === "all"
        ? "전체 교육 채널"
        : `${learningEducationChannelLabels[learningPathState.selectedChannel]} 교육 채널`;
    wrap.setAttribute("aria-label", `${selectedLabel}, ${selectedRequirementLabel}, ${selectedChannelLabel} 역량 계열별 Learning Path`);
    wrap.innerHTML = `
        <div class="learning-map-head" aria-hidden="true">
            <div class="learning-map-corner">팀 역량 계열</div>
            ${stageHeaders}
        </div>
        ${familyRows}
    `;
}

function renderLearningPartBadges(parts) {
    return `
        <div class="learning-part-badges" aria-label="해당 파트">
            ${parts.map((part) => `<span class="learning-part-badge">P${part}</span>`).join("")}
        </div>
    `;
}

function renderLearningTrackNode(track) {
    const scopeClass = track.parts.length > 1 ? "is-shared" : "is-part";
    const body = track.items.length > 0
        ? `<ul class="learning-node-items">${track.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
        : `<div class="learning-empty-state"><i class="bx bx-info-circle"></i><span>${escapeHtml(track.emptyMessage)}</span></div>`;

    return `
        <article class="learning-node ${scopeClass}">
            <div class="learning-node-head">
                <div>
                    <h4 class="learning-node-title">${escapeHtml(track.title)}</h4>
                    <p class="learning-node-meta">${escapeHtml(track.source)}</p>
                </div>
                ${renderLearningPartBadges(track.parts)}
            </div>
            ${body}
        </article>
    `;
}

function getVisibleLearningTracks(stageId) {
    return learningPartTracks.filter((track) => {
        if (track.stageId !== stageId) return false;
        if (learningPathState.selectedPart === "all") return true;
        return track.parts.includes(Number(learningPathState.selectedPart));
    });
}

function renderLearningTreeFlow() {
    const wrap = document.getElementById("tech-tree");
    if (!wrap) return;

    const commonStage = `
        <section class="learning-stage-column is-common" aria-labelledby="learning-stage-common">
            <header class="learning-stage-head">
                <span class="learning-stage-kicker">START</span>
                <h3 id="learning-stage-common">팀 공통 기반</h3>
                <span class="learning-stage-count">${learningCommonFoundation.items.length}개 역량</span>
            </header>
            <div class="learning-stage-body">
                <article class="learning-node is-team">
                    <div class="learning-node-head">
                        <div>
                            <h4 class="learning-node-title">${escapeHtml(learningCommonFoundation.title)}</h4>
                            <p class="learning-node-meta">${escapeHtml(learningCommonFoundation.source)}</p>
                        </div>
                        ${renderLearningPartBadges([1, 2, 3, 4, 5])}
                    </div>
                    <ul class="learning-node-items">
                        ${learningCommonFoundation.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
                    </ul>
                </article>
            </div>
        </section>
    `;

    const careerStages = learningCareerStages.map((stage) => {
        const tracks = getVisibleLearningTracks(stage.id);
        return `
            <section class="learning-stage-column" aria-labelledby="learning-stage-${stage.id}">
                <header class="learning-stage-head">
                    <span class="learning-stage-kicker">경력 구간</span>
                    <h3 id="learning-stage-${stage.id}">${escapeHtml(stage.label)}</h3>
                    <span class="learning-stage-count">${tracks.length}개 트랙</span>
                </header>
                <div class="learning-stage-body">
                    ${tracks.length > 0
                        ? tracks.map(renderLearningTrackNode).join("")
                        : `<div class="learning-empty-state"><i class="bx bx-info-circle"></i><span>선택한 파트의 확인된 항목이 없습니다.</span></div>`}
                </div>
            </section>
        `;
    }).join("");

    const selectedLabel = learningPathState.selectedPart === "all"
        ? "전체 파트"
        : `${learningPathState.selectedPart}파트`;
    wrap.setAttribute("aria-label", `${selectedLabel} Learning Path. 팀 공통 기반부터 1~2년, 3~5년, 5년 이상 순서입니다.`);
    wrap.innerHTML = commonStage + careerStages;
}

function renderLearningOverlapMatrix() {
    const wrap = document.getElementById("learning-overlap-matrix");
    if (!wrap) return;
    const visibleCapabilities = learningSharedCapabilities.filter((capability) => {
        if (learningPathState.selectedPart === "all") return true;
        return capability.parts.includes(Number(learningPathState.selectedPart));
    });

    wrap.setAttribute("role", "table");
    wrap.setAttribute("aria-label", "파트 간 공유 역량 매트릭스");
    wrap.innerHTML = `
        <div class="learning-overlap-head" role="row">
            <span role="columnheader">공유 역량</span>
            ${[1, 2, 3, 4, 5].map((part) => `<span role="columnheader">P${part}</span>`).join("")}
        </div>
        ${visibleCapabilities.map((capability) => `
            <div class="learning-overlap-row" role="row">
                <strong class="learning-overlap-name" role="rowheader">${escapeHtml(capability.title)}</strong>
                ${[1, 2, 3, 4, 5].map((part) => {
                    const included = capability.parts.includes(part);
                    return `<span class="learning-overlap-part${included ? " is-included" : ""}" role="cell" aria-label="${part}파트 ${included ? "포함" : "미포함"}">${included ? "✓" : "–"}</span>`;
                }).join("")}
            </div>
        `).join("")}
    `;
}

function renderLearningChannelChip(channelId) {
    const channel = learningChannelMeta[channelId] ?? learningChannelMeta.unknown;
    return `<span class="learning-channel-chip ${channel.className}"><i class="${channel.icon}"></i>${escapeHtml(channel.label)}</span>`;
}

function renderLearningEducationGrid() {
    const wrap = document.getElementById("learning-education-grid");
    if (!wrap) return;
    wrap.innerHTML = learningEducationGroups.map((group) => `
        <article class="learning-education-card">
            <div class="learning-education-head">
                ${renderLearningChannelChip(group.id)}
                <strong>${escapeHtml(group.status)}</strong>
            </div>
            <p class="learning-node-meta">${escapeHtml(group.source)}</p>
            ${group.items.length > 0
                ? `<ul class="learning-education-list">${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
                : `<div class="learning-empty-state"><i class="bx bx-help-circle"></i><span>연결된 과정이 아직 확인되지 않았습니다.</span></div>`}
            <p class="learning-education-note">${escapeHtml(group.note)}</p>
        </article>
    `).join("");
}

function renderLearningUncertaintyList() {
    const wrap = document.getElementById("learning-uncertainty-list");
    if (!wrap) return;
    wrap.innerHTML = learningUncertaintyGroups.map((group) => `
        <section class="learning-uncertainty-group">
            <h3>${escapeHtml(group.title)}</h3>
            <ul>${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        </section>
    `).join("");
}

function updateLearningPartButtons() {
    document.querySelectorAll("[data-learning-part]").forEach((button) => {
        const active = button.dataset.learningPart === learningPathState.selectedPart;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
    });
}

function bindLearningPartButtons() {
    document.querySelectorAll("[data-learning-part]").forEach((button) => {
        if (button.dataset.learningBound === "true") return;
        button.dataset.learningBound = "true";
        button.addEventListener("click", () => {
            const nextPart = button.dataset.learningPart;
            if (!["all", "1", "2", "3", "4", "5"].includes(nextPart)) return;
            learningPathState.selectedPart = nextPart;
            updateLearningPartButtons();
            renderLearningCapabilityMap();
        });
    });
}

function updateLearningRequirementButtons() {
    document.querySelectorAll("[data-learning-requirement]").forEach((button) => {
        const active = button.dataset.learningRequirement === learningPathState.selectedRequirement;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
    });
}

function bindLearningRequirementButtons() {
    document.querySelectorAll("[data-learning-requirement]").forEach((button) => {
        if (button.dataset.learningBound === "true") return;
        button.dataset.learningBound = "true";
        button.addEventListener("click", () => {
            const nextRequirement = button.dataset.learningRequirement;
            if (!["all", "required", "optional"].includes(nextRequirement)) return;
            learningPathState.selectedRequirement = nextRequirement;
            updateLearningRequirementButtons();
            renderLearningCapabilityMap();
        });
    });
}

function updateLearningChannelButtons() {
    document.querySelectorAll("[data-learning-channel]").forEach((button) => {
        const active = button.dataset.learningChannel === learningPathState.selectedChannel;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
    });
}

function bindLearningChannelButtons() {
    document.querySelectorAll("[data-learning-channel]").forEach((button) => {
        if (button.dataset.learningBound === "true") return;
        button.dataset.learningBound = "true";
        button.addEventListener("click", () => {
            const nextChannel = button.dataset.learningChannel;
            if (!["all", "team", "internal", "external"].includes(nextChannel)) return;
            learningPathState.selectedChannel = nextChannel;
            updateLearningChannelButtons();
            renderLearningCapabilityMap();
        });
    });
}

function renderTechTree() {
    renderLearningCapabilityMap();
    updateLearningPartButtons();
    updateLearningRequirementButtons();
    updateLearningChannelButtons();
    bindLearningPartButtons();
    bindLearningRequirementButtons();
    bindLearningChannelButtons();
    bindLearningCapabilityDetails();
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
        const assetId = new URLSearchParams(window.location.search).get("asset");
        if (assetId && libraryItems.some((item) => item.id === assetId)) {
            window.requestAnimationFrame(() => openFullDetail(assetId));
        }
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
