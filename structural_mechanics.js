const pageMeta = {
    "objective-section": {
        title: "Leader Objective",
        subtitle: "구조역학 Simulation 팀장이 가져야 할 판단 능력의 목표선"
    },
    "roadmap-section": {
        title: "12-Week Learning Plan",
        subtitle: "Abaqus와 HyperMesh를 리더십 리뷰 능력 중심으로 학습하는 12주 계획"
    },
    "workflow-section": {
        title: "Abaqus + HyperMesh Workflow",
        subtitle: "외부 요구를 계산 전략으로 번역하고 결과를 의사결정 자료로 만드는 흐름"
    },
    "review-section": {
        title: "Review Checklist",
        subtitle: "실무자가 가져온 모델을 검토할 때 반드시 확인할 질문 세트"
    },
    "cases-section": {
        title: "Capstone Cases",
        subtitle: "팀장 관점의 판단 능력을 검증하기 위한 실습 케이스"
    },
    "terms-section": {
        title: "Key Terms",
        subtitle: "팀원과 정확히 같은 언어로 토론하기 위해 먼저 잡아야 할 개념"
    },
    "prompt-section": {
        title: "NotebookLM Prompt",
        subtitle: "다음 조사 루프에서 사용할 Deep Research용 시작 프롬프트"
    }
};

const leaderCards = [
    {
        icon: "bx-radar",
        title: "팀장 역할의 중심",
        body: "직접 모델을 가장 빨리 만드는 것이 아니라, 해석 목적과 모델 가정, 수치 리스크, 의사결정 가능 범위를 정리하는 사람입니다.",
        signals: [
            "외부 요구를 failure mode와 simulation question으로 바꾼다.",
            "Abaqus/HyperMesh 선택과 해석 workflow가 문제에 맞는지 묻는다.",
            "결과 그림보다 reaction, energy, convergence, correlation evidence를 먼저 본다."
        ]
    },
    {
        icon: "bx-target-lock",
        title: "알아야 할 최소 깊이",
        body: "element, material, contact, boundary condition, nonlinear step, solver log를 읽고 모델의 약한 연결고리를 토론할 수 있어야 합니다.",
        signals: [
            "Standard와 Explicit의 선택 이유를 설명할 수 있다.",
            "mesh convergence와 singularity를 구분할 수 있다.",
            "경계조건이 실제 load path를 왜곡하는지 질문할 수 있다."
        ]
    },
    {
        icon: "bx-low-vision",
        title: "깊게 안 해도 되는 영역",
        body: "모든 GUI 조작, 모든 deck option, 모든 contact parameter를 암기할 필요는 없습니다. 다만 그 옵션이 필요한 상황과 검증 질문은 알아야 합니다.",
        signals: [
            "버튼 위치보다 input deck의 구조를 읽는 능력을 우선한다.",
            "UMAT/VUMAT을 직접 구현하기보다 언제 필요한지 판단한다.",
            "HyperMesh 작업 속도보다 mesh quality 기준을 리뷰한다."
        ]
    },
    {
        icon: "bx-conversation",
        title: "팀원과의 좋은 토론 기준",
        body: "정답을 바로 주는 것이 아니라, 실무자가 가진 현장 지식을 더 날카롭게 꺼내는 질문을 던지는 것이 목표입니다.",
        signals: [
            "이 결과를 믿어도 되는 가장 강한 근거는 무엇인가?",
            "이 모델이 현실을 가장 크게 단순화한 지점은 어디인가?",
            "의사결정에 쓰기 전에 하나만 더 검증한다면 무엇인가?"
        ]
    }
];

const foundationEquations = [
    {
        title: "응력: 하중이 단면에 남기는 세기",
        formulaHtml: `
            <span>&sigma;</span>
            <span>=</span>
            <span class="math-frac"><span>F</span><span>A</span></span>
        `,
        readAs: "stress = force / area",
        note: "응력은 단순한 색깔값이 아니라 하중이 단면을 통해 전달되는 방식입니다. 팀장 질문은 '이 힘은 실제로 어디로 흘러가는가?'입니다."
    },
    {
        title: "변형률: 늘어난 양을 원래 길이로 나눈 값",
        formulaHtml: `
            <span>&epsilon;</span>
            <span>=</span>
            <span class="math-frac"><span>&Delta;L</span><span>L</span></span>
        `,
        readAs: "strain = length change / original length",
        note: "변형률은 재료가 국부적으로 얼마나 늘거나 줄었는지 보는 언어입니다. MD의 원자 변위 감각을 연속체 스케일로 올린 값입니다."
    },
    {
        title: "선형 탄성: 응력과 변형률의 비례 관계",
        formulaHtml: `
            <span>&sigma;</span>
            <span>=</span>
            <span>E</span>
            <span>&epsilon;</span>
        `,
        readAs: "stress = elastic modulus x strain",
        note: "선형 탄성의 가장 단순한 constitutive law입니다. 이 관계가 깨지는 순간 plasticity, damage, nonlinear material 질문이 시작됩니다."
    },
    {
        title: "FEA 균형식: 강성, 변위, 하중의 관계",
        formulaHtml: `
            <span class="math-matrix">K</span>
            <span class="math-vector">u</span>
            <span>=</span>
            <span class="math-vector">f</span>
        `,
        readAs: "stiffness matrix x displacement vector = force vector",
        note: "FEA의 기본 균형식입니다. stiffness, displacement, load의 관계를 보면 solver 결과를 그림이 아니라 방정식으로 읽게 됩니다."
    }
];

