const technologyDomains = [
    { id: "deformation", label: "01. 변형", description: "형상 안정성, warpage, 구조 변형, 공정 조건 변화에 따른 치수/응력 판단" },
    { id: "delamination", label: "02. 박리", description: "계면 박리, 접착/층간 취약 조건, 파단면/실험 피드백 기반 판단" },
    { id: "impact", label: "03. 충격", description: "Drop, 충격 취약부, 접촉/재료 비선형, 평가 조건과 연결되는 구조 리스크" },
    { id: "thermal-flow", label: "04. 열유동", description: "온도장, 열-구조 연계, 유동/공정 조건이 구조 판단에 미치는 영향" },
    { id: "fatigue", label: "05. 피로", description: "반복 하중, 열사이클, 손상 누적, 수명 예측과 신뢰성 판단" },
    { id: "vibration", label: "06. 진동", description: "모드, 가진 조건, 동특성, 설계 취약 조건과 실험 비교" },
    { id: "other", label: "07. 기타", description: "복합 Domain, AI/자동화, 공통 기준, 교육/운영 자산" }
];

const auxiliaryTags = [
    "AI 연계",
    "타 Domain 연계",
    "공정 연계",
    "신뢰성 연계",
    "소재/물성 연계",
    "실험/평가 연계",
    "고객/사업부 대응",
    "교육/온보딩"
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
    "작성중": { className: "draft", icon: "bx bx-pencil" },
    "검토중": { className: "review", icon: "bx bx-search-alt" },
    "등록완료": { className: "ready", icon: "bx bx-check-circle" },
    "보완필요": { className: "need", icon: "bx bx-error-circle" }
};