const resultLanguage = [
    {
        tag: "Stress",
        icon: "bx-pulse",
        title: "Stress는 '어디가 위험한가'의 언어",
        body: "하중이 구조 내부에서 어떤 방향과 크기로 전달되는지를 나타냅니다. 단순히 빨간색이 크다는 뜻이 아니라, 재료의 failure mode와 비교해야 의미가 생깁니다.",
        bullets: [
            "Abaqus 기본 변수: S, 전체 stress tensor.",
            "구성 성분: S11, S22, S33, S12, S13, S23.",
            "Principal stress는 SP, stress invariant는 SINV 또는 S의 invariant로 확인합니다.",
            "대표값은 Mises, Max Principal, Min Principal, Tresca, Pressure 중 failure mode에 맞게 고릅니다."
        ],
        meta: "보고서 기본값: ductile metal은 Mises, brittle/tension crack은 Max Principal, 방향성 검토는 S11/S22 같은 component."
    },
    {
        tag: "Displacement",
        icon: "bx-move",
        title: "Displacement는 '얼마나 움직였는가'의 언어",
        body: "구조물이 하중을 받은 뒤 node가 이동한 양입니다. 기능 요구사항, clearance, 조립 간섭, 변형 허용치와 직접 연결됩니다.",
        bullets: [
            "Abaqus 기본 변수: U, nodal displacement.",
            "구성 성분: U1, U2, U3, 그리고 magnitude인 U, Magnitude.",
            "beam/shell 회전 자유도가 중요하면 UR1, UR2, UR3도 같이 봅니다."
        ],
        meta: "보고서 기본값: 요구사항 방향이 있으면 해당 component, 전체 처짐이면 U magnitude와 deformed shape."
    },
    {
        tag: "Stiffness",
        icon: "bx-line-chart",
        title: "Stiffness는 '얼마나 버티는가'의 언어",
        body: "하중을 줬을 때 변위가 얼마나 생기는지의 비율입니다. Abaqus contour에 바로 나오는 일반 결과라기보다, 반력과 변위 history에서 계산하는 결과입니다.",
        bullets: [
            "선형: k = F / delta.",
            "비선형 secant stiffness: 특정 하중점에서 F / delta.",
            "비선형 tangent stiffness: load-displacement curve의 국부 기울기 dF / ddelta."
        ],
        meta: "보고서 기본값: 기준 node 또는 reference point의 U와 support/prescribed point의 RF로 load-displacement curve를 만들고 slope를 계산."
    }
];

const abaqusOutputGuide = [
    {
        tag: "S: Components",
        icon: "bx-grid-alt",
        title: "S11, S22, S33, S12, S13, S23",
        body: "좌표계 방향의 normal/shear stress입니다. 부품 좌표계, 재료 방향, weld line, fiber direction처럼 방향 자체가 의사결정 기준일 때 씁니다.",
        bullets: [
            "장점: load path와 방향성 설명이 명확합니다.",
            "주의: 좌표계가 바뀌면 의미도 바뀝니다.",
            "추천: composite, anisotropic material, 특정 방향 허용응력 검토.",
            "Abaqus 이름: S for all components, Sij for individual history components."
        ]
    },
    {
        tag: "Mises",
        icon: "bx-certification",
        title: "Von Mises Equivalent Stress",
        body: "3D stress tensor를 ductile yielding 판단용 scalar로 줄인 값입니다. 금속 구조물의 일반적인 항복 검토에서는 가장 안전한 기본 보고값입니다.",
        bullets: [
            "추천: ductile metal, plasticity, bracket/frame 일반 강도 검토.",
            "이유: hydrostatic pressure보다 distortion energy가 항복을 지배한다는 가정과 맞습니다.",
            "주의: brittle crack이나 접촉 압축 파손에는 단독 기준으로 부족합니다.",
            "Abaqus 이름: MISES, MISESONLY, shell/beam section envelope에는 MISESMAX."
        ]
    },
    {
        tag: "Max Principal",
        icon: "bx-up-arrow-alt",
        title: "Maximum Principal Stress",
        body: "한 점에서 가능한 모든 면을 돌려봤을 때 가장 큰 인장 normal stress입니다. 사용자가 자주 보는 값이며, 균열이 인장으로 열리는 문제에 특히 직관적입니다.",
        bullets: [
            "추천: brittle material, glass/ceramic, crack opening, adhesive peel, tensile failure.",
            "이유: 균열과 취성 파손은 전단보다 최대 인장 주응력에 민감한 경우가 많습니다.",
            "주의: ductile metal yielding의 기본 대표값으로 쓰면 Mises보다 판단이 흔들릴 수 있습니다.",
            "Abaqus 이름: SP for all principal stresses, SP3 for maximum principal stress history output."
        ]
    },
    {
        tag: "Min Principal",
        icon: "bx-down-arrow-alt",
        title: "Minimum Principal Stress",
        body: "가장 큰 압축 방향의 principal stress입니다. 압축, crushing, contact bearing처럼 눌림이 주요한 문제에서 봅니다.",
        bullets: [
            "추천: compressive crushing, bearing/contact pressure 주변, 콘크리트/취성재 압축 검토.",
            "이유: 최대 인장만 보면 압축 지배 failure를 놓칠 수 있습니다.",
            "주의: 부호 convention과 좌표계를 확인해야 합니다.",
            "Abaqus 이름: SP1 for minimum principal stress history output."
        ]
    },
    {
        tag: "Tresca",
        icon: "bx-cut",
        title: "Tresca / Maximum Shear 기준",
        body: "principal stress 차이로부터 최대 전단 지배를 보는 값입니다. 보수적인 ductile yielding 또는 shear-driven failure 확인에 씁니다.",
        bullets: [
            "추천: shear failure, shaft/torsion, 보수적 금속 항복 검토.",
            "이유: 최대 전단 응력이 항복을 지배한다고 보는 기준입니다.",
            "주의: 일반 금속 설계 보고에서는 Mises와 함께 비교값으로 두는 편이 읽기 쉽습니다.",
            "Abaqus 이름: TRESC."
        ]
    },
    {
        tag: "Pressure",
        icon: "bx-collapse-alt",
        title: "Hydrostatic Pressure Stress",
        body: "응력 tensor의 평균 normal stress 성분입니다. 체적 압축/팽창, 공극 성장, gasket, fluid-solid pressure 성격의 문제에서 의미가 큽니다.",
        bullets: [
            "추천: hydrostatic compression, gasket/seal, porous material, void growth risk.",
            "이유: Mises는 hydrostatic stress를 직접 failure driving force로 보지 않습니다.",
            "주의: 일반 강도 contour의 대표값으로 내보내면 사용자가 오해하기 쉽습니다.",
            "Abaqus 이름: PRESS 또는 PRESSONLY."
        ]
    }
];

const reportDecisionGuide = [
    {
        tag: "Primary Report Set",
        icon: "bx-file-find",
        title: "기본 보고 묶음",
        body: "결과 한 장에는 응력 하나만 넣지 말고, displacement와 evidence를 함께 둬야 합니다.",
        bullets: [
            "Ductile metal: Mises max/region trend + U magnitude 또는 요구 방향 U component + RF balance.",
            "Brittle/tension: Max Principal + crack/opening 방향 component + mesh sensitivity.",
            "Stiffness: RF-U curve에서 secant 또는 tangent stiffness를 명시합니다."
        ]
    },
    {
        tag: "Peak Rule",
        icon: "bx-error-circle",
        title: "최대값 하나만 보고하지 않기",
        body: "Peak stress는 singularity, sharp corner, point load, constraint 때문에 mesh를 조일수록 무한히 커질 수 있습니다.",
        bullets: [
            "최대값은 위치, averaging 여부, element/integration point 여부를 함께 적습니다.",
            "hot spot 주변 path/area average와 mesh refinement trend를 같이 봅니다.",
            "의사결정에는 peak보다 trend, margin, correlation evidence가 더 중요할 수 있습니다."
        ]
    },
    {
        tag: "Shell/Solid Rule",
        icon: "bx-layer",
        title: "Shell과 Solid의 결과 읽기 차이",
        body: "Shell은 top/bottom section point가 중요하고, solid는 3D 응력상태와 mesh 품질이 더 직접적으로 드러납니다.",
        bullets: [
            "Shell bending 문제는 top/bottom surface stress envelope를 봅니다.",
            "Solid는 local coordinate, integration point, extrapolated nodal average 차이를 확인합니다.",
            "두 모델을 비교할 때 같은 물리 위치와 같은 stress measure인지 맞춥니다."
        ]
    }
];

const foundationConcepts = [
    {
        tag: "Core Language",
        icon: "bx-transfer-alt",
        title: "Stress, Strain, Stiffness, Load Path",
        body: "1~2주차의 중심 언어입니다. stress는 결과, strain은 변형의 측도, stiffness는 저항, load path는 힘이 구조물 안에서 흘러가는 길입니다.",
        bullets: [
            "stress contour를 보기 전에 load path를 먼저 예상합니다.",
            "높은 stress가 실제 failure risk인지, singularity인지 구분합니다.",
            "stiffness가 커진다는 말이 변형, 하중 분배, 고유진동수에 어떤 의미인지 연결합니다."
        ]
    },
    {
        tag: "Discretization",
        icon: "bx-grid-alt",
        title: "Weak Form, Element, DOF",
        body: "FEA는 연속체를 element와 node의 자유도 문제로 바꿔 풉니다. 팀장은 상세 유도보다 '무엇을 이산화했는가'를 잡으면 됩니다.",
        bullets: [
            "node 값만 계산하고 element 내부는 shape function으로 보간합니다.",
            "DOF는 모델이 움직일 수 있는 수치적 자유도입니다.",
            "element 선택은 계산 편의가 아니라 물리 현상 표현력의 선택입니다."
        ]
    },
    {
        tag: "Model Idealization",
        icon: "bx-shape-square",
        title: "Beam, Shell, Solid",
        body: "같은 구조물도 어떤 element로 이상화하느냐에 따라 결과와 계산 비용이 크게 달라집니다.",
        bullets: [
            "beam은 길이 방향 거동이 지배적일 때 유리합니다.",
            "shell은 두께가 작고 면내/굽힘 거동이 중요한 구조에 적합합니다.",
            "solid는 3D 응력상태가 필요하지만 mesh 비용과 결과 해석 부담이 큽니다."
        ]
    },
    {
        tag: "Boundary Reality",
        icon: "bx-lock-alt",
        title: "Boundary Condition과 Constraint",
        body: "가장 강력하고 위험한 모델링 선택입니다. 잘못된 BC는 solver가 아니라 현실을 바꿉니다.",
        bullets: [
            "완전 고정 조건은 현실보다 구조를 과도하게 단단하게 만들 수 있습니다.",
            "하중을 force, pressure, displacement 중 무엇으로 주는지에 따라 물리 의미가 달라집니다.",
            "반력 합계와 하중 합계를 비교하는 습관을 첫 주부터 만듭니다."
        ]
    }
];