const libraryItems = [
    {
        id: "bp-deformation-warpage",
        title: "박막 적층 구조 변형 예측 BP",
        type: "BP",
        domain: "deformation",
        status: "등록완료",
        owner: "1파트",
        tags: ["공정 연계", "소재/물성 연계", "교육/온보딩"],
        summary: "공정 조건 변경 전 변형 리스크를 비교하고 허용 가능한 설계/공정 선택지를 좁힌 대표 사례입니다.",
        useCase: "유사 적층 구조 검토, 변형량 상대 비교, 물성 민감도 검토를 시작할 때 참고합니다.",
        contents: "문제 정의, 모델링 기준, 물성/경계조건, 결과 해석, 의사결정 반영, 재사용 조건",
        links: [{ label: "BP 문서", href: "#" }, { label: "모델 폴더", href: "#" }, { label: "검토 코멘트", href: "#" }]
    },
    {
        id: "cor-proposal-delamination",
        title: "계면 박리 CoR 과제 제안서",
        type: "CoR 제안서",
        domain: "delamination",
        status: "검토중",
        owner: "2파트",
        tags: ["소재/물성 연계", "고객/사업부 대응"],
        summary: "계면 취약 조건을 구조적으로 설명하기 위해 CoR 과제로 제안한 배경, 범위, 기대 산출물을 담습니다.",
        useCase: "문제 정의가 아직 불명확한 박리 이슈를 과제화할 때 제안서 구조와 질문을 참고합니다.",
        contents: "Pain Point, 과제 범위, 필요한 물성/실험 데이터, 예상 모델링 접근, 판단 기준 후보",
        links: [{ label: "제안서", href: "#" }, { label: "관련 회의록", href: "#" }]
    },
    {
        id: "cor-report-impact",
        title: "Drop 충격 취약부 CoR 결과 보고서",
        type: "CoR 보고서",
        domain: "impact",
        status: "작성중",
        owner: "3파트",
        tags: ["신뢰성 연계", "실험/평가 연계", "고객/사업부 대응"],
        summary: "충격 조건별 취약부와 설계안 차이를 비교하고 평가 전 검토 우선순위를 정리한 보고서입니다.",
        useCase: "충격 관련 요청이 들어왔을 때 기존 조건, 비교 항목, 결과 해석 프레임을 빠르게 확인합니다.",
        contents: "CoR 범위, 해석 조건, 취약부 비교, 실험/평가 연결, 권고안, 후속 과제",
        links: [{ label: "결과 보고서", href: "#" }, { label: "결과 비교표", href: "#" }]
    },
    {
        id: "vd-request-thermal",
        title: "열유동-구조 연계 VD Request 결과",
        type: "VD Request 결과",
        domain: "thermal-flow",
        status: "초안",
        owner: "공통",
        tags: ["AI 연계", "타 Domain 연계", "공정 연계"],
        summary: "열유동 결과를 구조 해석 입력으로 전환할 때 필요한 온도장, 시간축, 보수성 기준을 정리합니다.",
        useCase: "다른 Domain 결과를 받아 구조 판단으로 전환할 때 누락하기 쉬운 확인 항목을 점검합니다.",
        contents: "요청 배경, 입력 데이터, 전달 규칙, mesh/시간축 변환, 한계와 주의점",
        links: [{ label: "VD Request 결과", href: "#" }, { label: "데이터 변환 예시", href: "#" }]
    },
    {
        id: "tool-manual-vibration",
        title: "진동 모드 검토 Tool Manual",
        type: "Tool Manual",
        domain: "vibration",
        status: "검토중",
        owner: "1파트",
        tags: ["실험/평가 연계", "교육/온보딩"],
        summary: "모드 해석 세팅, 실험 모드 비교, 경계조건 민감도 검토 순서를 정리한 도구 매뉴얼입니다.",
        useCase: "신규 인원이 진동 모델을 처음 세팅하거나 기존 결과를 재현할 때 사용합니다.",
        contents: "입력 파일 준비, 해석 실행, 결과 확인, 실험 비교, 자주 틀리는 설정",
        links: [{ label: "Tool Manual", href: "#" }, { label: "예제 모델", href: "#" }]
    },
    {
        id: "training-fatigue",
        title: "열사이클 피로 기본 교육 자료",
        type: "교육자료",
        domain: "fatigue",
        status: "보완필요",
        owner: "2파트",
        tags: ["신뢰성 연계", "소재/물성 연계", "교육/온보딩"],
        summary: "피로 수명 검토를 절대값 예측이 아니라 조건별 상대 비교와 한계 표시 관점에서 학습하는 자료입니다.",
        useCase: "팀 교육 과정 전후로 기본 개념, 입력값, 결과 해석의 주의점을 확인합니다.",
        contents: "피로 기본 개념, 열사이클 조건, 물성 입력, 손상 가정, 결과 해석 예제",
        links: [{ label: "교육 자료", href: "#" }, { label: "연습 문제", href: "#" }]
    },
    {
        id: "manual-ai-search",
        title: "AI 기반 기술자산 검색/요약 가이드",
        type: "Tool Manual",
        domain: "other",
        status: "초안",
        owner: "공통",
        tags: ["AI 연계", "타 Domain 연계", "교육/온보딩"],
        summary: "기존 BP, CoR 보고서, Tool Manual을 빠르게 찾고 요약할 때 사용할 검색 키워드와 검증 기준입니다.",
        useCase: "내부 링크가 많아진 뒤에도 필요한 자산을 찾고, 요약 결과를 그대로 믿지 않도록 검증합니다.",
        contents: "검색 키워드 규칙, 요약 프롬프트, 보안 주의, 결과 검증 체크리스트",
        links: [{ label: "검색 가이드", href: "#" }, { label: "요약 예시", href: "#" }]
    },
    {
        id: "vd-request-other",
        title: "복합 Domain VD Request 결과 정리",
        type: "VD Request 결과",
        domain: "other",
        status: "초안",
        owner: "공통",
        tags: ["타 Domain 연계", "고객/사업부 대응"],
        summary: "여러 기술영역이 걸친 요청 결과를 한 기술 Map에 억지로 넣지 않고 복합 과제로 기록합니다.",
        useCase: "기술영역이 애매한 요청을 분류하거나, 타 Domain과의 협업 흔적을 남길 때 사용합니다.",
        contents: "요청 배경, 관련 Domain, 사용 데이터, 의사결정 질문, 후속 연결",
        links: [{ label: "결과 정리", href: "#" }, { label: "관련 자료", href: "#" }]
    }
];

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
const filters = { search: "", domain: "all", tag: "all", type: "all", status: "all", link: "all" };
let selectedItemId = null;