const backgroundBridges = [
    {
        tag: "DFT to FEA",
        icon: "bx-atom",
        title: "에너지 지형에서 constitutive law로",
        body: "DFT가 원자/전자 수준에서 재료의 에너지와 물성을 이해하는 창이라면, FEA는 그 물성을 연속체 constitutive law로 받아 구조 스케일의 거동을 계산합니다.",
        bullets: [
            "DFT/MD 물성은 FEA의 E, nu, CTE, plastic law로 들어옵니다.",
            "팀장 질문: 이 재료 물성은 해석 온도와 변형률 범위에서 유효한가?"
        ]
    },
    {
        tag: "MD to FEA",
        icon: "bx-network-chart",
        title: "원자 trajectory에서 연속체 field로",
        body: "MD가 원자 위치와 속도의 시간 진화를 본다면, FEA는 displacement, strain, stress field를 요소 단위로 봅니다.",
        bullets: [
            "둘 다 경계조건과 시간/길이 스케일 선택이 결과를 지배합니다.",
            "팀장 질문: 이 continuum 가정은 미세구조 효과를 무시해도 되는 스케일인가?"
        ]
    },
    {
        tag: "CFD to FEA",
        icon: "bx-water",
        title: "보존법칙과 residual 감각",
        body: "CFD에서 residual, mesh independence, boundary layer를 보듯이 FEA에서도 residual, mesh sensitivity, stress gradient를 봅니다.",
        bullets: [
            "CFD의 유량/압력 경계조건 감각은 FEA의 force/displacement/constraint 감각과 닮아 있습니다.",
            "팀장 질문: 수렴한 숫자인가, 물리적으로 균형 잡힌 해인가?"
        ]
    },
    {
        tag: "DSMC to FEA",
        icon: "bx-scatter-chart",
        title: "입자 관점에서 element 관점으로",
        body: "DSMC가 분자/입자 샘플링으로 거시 유동량을 얻는다면, FEA는 element integration으로 연속체 장을 얻습니다.",
        bullets: [
            "둘 다 sampling 또는 integration 선택이 noise와 정확도를 바꿉니다.",
            "팀장 질문: 해석 자유도와 계산 비용이 의사결정에 필요한 해상도를 만족하는가?"
        ]
    }
];

const week12Agenda = [
    {
        tag: "Week 1",
        icon: "bx-compass",
        title: "Day 1-2: 문제를 구조역학 문장으로 바꾸기",
        body: "외부 요구를 '어떤 하중에서 어떤 failure mode를 확인할 것인가'로 번역합니다.",
        bullets: [
            "관심 결과를 stress, displacement, stiffness, natural frequency, fatigue risk 중 하나로 분류합니다.",
            "하중, 지지, 접촉, 재료 비선형 중 결과를 지배할 후보를 적습니다."
        ]
    },
    {
        tag: "Week 1",
        icon: "bx-book-open",
        title: "Day 3-4: continuum mechanics 최소 복습",
        body: "응력/변형률/강성/평형을 Abaqus 결과를 읽는 언어로 정리합니다.",
        bullets: [
            "normal/shear stress, principal stress, von Mises stress의 용도를 구분합니다.",
            "plane stress, plane strain, 3D stress state가 필요한 조건을 정리합니다."
        ]
    },
    {
        tag: "Week 1",
        icon: "bx-grid",
        title: "Day 5: element와 mesh 감각 잡기",
        body: "beam, shell, solid element 선택 기준과 mesh refinement가 결과에 미치는 영향을 봅니다.",
        bullets: [
            "element type 선택 이유를 한 문장으로 말하는 연습을 합니다.",
            "stress gradient가 큰 곳과 단순히 mesh가 나쁜 곳을 분리합니다."
        ]
    },
    {
        tag: "Week 2",
        icon: "bx-ruler",
        title: "Day 6-7: cantilever benchmark",
        body: "손계산과 FEA 결과를 비교하며 FEA가 언제 믿을 만해지는지 감각을 만듭니다.",
        bullets: [
            "tip displacement를 beam theory와 비교합니다.",
            "reaction force balance와 mesh refinement trend를 기록합니다."
        ]
    },
    {
        tag: "Week 2",
        icon: "bx-donut-chart",
        title: "Day 8-9: plate with hole benchmark",
        body: "응력집중과 singularity, mesh sensitivity를 구분하는 훈련을 합니다.",
        bullets: [
            "hole 주변 stress concentration이 mesh에 따라 어떻게 바뀌는지 봅니다.",
            "peak stress를 그대로 설계 판단에 쓰면 위험한 조건을 정리합니다."
        ]
    },
    {
        tag: "Week 2",
        icon: "bx-conversation",
        title: "Day 10: 팀 리뷰 리허설",
        body: "팀원 한 명에게 같은 결과를 보여주고, 내가 던진 질문이 모델의 약한 고리를 드러내는지 확인합니다.",
        bullets: [
            "좋은 질문 10개와 부족했던 질문 5개를 기록합니다.",
            "다음 3~4주차 Abaqus 실습에서 확인할 evidence 항목을 확정합니다."
        ]
    }
];

const week12Deliverables = [
    {
        tag: "Deliverable 1",
        icon: "bx-file",
        title: "FEA Mental Model Memo",
        body: "A4 한 장으로 'FEA는 무엇을 풀고, 무엇을 가정하고, 무엇을 검증해야 하는가'를 정리합니다.",
        bullets: [
            "K u = f의 각 항을 구조역학 언어로 설명합니다.",
            "해석 결과를 신뢰하기 위한 evidence 5개를 적습니다."
        ]
    },
    {
        tag: "Deliverable 2",
        icon: "bx-table",
        title: "Element Selection Matrix",
        body: "beam/shell/solid/plane stress/plane strain을 언제 쓰고 언제 피할지 표로 만듭니다.",
        bullets: [
            "각 element idealization의 전제와 대표 리스크를 기록합니다.",
            "팀의 실제 제품/부품 예시를 하나씩 연결합니다."
        ]
    },
    {
        tag: "Deliverable 3",
        icon: "bx-line-chart",
        title: "Benchmark Result Note",
        body: "cantilever와 plate with hole 결과를 손계산, mesh sensitivity, 해석자의 판단 메모와 함께 누적합니다.",
        bullets: [
            "결과 그림보다 입력 가정과 반력/변위/응력 trend를 먼저 둡니다.",
            "다음 해석에서 재사용할 검토 포인트를 체크리스트로 뽑습니다."
        ]
    },
    {
        tag: "Deliverable 4",
        icon: "bx-message-square-detail",
        title: "Team Discussion Questions",
        body: "팀원과의 첫 구조해석 리뷰 미팅에서 사용할 질문 리스트입니다.",
        bullets: [
            "이 모델이 현실을 가장 크게 단순화한 지점은 어디인가?",
            "이 stress peak는 failure risk인가, singularity인가?",
            "현재 mesh로 의사결정 가능한 결과와 불가능한 결과는 무엇인가?"
        ]
    }
];

const roadmap = [
    {
        phase: "Weeks 1-2",
        title: "구조역학과 FEA 판단 언어 정렬",
        goal: "stress, strain, stiffness, load path, weak form, element, DOF를 팀원과 같은 언어로 말한다.",
        learn: "continuum mechanics 복습, 선형 탄성, plane stress/strain, beam/shell/solid element의 역할.",
        output: "간단한 benchmark 3개에 대해 해석 목적, 지배 가정, 예상 결과를 한 페이지로 정리.",
        detailHref: "structural_mechanics_weeks_1_2.html"
    },
    {
        phase: "Weeks 3-4",
        title: "Abaqus 기본 workflow와 evidence 읽기",
        goal: "Abaqus/CAE에서 선형 정적 모델을 만들고, .inp와 .odb가 어떤 정보를 담는지 읽는다.",
        learn: "part, property, assembly, step, interaction, load, BC, job, visualization, reaction force balance.",
        output: "cantilever, plate with hole, simple bracket 결과를 mesh refinement별로 비교."
    },
    {
        phase: "Weeks 5-6",
        title: "HyperMesh 모델 빌드와 mesh quality 리뷰",
        goal: "실무자의 HyperMesh 모델을 보고 geometry cleanup, element type, mesh quality issue를 토론한다.",
        learn: "CAD import, topology cleanup, midsurface, shell/solid mesh, connector, Abaqus solver profile, deck export.",
        output: "HyperMesh에서 Abaqus input deck로 넘기는 체크리스트 초안 작성."
    },
    {
        phase: "Weeks 7-8",
        title: "비선형 해석의 리스크 구조",
        goal: "contact, plasticity, large deformation, convergence issue가 어디에서 생기는지 구분한다.",
        learn: "Abaqus/Standard nonlinear step, increment, contact stabilization, material plasticity, convergence diagnostics.",
        output: "비선형 해석 실패 로그 3개를 원인 후보와 다음 실험으로 분류."
    },
    {
        phase: "Weeks 9-10",
        title: "동역학, Explicit, thermal stress 판단",
        goal: "quasi-static, transient, impact, thermal-structural 문제를 solver 전략으로 분기한다.",
        learn: "Abaqus/Explicit, stable time increment, mass scaling, kinetic/internal energy ratio, thermal expansion, residual stress.",
        output: "Standard와 Explicit 선택 기준표 및 thermal stress 해석 리뷰 질문 작성."
    },
    {
        phase: "Weeks 11-12",
        title: "리뷰 시스템과 팀 capstone",
        goal: "실제 팀 문제 하나를 simulation campaign으로 설계하고, 결과 리뷰 회의를 운영한다.",
        learn: "Abaqus Python scripting, 반복 실행 자동화, 결과 extraction, V&V, decision memo 작성.",
        output: "팀 표준 Simulation Review Memo v1과 capstone 발표 자료."
    }
];

const workflow = [
    {
        icon: "bx-world",
        title: "External Need",
        body: "시장, 고객, 제품 리스크를 구조역학 질문으로 번역합니다. 무엇이 깨질 수 있고, 어떤 의사결정을 내려야 하는지 먼저 고정합니다.",
        question: "우리가 알고 싶은 것은 최대 응력인가, 변형량인가, 수명인가, 접촉 안정성인가?"
    },
    {
        icon: "bx-shape-triangle",
        title: "HyperMesh Model Build",
        body: "CAD cleanup, mesh topology, element type, connector, part organization을 정리해 solver가 읽을 수 있는 모델을 만듭니다.",
        question: "이 mesh는 물리 현상을 보기 위한 mesh인가, 단지 보기 좋은 mesh인가?"
    },
    {
        icon: "bx-cog",
        title: "Abaqus Physics Setup",
        body: "material, contact, load, BC, step, nonlinear option을 실제 물리 상황에 맞게 배치합니다.",
        question: "경계조건이 실제 load path를 대체하고 있는가, 아니면 왜곡하고 있는가?"
    },
    {
        icon: "bx-line-chart",
        title: "Solve Evidence",
        body: "수렴 로그, reaction balance, energy balance, increment history, warning 메시지를 결과 그림보다 먼저 확인합니다.",
        question: "이 해석은 정상 종료되었는가, 아니면 운 좋게 숫자가 나온 것인가?"
    },
    {
        icon: "bx-file-find",
        title: "Decision Memo",
        body: "결과를 의사결정 가능한 언어로 바꿉니다. 신뢰 가능한 범위, 남은 리스크, 다음 해석을 명확히 적습니다.",
        question: "이 결과로 지금 결정할 수 있는 것과 결정하면 안 되는 것은 무엇인가?"
    }
];