function getUniqueValues(key) {
    return [...new Set(libraryItems.map((item) => item[key]))].sort((a, b) => a.localeCompare(b, "ko"));
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

function renderMetrics() {
    setText("metric-total", libraryItems.length);
    setText("metric-domain", technologyDomains.length);
    setText("metric-linked", libraryItems.filter((item) => item.tags.includes("AI 연계") || item.tags.includes("타 Domain 연계")).length);
    setText("metric-stage", techTreeStages.length);
    setText("metric-culture", cultureRecords.length);
}

function createChip(label, isActive, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.textContent = label;
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

function getFilteredLibraryItems() {
    const keyword = filters.search.trim().toLowerCase();
    return libraryItems.filter((item) => {
        const haystack = [
            item.title,
            item.type,
            item.status,
            item.owner,
            domainById[item.domain]?.label,
            item.summary,
            item.useCase,
            item.contents,
            ...item.tags
        ].join(" ").toLowerCase();

        return (!keyword || haystack.includes(keyword))
            && (filters.domain === "all" || item.domain === filters.domain)
            && (filters.tag === "all" || item.tags.includes(filters.tag))
            && (filters.type === "all" || item.type === filters.type)
            && (filters.status === "all" || item.status === filters.status)
            && (filters.link === "all" || item.tags.includes(filters.link));
    });
}

function renderFilterChips() {
    const domainWrap = document.getElementById("domain-chips");
    const tagWrap = document.getElementById("tag-chips");
    if (!domainWrap || !tagWrap) return;

    domainWrap.innerHTML = "";
    domainWrap.appendChild(createChip("전체", filters.domain === "all", () => {
        filters.domain = "all";
        renderLibrary();
    }));
    technologyDomains.forEach((domain) => {
        domainWrap.appendChild(createChip(domain.label, filters.domain === domain.id, () => {
            filters.domain = domain.id;
            renderLibrary();
        }));
    });

    tagWrap.innerHTML = "";
    tagWrap.appendChild(createChip("태그 전체", filters.tag === "all", () => {
        filters.tag = "all";
        renderLibrary();
    }));
    auxiliaryTags.forEach((tag) => {
        tagWrap.appendChild(createChip(tag, filters.tag === tag, () => {
            filters.tag = tag;
            renderLibrary();
        }));
    });
}

function renderLibrary() {
    renderFilterChips();
    const list = document.getElementById("asset-list");
    if (!list) return;

    const items = getFilteredLibraryItems();
    list.innerHTML = "";

    if (!items.length) {
        selectedItemId = null;
        list.innerHTML = `<div class="detail-empty"><strong>조건에 맞는 자료가 없습니다.</strong><p>검색어 또는 필터를 줄여 다시 확인하세요.</p></div>`;
        renderDetail(null);
        return;
    }

    if (!selectedItemId || !items.some((item) => item.id === selectedItemId)) {
        selectedItemId = items[0].id;
    }

    items.forEach((item) => {
        const status = statusMeta[item.status] ?? statusMeta["초안"];
        const card = document.createElement("article");
        card.className = `asset-card${item.id === selectedItemId ? " active" : ""}`;
        card.tabIndex = 0;
        card.innerHTML = `
            <div class="asset-top">
                <div class="badge-row">
                    <span class="badge domain">${domainById[item.domain].label}</span>
                    <span class="badge">${item.type}</span>
                </div>
                <span class="badge ${status.className}"><i class="${status.icon}"></i>${item.status}</span>
            </div>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            <div class="badge-row" style="margin-top: 0.8rem;">${item.tags.map((tag) => `<span class="badge">${tag}</span>`).join("")}</div>
            <div class="asset-footer">
                <span><i class="bx bx-user"></i> ${item.owner}</span>
                <span>${item.links.length} links <i class="bx bx-link-external"></i></span>
            </div>
        `;
        card.addEventListener("click", () => selectItem(item.id));
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selectItem(item.id);
            }
        });
        list.appendChild(card);
    });

    renderDetail(libraryItems.find((item) => item.id === selectedItemId));
}