const reviewGroups = [
    {
        icon: "bx-help-circle",
        title: "Problem Framing",
        questions: [
            "이 해석의 의사결정 질문이 한 문장으로 정의되어 있는가?",
            "failure mode가 명확한가: yielding, buckling, fatigue, fracture, contact slip, excessive deformation?",
            "실험, hand calculation, 이전 모델 중 비교 기준이 있는가?"
        ]
    },
    {
        icon: "bx-cube-alt",
        title: "Model Fidelity",
        questions: [
            "geometry simplification이 stress path를 바꾸지 않는가?",
            "beam, shell, solid element 선택 이유가 문제 스케일과 맞는가?",
            "material model이 실제 온도, strain rate, plasticity 범위를 대표하는가?"
        ]
    },
    {
        icon: "bx-git-branch",
        title: "Numerical Reliability",
        questions: [
            "mesh convergence 또는 최소한 mesh sensitivity가 확인되었는가?",
            "contact penetration, stabilization, hourglass, artificial energy가 관리되고 있는가?",
            "warning과 convergence issue를 해석자가 설명할 수 있는가?"
        ]
    },
    {
        icon: "bx-bar-chart-alt-2",
        title: "Result Evidence",
        questions: [
            "reaction force와 applied load가 균형을 이루는가?",
            "singularity peak와 실제 hot spot을 구분했는가?",
            "결과가 단위, 좌표계, 평균화 옵션에 민감하지 않은가?"
        ]
    },
    {
        icon: "bx-check-shield",
        title: "Decision Readiness",
        questions: [
            "현재 결과로 가능한 결정과 불가능한 결정이 분리되어 있는가?",
            "다음 실험 하나를 한다면 가장 uncertainty를 줄이는 방향인가?",
            "외부 이해관계자에게 말할 수 있는 수준의 caveat가 정리되어 있는가?"
        ]
    }
];

const capstoneCases = [
    {
        icon: "bx-ruler",
        title: "Cantilever Benchmark",
        purpose: "FEA 기본 신뢰도 감각 만들기",
        tasks: ["Euler-Bernoulli beam hand calculation과 Abaqus 결과 비교", "solid/shell/beam element 차이 확인", "mesh refinement에 따른 tip displacement와 stress peak 변화 기록"]
    },
    {
        icon: "bx-donut-chart",
        title: "Plate With Hole",
        purpose: "응력집중과 singularity 감각 만들기",
        tasks: ["stress concentration factor와 문헌값 비교", "mesh density와 stress averaging 옵션의 영향 확인", "peak stress를 설계 판단에 쓰면 위험한 조건 정리"]
    },
    {
        icon: "bx-link",
        title: "Bolted or Contact Assembly",
        purpose: "contact와 load path 리뷰 능력 확보",
        tasks: ["friction, preload, contact pressure sensitivity 확인", "수렴 실패 원인을 접촉, 강체 운동, BC 문제로 분류", "Standard 해석 로그 리뷰"]
    },
    {
        icon: "bx-thermometer",
        title: "Thermal Stress Model",
        purpose: "DFT/MD/재료 지식과 구조 해석 연결",
        tasks: ["CTE mismatch로 발생하는 응력 방향 예측", "온도장 입력 방식과 structural step 연결", "잔류응력과 외부하중 중첩 판단"]
    },
    {
        icon: "bx-bolt-circle",
        title: "Impact or Quasi-static Explicit",
        purpose: "Standard와 Explicit 선택 기준 학습",
        tasks: ["kinetic/internal energy ratio로 quasi-static 여부 확인", "mass scaling의 물리 왜곡 가능성 기록", "시간스케일과 strain rate 민감도 토론"]
    }
];

const terms = [
    {
        icon: "bx-grid-alt",
        title: "Element",
        body: "구조물을 나누는 계산 단위입니다. 팀장 관점에서는 element formulation, integration, aspect ratio가 결과 신뢰도에 어떤 영향을 주는지 묻는 것이 중요합니다."
    },
    {
        icon: "bx-lock-alt",
        title: "Boundary Condition",
        body: "현실의 지지, 구속, 하중 전달을 수학적으로 대체하는 조건입니다. 가장 흔한 오류는 해석 편의를 위해 실제 load path를 없애버리는 것입니다."
    },
    {
        icon: "bx-transfer",
        title: "Contact",
        body: "부품 사이의 닿음, 미끄러짐, 분리, 마찰을 표현합니다. 수렴 실패와 결과 민감도의 큰 원인이므로 contact pressure와 penetration을 함께 봐야 합니다."
    },
    {
        icon: "bx-loader-circle",
        title: "Convergence",
        body: "비선형 해석에서 평형 방정식을 만족하는 해를 찾는 과정입니다. 정상 종료 여부보다 residual, increment cutback, warning의 의미를 읽는 것이 더 중요합니다."
    },
    {
        icon: "bx-pulse",
        title: "Energy Balance",
        body: "특히 Explicit에서는 internal, kinetic, artificial, hourglass energy를 비교해 해석이 물리 문제를 풀고 있는지 수치 문제를 만들고 있는지 판단합니다."
    },
    {
        icon: "bx-certification",
        title: "V&V",
        body: "Verification은 방정식을 제대로 풀었는가, Validation은 현실을 제대로 대표하는가의 질문입니다. 팀장 리뷰는 늘 이 둘을 분리해서 다뤄야 합니다."
    }
];

const notebookPrompt = `NotebookLM의 Deep Research 기능을 켜고, 아래 목적에 맞춰 구조역학 Simulation 팀장용 학습 자료를 만들어줘.

목적:
나는 DFT와 MD 기반 지식이 있고, 회사에서는 CFD 팀장으로 DSMC Tool과 Boltzmann 방정식 기반 입자 유동 계산을 직접 다뤄본 경험이 있다. 이제 Abaqus와 HyperMesh를 사용하는 구조역학 Simulation 팀의 방향성을 정하고, 실무자와 깊이 있게 토론할 수 있는 수준의 전문성을 얻고 싶다.

내 목표는 Abaqus/HyperMesh의 최고 숙련자가 되는 것이 아니라, review-capable technical leader가 되는 것이다. 즉, 팀원이 만든 모델과 결과를 보고 물리 가정, 수치 리스크, 모델 신뢰도, 다음 해석 방향을 판단할 수 있어야 한다.

다음 목차로 조사하고 정리해줘.

1. 구조역학 FEA의 핵심 원리
- continuum mechanics, weak form, element, DOF, stiffness, stress/strain, load path
- DFT/MD/CFD/DSMC 경험자가 이해하기 쉬운 대응 관계

2. Abaqus 학습 우선순위
- Abaqus/CAE workflow
- input deck과 ODB에서 반드시 읽어야 할 정보
- Abaqus/Standard와 Abaqus/Explicit 선택 기준
- nonlinear, contact, plasticity, large deformation, convergence diagnostics

3. HyperMesh 학습 우선순위
- CAD cleanup, topology, midsurface, shell/solid mesh
- mesh quality 기준과 나쁜 mesh가 만드는 결과 왜곡
- Abaqus solver profile, deck export, connector, model organization

4. 팀장용 Simulation Review Checklist
- problem framing
- model fidelity
- boundary condition and load path
- mesh convergence and sensitivity
- solver log and warning
- result interpretation and decision readiness

5. 12주 학습 로드맵
- 주차별 학습 목표
- 직접 해볼 benchmark case
- 팀원과 토론해야 할 질문
- 산출물 형식

6. 반드시 피해야 할 오해
- 예쁜 contour plot을 신뢰도로 착각하는 경우
- singularity와 실제 hot spot을 혼동하는 경우
- 정상 종료를 검증 완료로 착각하는 경우
- contact stabilization, mass scaling, artificial energy를 과소평가하는 경우

7. 최종 산출물
- 팀장이 매주 누적할 learning memo template
- 해석 리뷰 회의 agenda template
- capstone simulation campaign 예시

가능하면 공식 문서와 산업 실무 관점의 키워드를 함께 제시하고, 각 항목마다 "팀장이 던질 좋은 질문"을 별도로 정리해줘.`;

function renderLeaderCards() {
    const grid = document.getElementById("leader-grid");
    grid.innerHTML = leaderCards.map(card => `
        <article class="sim-card">
            <h3><i class='bx ${card.icon}'></i>${card.title}</h3>
            <p>${card.body}</p>
            <ul class="signal-list">
                ${card.signals.map(signal => `<li>${signal}</li>`).join("")}
            </ul>
        </article>
    `).join("");
}

function renderWeek12Foundation() {
    const equationGrid = document.getElementById("foundation-equations");
    if (!equationGrid) return;

    equationGrid.innerHTML = foundationEquations.map(item => `
        <div class="equation-box">
            <h3>${item.title}</h3>
            <div class="math-formula">${item.formulaHtml}</div>
            <div class="math-read">${item.readAs}</div>
            <p>${item.note}</p>
        </div>
    `).join("");

    const resultGrid = document.getElementById("result-language");
    resultGrid.innerHTML = resultLanguage.map(item => `
        <article class="output-card">
            <small>${item.tag}</small>
            <h3><i class='bx ${item.icon}'></i>${item.title}</h3>
            <p>${item.body}</p>
            <ul>
                ${item.bullets.map(bullet => `<li>${bullet}</li>`).join("")}
            </ul>
            <div class="output-meta">${item.meta}</div>
        </article>
    `).join("");

    const outputGuide = document.getElementById("abaqus-output-guide");
    outputGuide.innerHTML = abaqusOutputGuide.map(item => `
        <article class="output-card">
            <small>${item.tag}</small>
            <h3><i class='bx ${item.icon}'></i>${item.title}</h3>
            <p>${item.body}</p>
            <ul>
                ${item.bullets.map(bullet => `<li>${bullet}</li>`).join("")}
            </ul>
        </article>
    `).join("");

    const decisionGuide = document.getElementById("report-decision-guide");
    decisionGuide.innerHTML = reportDecisionGuide.map(item => `
        <article class="decision-card">
            <small>${item.tag}</small>
            <h3><i class='bx ${item.icon}'></i>${item.title}</h3>
            <p>${item.body}</p>
            <ul>
                ${item.bullets.map(bullet => `<li>${bullet}</li>`).join("")}
            </ul>
        </article>
    `).join("");

    const conceptGrid = document.getElementById("foundation-concepts");
    conceptGrid.innerHTML = foundationConcepts.map(item => `
        <article class="foundation-card">
            <small>${item.tag}</small>
            <h3><i class='bx ${item.icon}'></i>${item.title}</h3>
            <p>${item.body}</p>
            <ul>
                ${item.bullets.map(bullet => `<li>${bullet}</li>`).join("")}
            </ul>
        </article>
    `).join("");

    const bridgeGrid = document.getElementById("background-bridges");
    bridgeGrid.innerHTML = backgroundBridges.map(item => `
        <article class="foundation-card">
            <small>${item.tag}</small>
            <h3><i class='bx ${item.icon}'></i>${item.title}</h3>
            <p>${item.body}</p>
            <ul>
                ${item.bullets.map(bullet => `<li>${bullet}</li>`).join("")}
            </ul>
        </article>
    `).join("");

    const agendaGrid = document.getElementById("week12-agenda");
    agendaGrid.innerHTML = week12Agenda.map(item => `
        <article class="agenda-card">
            <small>${item.tag}</small>
            <h3><i class='bx ${item.icon}'></i>${item.title}</h3>
            <p>${item.body}</p>
            <ul>
                ${item.bullets.map(bullet => `<li>${bullet}</li>`).join("")}
            </ul>
        </article>
    `).join("");

    const deliverableGrid = document.getElementById("week12-deliverables");
    deliverableGrid.innerHTML = week12Deliverables.map(item => `
        <article class="deliverable-card">
            <small>${item.tag}</small>
            <h3><i class='bx ${item.icon}'></i>${item.title}</h3>
            <p>${item.body}</p>
            <ul>
                ${item.bullets.map(bullet => `<li>${bullet}</li>`).join("")}
            </ul>
        </article>
    `).join("");
}