function selectItem(itemId) {
    selectedItemId = itemId;
    renderLibrary();
}

function renderDetail(item) {
    const panel = document.getElementById("detail-panel");
    if (!panel) return;
    if (!item) {
        panel.innerHTML = `<div class="detail-empty"><strong>자료를 선택하세요.</strong><p>왼쪽 카드에서 자료를 누르면 활용 목적, 포함 내용, 내부 링크 placeholder를 확인할 수 있습니다.</p></div>`;
        return;
    }

    const status = statusMeta[item.status] ?? statusMeta["초안"];
    panel.innerHTML = `
        <div class="badge-row">
            <span class="badge domain">${domainById[item.domain].label}</span>
            <span class="badge">${item.type}</span>
            <span class="badge ${status.className}"><i class="${status.icon}"></i>${item.status}</span>
        </div>
        <h2 style="font-size: 1.25rem; line-height: 1.28; margin: 0.85rem 0 0.6rem;">${item.title}</h2>
        <div class="detail-list">
            <div class="detail-item"><span>요약</span><strong>${item.summary}</strong></div>
            <div class="detail-item"><span>활용 상황</span><strong>${item.useCase}</strong></div>
            <div class="detail-item"><span>포함 내용</span><strong>${item.contents}</strong></div>
        </div>
        <div class="badge-row">${item.tags.map((tag) => `<span class="badge">${tag}</span>`).join("")}</div>
        <div style="display: grid; gap: 0.5rem; margin-top: 1rem;">
            ${item.links.map((link) => `<a class="btn btn-secondary" href="${link.href}" onclick="return false;" title="내부 환경에서 실제 링크로 교체"><i class="bx bx-link-alt"></i>${link.label}</a>`).join("")}
        </div>
    `;
}

function renderTypeSummary() {
    const wrap = document.getElementById("type-summary");
    if (!wrap) return;
    wrap.innerHTML = "";
    getUniqueValues("type").forEach((type) => {
        const count = libraryItems.filter((item) => item.type === type).length;
        const card = document.createElement("article");
        card.className = "guide-card";
        card.innerHTML = `<h3>${type}</h3><p>${count}개 샘플. 실제 운영에서는 각 유형별 내부 링크와 작성 기준을 붙입니다.</p>`;
        wrap.appendChild(card);
    });
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
    initSelect("type-filter", getUniqueValues("type"), "자료 유형 전체");
    initSelect("status-filter", getUniqueValues("status"), "상태 전체");
    initSelect("link-filter", ["AI 연계", "타 Domain 연계"], "연계 전체");

    const params = new URLSearchParams(window.location.search);
    const domainParam = params.get("domain");
    if (domainParam && domainById[domainParam]) filters.domain = domainParam;

    document.getElementById("search-input")?.addEventListener("input", (event) => {
        filters.search = event.target.value;
        renderLibrary();
    });
    document.getElementById("type-filter")?.addEventListener("change", (event) => {
        filters.type = event.target.value;
        renderLibrary();
    });
    document.getElementById("status-filter")?.addEventListener("change", (event) => {
        filters.status = event.target.value;
        renderLibrary();
    });
    document.getElementById("link-filter")?.addEventListener("change", (event) => {
        filters.link = event.target.value;
        renderLibrary();
    });
    document.getElementById("reset-filters")?.addEventListener("click", () => {
        filters.search = "";
        filters.domain = "all";
        filters.tag = "all";
        filters.type = "all";
        filters.status = "all";
        filters.link = "all";
        document.getElementById("search-input").value = "";
        ["type-filter", "status-filter", "link-filter"].forEach((id) => { document.getElementById(id).value = "all"; });
        renderLibrary();
    });
}

function initPage() {
    const page = document.body.dataset.page;
    renderMetrics();

    if (page === "library") {
        bindLibraryEvents();
        renderTypeSummary();
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