function renderRoadmap() {
    const grid = document.getElementById("roadmap-grid");
    grid.innerHTML = roadmap.map(item => {
        const tagName = item.detailHref ? "a" : "article";
        const detailAttrs = item.detailHref
            ? ` href="${item.detailHref}" aria-label="${item.phase} ${item.title} 세부 학습 페이지 열기"`
            : "";
        const action = item.detailHref
            ? `<div class="roadmap-card-action">세부 학습 페이지 <i class='bx bx-right-arrow-alt'></i></div>`
            : "";

        return `
        <${tagName} class="roadmap-card ${item.detailHref ? "roadmap-link-card" : ""}"${detailAttrs}>
            <span class="phase-badge"><i class='bx bx-calendar'></i>${item.phase}</span>
            <h3>${item.title}</h3>
            <p>${item.goal}</p>
            <h4>Learning Focus</h4>
            <p>${item.learn}</p>
            <h4>Output</h4>
            <p>${item.output}</p>
            ${action}
        </${tagName}>
    `;
    }).join("");
}

function renderWorkflow() {
    const grid = document.getElementById("workflow-grid");
    grid.innerHTML = workflow.map(item => `
        <article class="workflow-step">
            <div class="step-icon"><i class='bx ${item.icon}'></i></div>
            <h3>${item.title}</h3>
            <p>${item.body}</p>
            <div class="leader-question"><strong>Leader question</strong><br>${item.question}</div>
        </article>
    `).join("");
}

function renderReview() {
    const grid = document.getElementById("review-grid");
    grid.innerHTML = reviewGroups.map(group => `
        <article class="review-card">
            <h3><i class='bx ${group.icon}'></i>${group.title}</h3>
            <ul>
                ${group.questions.map(question => `<li>${question}</li>`).join("")}
            </ul>
        </article>
    `).join("");
}

function renderCases() {
    const grid = document.getElementById("cases-grid");
    grid.innerHTML = capstoneCases.map(item => `
        <article class="case-card">
            <h3><i class='bx ${item.icon}'></i>${item.title}</h3>
            <p><strong style="color:var(--primary);">Purpose:</strong> ${item.purpose}</p>
            <ul>
                ${item.tasks.map(task => `<li>${task}</li>`).join("")}
            </ul>
        </article>
    `).join("");
}

function renderTerms() {
    const grid = document.getElementById("terms-grid");
    grid.innerHTML = terms.map(term => `
        <article class="term-card">
            <h3><i class='bx ${term.icon}'></i>${term.title}</h3>
            <p>${term.body}</p>
        </article>
    `).join("");
}

function activateSection(targetId, options = {}) {
    if (!pageMeta[targetId]) return;

    const navLinks = document.querySelectorAll(".nav-links li");
    const sections = document.querySelectorAll(".content-section");
    const pageTitle = document.getElementById("page-title");
    const pageSubtitle = document.getElementById("page-subtitle");

    navLinks.forEach(item => {
        item.classList.toggle("active", item.dataset.target === targetId);
    });

    sections.forEach(section => {
        section.classList.toggle("active", section.id === targetId);
    });

    pageTitle.textContent = pageMeta[targetId].title;
    pageSubtitle.textContent = pageMeta[targetId].subtitle;

    if (options.updateHash !== false) {
        const nextHash = `#${targetId}`;
        if (window.location.hash !== nextHash) {
            history.pushState(null, "", nextHash);
        }
    }

    if (options.scrollTop !== false) {
        const wrapper = document.querySelector(".content-wrapper");
        wrapper.scrollTo({ top: 0, behavior: options.smooth ? "smooth" : "auto" });
    }
}

function bindNavigation() {
    const navLinks = document.querySelectorAll(".nav-links li");

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            activateSection(link.dataset.target, { smooth: true });
        });
    });
}

function bindSectionLinks() {
    document.addEventListener("click", event => {
        const link = event.target.closest("[data-target-section]");
        if (!link) return;

        event.preventDefault();
        activateSection(link.dataset.targetSection, { smooth: true });
    });
}

function bindHashRoute() {
    const openHashSection = () => {
        const targetId = window.location.hash.replace("#", "");
        if (pageMeta[targetId]) {
            activateSection(targetId, { updateHash: false, scrollTop: false });
        }
    };

    window.addEventListener("hashchange", openHashSection);
    window.addEventListener("popstate", openHashSection);
    openHashSection();
}

function bindPromptCopy() {
    const promptBox = document.getElementById("notebook-prompt");
    const copyButton = document.getElementById("copy-notebook-prompt");
    promptBox.textContent = notebookPrompt;

    copyButton.addEventListener("click", async () => {
        let copied = false;

        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(notebookPrompt);
                copied = true;
            } catch (error) {
                copied = false;
            }
        }

        if (!copied) {
            const textArea = document.createElement("textarea");
            textArea.value = notebookPrompt;
            textArea.setAttribute("readonly", "");
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.select();
            copied = document.execCommand("copy");
            document.body.removeChild(textArea);
        }

        if (!copied) {
            const range = document.createRange();
            range.selectNodeContents(promptBox);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }

        copyButton.innerHTML = copied
            ? "<i class='bx bx-check'></i> Copied"
            : "<i class='bx bx-selection'></i> Prompt selected";
        setTimeout(() => {
            copyButton.innerHTML = "<i class='bx bx-copy'></i> Copy";
        }, 1800);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderLeaderCards();
    renderWeek12Foundation();
    renderRoadmap();
    renderWorkflow();
    renderReview();
    renderCases();
    renderTerms();
    bindNavigation();
    bindSectionLinks();
    bindHashRoute();
    bindPromptCopy();
});
