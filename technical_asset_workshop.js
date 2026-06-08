const pageMeta = {
    "guide-section": {
        title: "워크샵 안내",
        subtitle: "대표 BP/VDR/COR을 재사용 가능한 모델, 조건, 판단 기준으로 전환하는 기준 정렬"
    },
    "definition-section": {
        title: "1. 업무 정의",
        subtitle: "모든 VDR/COR이 아니라 대표성이 있는 BP/VDR/COR을 자산화 대상으로 선별"
    },
    "asset-definition-section": {
        title: "2. 자산 정의",
        subtitle: "BP, 해석 모델, 물성, 조건, 판단 기준, 교육자료를 연결하는 자산 기준"
    },
    "tech-map-section": {
        title: "3. 기술 분류",
        subtitle: "합의된 7개 기술 Map 위에 적용 Context와 대표 모델을 연결"
    },
    "operation-section": {
        title: "4. 운영 책임",
        subtitle: "Owner, Reviewer Pool, 기술 Chapter, 파트리더 관리 방식 비교"
    },
    "webapp-section": {
        title: "5. 웹앱 구조",
        subtitle: "기술 Map, 기술자산, 성장 Path 중심의 MVP 정보구조"
    },
    "prep-section": {
        title: "사전 준비",
        subtitle: "파트리더가 워크샵 전에 가져올 4개 Action Item"
    },
    "memo-section": {
        title: "메모 취합",
        subtitle: "각 섹션 의견을 Markdown으로 모아 워크샵 전에 공유"
    },
    "prompt-section": {
        title: "진행 프롬프트",
        subtitle: "워크샵 진행과 결과 정리를 위한 질문 묶음"
    }
};

const memoSectionIds = [
    "guide-section",
    "definition-section",
    "asset-definition-section",
    "tech-map-section",
    "operation-section",
    "webapp-section",
    "prep-section"
];

const guideCards = [
    {
        icon: "bx-target-lock",
        tag: "Purpose",
        title: "워크샵 목적",
        body: "팀이 수행해온 Simulation 경험을 다음 사람이 재사용할 수 있는 대표 모델, 판단 기준, 교육 경로로 전환하기 위한 자산화 기준을 정렬합니다.",
        bullets: [
            "BP 수집이 아니라 BP 안의 재사용 요소를 분해합니다.",
            "대표 모델링과 사용 조건을 남기는 기준을 정합니다.",
            "신규 인원이 학습하고 재현할 수 있는 흐름을 만듭니다."
        ]
    },
    {
        icon: "bx-check-shield",
        tag: "Premise",
        title: "논의 전제",
        body: "이미 합의된 정의와 분류는 재논의하지 않고, 그 위에 자산화 기준과 웹앱 구조를 얹습니다.",
        bullets: [
            "VDR / COR / REP 역할 정의는 공유 전제입니다.",
            "기술 Map 1차 분류는 7개 축을 사용합니다.",
            "파트별 정체성 논의는 이번 범위에서 제외합니다."
        ]
    },
    {
        icon: "bx-layer-plus",
        tag: "Output",
        title: "기대 산출물",
        body: "회의가 끝나면 웹앱에 바로 반영할 수 있는 기준과 운영 방향이 남아야 합니다.",
        bullets: [
            "대표 VDR/COR 선정 기준과 1차 BP 목록",
            "해석 모델 자산화 필수 항목",
            "Owner / Reviewer / 파트리더 운영 방향",
            "웹앱 MVP 메뉴와 첫 화면 구성 피드백"
        ]
    }
];

const definitionCards = [
    {
        icon: "bx-file-find",
        tag: "VDR",
        title: "기존 방법론 활용형 대응",
        body: "VDR은 기존 방법론을 활용해 단기/중기 요청에 대응하는 업무입니다. 이번 워크샵에서는 역할 정의 자체를 다시 논의하지 않습니다.",
        bullets: ["고객/사업부 의사결정 근거 제공", "반복 조건이나 대표 모델 후보 발굴", "대표성이 있으면 BP 후보로 연결"]
    },
    {
        icon: "bx-lab",
        tag: "COR",
        title: "신규 방법론 개발형 과제",
        body: "COR은 신규 방법론을 개발하고 정합성을 확인하는 장기 과제입니다. 방법론, 검증 이력, 한계 조건이 자산화의 핵심입니다.",
        bullets: ["신규 모델링/물성/조건 개발", "Matching 또는 활용 이력 확보", "기술 Gap과 표준화 가능성 도출"]
    },
    {
        icon: "bx-book-content",
        tag: "REP",
        title: "기술보고서이자 자산 입구",
        body: "REP는 단순 개인 보고서가 아니라 과거 VDR/COR 경험에서 모델, 조건, 판단 기준을 찾는 입구로 설계해야 합니다.",
        bullets: ["관련 BP와 모델 연결", "판단 기준과 주의사항 기록", "신규 인원 학습 자료로 활용"]
    },
    {
        icon: "bx-select-multiple",
        tag: "Criteria",
        title: "대표성 기준",
        body: "대표 VDR/COR은 반복성과 의사결정 영향, 모델 재사용성을 기준으로 선별합니다.",
        bullets: ["반복성", "의사결정 영향", "메커니즘 설명력", "모델 재사용성", "교육 활용성", "표준화 가능성", "사업부/고객 대응 가치"]
    }
];

const assetTypes = [
    {
        icon: "bx-certification",
        tag: "BP",
        title: "Best Practice",
        body: "성과 사례가 아니라 모델, 물성, 조건, 판단 기준을 꺼내기 위한 출발점입니다.",
        bullets: ["문제 배경", "Simulation 접근", "의사결정 기여", "재사용 요소", "교육 포인트"]
    },
    {
        icon: "bx-cube-alt",
        tag: "Model",
        title: "해석 모델",
        body: "파일 위치만 남기면 자산이 아닙니다. 적용 가능 범위와 사용 금지 조건까지 함께 남겨야 합니다.",
        bullets: ["Geometry / Layer 구성", "Mesh 기준", "Solver 설정", "Post-processing 기준"]
    },
    {
        icon: "bx-test-tube",
        tag: "Material",
        title: "Material / 물성",
        body: "물성 Card는 모델 재사용성과 신뢰 수준을 좌우하는 핵심 자산입니다.",
        bullets: ["온도 의존 물성", "Interface / Adhesive 물성", "확보 출처", "적용 가능 조건"]
    },
    {
        icon: "bx-git-branch",
        tag: "Condition",
        title: "조건 Template",
        body: "Boundary Condition, Contact, Load 조건은 모델의 의미를 결정합니다.",
        bullets: ["Boundary Condition", "Contact / Interface 조건", "Load / Temperature 조건", "사용하면 안 되는 조건"]
    },
    {
        icon: "bx-check-circle",
        tag: "Judgment",
        title: "판단 기준",
        body: "결과 이미지를 보는 기준이 아니라 의사결정에 반영 가능한 해석 기준을 남깁니다.",
        bullets: ["절대값 / 경향성 구분", "상대 비교 기준", "Risk Ranking", "Consensus 기준"]
    },
    {
        icon: "bx-book-open",
        tag: "Education",
        title: "교육자료",
        body: "신규 인원이 대표 BP와 모델을 학습, 재현, 변형하는 순서와 연결됩니다.",
        bullets: ["MAN / EDU", "재현 과제", "완료 기준", "시니어 리뷰 포인트"]
    }
];

const modelFields = [
    "모델명", "기술 영역", "적용 Context", "해석 목적", "적용 가능 범위", "사용하면 안 되는 조건",
    "Geometry / Layer 구성", "Mesh 기준", "Material Card", "Boundary Condition", "Contact / Interface 조건",
    "Solver 설정", "Post-processing 기준", "검증 또는 활용 이력", "관련 BP", "모델 성숙도", "신뢰 수준", "버전", "Reviewer / Owner", "파일 위치"
];

const maturityLevels = [
    ["M1", "Archive", "과제 수행 모델을 보존한 수준"],
    ["M2", "Reusable", "유사 과제에 재사용 가능"],
    ["M3", "Standard", "팀 내 표준모델로 사용 가능"],
    ["M4", "Validated", "실험/평가 결과와 비교 이력 있음"],
    ["M5", "Platform", "여러 제품/사업부에 확장 가능한 플랫폼 모델"]
];

const confidenceLevels = [
    ["C1", "미검증", "해석 수행 이력은 있으나 실험 비교 없음"],
    ["C2", "경향성 확인", "상대 비교나 Trend 판단에 사용 가능"],
    ["C3", "일부 Matching", "특정 조건에서 실험/평가와 비교 이력 있음"],
    ["C4", "의사결정 적용", "사업부 의사결정에 실제 반영됨"],
    ["C5", "표준 적용", "반복 과제 또는 다수 제품군에 표준적으로 활용 가능"]
];

const techMap = [
    ["01", "변형", "구조 변형, 처짐, 조립/사용 조건에서의 형상 변화와 기능 영향"],
    ["02", "박리", "Interface, adhesive, peeling, delamination risk와 접합 조건 판단"],
    ["03", "충격", "Drop, Tumble, Set Drop 등 충격 조건에서의 구조 리스크"],
    ["04", "열유동", "Thermal Shock, 열응력, 온도 의존 물성, 열하중 조건"],
    ["05", "피로", "반복 하중, 신뢰성 조건, crack 성장 또는 내구성 판단"],
    ["06", "진동", "동특성, modal, 주파수 응답, 진동 기반 신뢰성 이슈"],
    ["07", "기타", "복합 물리, 신규 방법론, 아직 독립 분류가 어려운 기술 후보"]
];

const operationCards = [
    {
        icon: "bx-user-pin",
        tag: "Owner",
        title: "시니어 기술 Owner",
        body: "기술 영역별 대표 BP와 모델을 정리하고 기술 Gap과 업데이트 필요 항목을 제안합니다.",
        bullets: ["표준모델 후보 검토", "신규 인원 학습자료 추천", "VD Board 공유 후보 추천"]
    },
    {
        icon: "bx-group",
        tag: "Reviewer Pool",
        title: "Reviewer Pool",
        body: "개별 Owner 부담이 크면 복수 시니어가 모델 신뢰 수준과 판단 기준을 함께 리뷰합니다.",
        bullets: ["모델 성숙도 검토", "조건/물성 타당성 의견", "교육 과제 리뷰"]
    },
    {
        icon: "bx-network-chart",
        tag: "Chapter",
        title: "기술 Chapter",
        body: "파트를 넘나드는 공통 기술 이슈를 모아 기준을 정리하는 느슨한 운영 방식입니다.",
        bullets: ["7개 기술 Map별 논의", "공통 모델링 기준 정리", "기술 Gap 공유"]
    },
    {
        icon: "bx-shield-quarter",
        tag: "Part Leader",
        title: "파트리더 1차 관리",
        body: "현장 Context와 과제 우선순위는 파트리더가 1차로 관리하고, 기술 기준은 시니어 리뷰와 연결합니다.",
        bullets: ["파트별 BP 후보 추천", "Context 정보 보완", "업데이트 필요 항목 식별"]
    }
];

const ownerBoundaries = [
    {
        icon: "bx-check",
        tag: "Can Do",
        title: "Owner가 맡을 수 있는 역할",
        body: "Owner는 과제 승인자가 아니라 기술 기준을 정리하는 역할에 가깝습니다.",
        bullets: ["대표 BP와 모델 정리", "표준모델 또는 Template 품질 검토", "해석 조건/모델링 기준 리뷰 의견", "신규 인원 학습자료 추천", "기술 Gap과 업데이트 필요 항목 제안"]
    },
    {
        icon: "bx-x",
        tag: "Should Not",
        title: "Owner가 맡으면 안 되는 역할",
        body: "파트리더 책임과 충돌하거나 모든 과제를 병목으로 만드는 역할은 제외합니다.",
        bullets: ["모든 과제의 최종 승인자", "파트리더 업무 지시 대체", "모든 모델 직접 관리", "모든 보고서 검토", "과제 성과의 소유권 주장"]
    }
];

const webappCards = [
    {
        icon: "bx-map-alt",
        tag: "Menu 1",
        title: "기술 Map",
        body: "팀 공통 Simulation 기술 체계와 적용 Context, 관련 자산을 한 화면에서 봅니다.",
        bullets: ["7개 기술 Map", "적용 Context", "관련 BP/모델/물성/조건", "기술 Gap", "Owner/Reviewer"]
    },
    {
        icon: "bx-collection",
        tag: "Menu 2",
        title: "기술자산",
        body: "BP, 모델, 물성, 조건, 판단 기준, 교육자료를 검색하고 연결 관계를 확인합니다.",
        bullets: ["검색/필터", "자산 유형", "상태값", "모델 성숙도", "신뢰 수준"]
    },
    {
        icon: "bx-line-chart",
        tag: "Menu 3",
        title: "성장 Path",
        body: "신규 인원과 기존 인원이 어떤 BP와 모델을 어떤 순서로 학습, 재현, 변형할지 보여줍니다.",
        bullets: ["조직 역할 이해", "대표 BP 학습", "기존 모델 재현", "조건 변경 실습", "자산화 기여"]
    }
];

const mvpCards = [
    {
        icon: "bx-plus-circle",
        tag: "MVP Include",
        title: "초기 MVP에 포함",
        body: "워크샵 결과를 바로 구조화하기 위해 필요한 최소 기능입니다.",
        bullets: ["기술 Map 조회", "기술 영역별 자산 연결", "기술자산 등록", "BP/모델 상세 등록", "모델 성숙도/신뢰 수준 표시", "성장 Path 기본 구조"]
    },
    {
        icon: "bx-minus-circle",
        tag: "MVP Exclude",
        title: "초기 MVP에서 제외",
        body: "논의를 복잡하게 만들거나 운영 부담이 큰 기능은 다음 단계로 둡니다.",
        bullets: ["개인별 Capability Matrix", "복잡한 승인 Workflow", "자동 추천 기능", "알림 기능", "상세 통계 Dashboard", "VD Board 자동 연계"]
    }
];

const prepCards = [
    {
        icon: "bx-current-location",
        tag: "Action 1",
        title: "주요 대응 Context 정리",
        body: "파트별 핵심 기술을 새로 정의하는 것이 아니라, 어떤 사업부/제품/상황에서 Simulation을 활용하는지 정리합니다.",
        bullets: ["주 대응 사업부", "주요 제품/플랫폼", "자주 들어오는 요청 유형", "의사결정 상황", "실험/평가 데이터 확보 수준"]
    },
    {
        icon: "bx-certification",
        tag: "Action 2",
        title: "BP 1건 자산화 요소 분해",
        body: "이미 정리된 BP 중 하나를 골라 재사용 가능한 요소를 분리합니다.",
        bullets: ["재사용 가능한 해석 모델", "Material Card", "Boundary Condition", "결과 해석 기준", "교육 활용 포인트", "주의점"]
    },
    {
        icon: "bx-list-check",
        tag: "Action 3",
        title: "모델 필수 정보 5개 선정",
        body: "해석 모델을 다시 쓰려면 반드시 함께 남겨야 하는 정보를 5개만 골라옵니다.",
        bullets: ["적용 가능 범위", "사용 금지 조건", "Material Card", "Boundary Condition", "검증 이력", "Reviewer / Owner"]
    },
    {
        icon: "bx-user-check",
        tag: "Action 4",
        title: "Owner 필요성 의견",
        body: "Owner 후보를 가져오는 것이 아니라, 필요한지와 최소 역할이 무엇인지 의견을 준비합니다.",
        bullets: ["필요 / 불필요 / 일부 필요", "필요한 이유", "최소 역할", "맡으면 안 되는 역할", "대체 운영 방식"]
    }
];

const workshopPrompt = `기술자산화 파트리더 워크샵을 진행한다.
이번 워크샵은 BP나 기술보고서를 더 모으는 자리가 아니라, 대표 BP/VDR/COR을 모델, 물성, 조건, 판단 기준, 교육 포인트로 분해해 다음 사람이 재사용할 수 있게 만드는 기준을 정하는 자리다.

전제:
- VDR/COR/REP 역할 정의는 재논의하지 않는다.
- 기술 Map 1차 분류는 01_변형, 02_박리, 03_충격, 04_열유동, 05_피로, 06_진동, 07_기타를 사용한다.
- 모든 VDR/COR을 자산화하지 않고, 대표성이 있는 BP 또는 BP 후보를 1차 대상으로 삼는다.

진행 순서:
1. 업무 정의
- 대표 VDR/COR 선정 기준을 정한다.
- 단순 대응 VDR/COR 처리 원칙을 정한다.
- 1차 자산화 대상 BP 후보를 확인한다.

2. 자산 정의
- BP, 모델, 물성, 조건 Template, 판단 기준, 교육자료의 역할을 구분한다.
- 해석 모델 자산화 필수 정보 5개를 합의한다.
- 모델 성숙도 M1~M5와 신뢰 수준 C1~C5 사용 여부를 논의한다.

3. 기술 분류
- 7개 기술 Map에 자산을 어떻게 배치할지 논의한다.
- 파트별 차이를 기술 차이가 아니라 적용 Context 차이로 어떻게 표현할지 정한다.

4. 운영 책임
- 시니어 기술 Owner, Reviewer Pool, 기술 Chapter, 파트리더 1차 관리 중 적절한 운영 방식을 논의한다.
- Owner가 맡을 수 있는 역할과 맡으면 안 되는 역할을 분리한다.

5. 웹앱 구조
- 기술 Map / 기술자산 / 성장 Path 3개 메뉴 구조가 충분한지 확인한다.
- MVP에 포함할 기능과 제외할 기능을 나눈다.

출력:
- 대표 VDR/COR 선정 기준
- 1차 BP 목록
- 모델 자산화 필수 항목
- Owner/Reviewer 운영 방향
- 웹앱 MVP 구조와 보류 기능`;

function renderCards(targetId, cards, cardClass = "asset-card") {
    const grid = document.getElementById(targetId);
    grid.innerHTML = cards.map(card => `
        <article class="${cardClass}">
            ${card.tag ? `<small>${card.tag}</small>` : ""}
            <h3><i class='bx ${card.icon}'></i>${card.title}</h3>
            <p>${card.body}</p>
            <ul>${card.bullets.map(bullet => `<li>${bullet}</li>`).join("")}</ul>
        </article>
    `).join("");
}

function renderModelFields() {
    document.getElementById("model-fields-grid").innerHTML = modelFields.map((field, index) => `
        <article class="metric-card">
            <small>${String(index + 1).padStart(2, "0")}</small>
            <h3><i class='bx bx-checkbox'></i>${field}</h3>
            <p>파트리더가 필수 정보 5개 후보로 검토할 항목입니다.</p>
        </article>
    `).join("");
}

function renderLevels(targetId, levels) {
    document.getElementById(targetId).innerHTML = levels.map(([code, title, body]) => `
        <article class="metric-card">
            <small>${code}</small>
            <h3><i class='bx bx-bar-chart-alt-2'></i>${title}</h3>
            <p>${body}</p>
        </article>
    `).join("");
}

function renderTechMap() {
    document.getElementById("tech-map-grid").innerHTML = techMap.map(([code, title, body]) => `
        <article class="map-card">
            <small>${code}</small>
            <h3><i class='bx bx-map'></i>${title}</h3>
            <p>${body}</p>
            <ul>
                <li>관련 BP와 대표 모델 연결</li>
                <li>적용 Context와 기술 Gap 기록</li>
                <li>Owner 또는 Reviewer 후보 연결</li>
            </ul>
        </article>
    `).join("");
}

function memoKey(sectionId) {
    return `technicalAssetWorkshopMemo:${sectionId}`;
}

function getParticipant() {
    return localStorage.getItem("technicalAssetWorkshopParticipant") || "";
}

function setParticipant(value) {
    localStorage.setItem("technicalAssetWorkshopParticipant", value);
    document.querySelectorAll(".memo-participant").forEach(input => {
        if (input.value !== value) input.value = value;
    });
}

function renderMemoPanels() {
    memoSectionIds.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        const title = section.dataset.memoTitle || pageMeta[sectionId].title;
        const panel = document.createElement("div");
        panel.className = "memo-panel";
        panel.innerHTML = `
            <div class="memo-header">
                <h3><i class='bx bx-message-square-edit'></i>${title} 의견 메모</h3>
                <span class="memo-status" data-status-for="${sectionId}">저장 대기</span>
            </div>
            <div class="memo-input-row">
                <input class="memo-participant" type="text" placeholder="이름 / 파트" value="${escapeHtml(getParticipant())}">
                <textarea data-memo-for="${sectionId}" placeholder="${title}에 대한 의견, 우려, 추가 질문을 적어주세요."></textarea>
            </div>
            <div class="memo-actions">
                <div style="display:flex; gap:0.55rem; flex-wrap:wrap;">
                    <button data-save-memo="${sectionId}"><i class='bx bx-save'></i> 저장</button>
                    <button class="secondary" data-copy-memo="${sectionId}"><i class='bx bx-copy'></i> 이 섹션 복사</button>
                </div>
                <span class="memo-help">현재 브라우저에 저장됩니다. 공동 취합은 메모 취합 페이지에서 Markdown으로 내보냅니다.</span>
            </div>
        `;
        section.appendChild(panel);
        const textarea = panel.querySelector("textarea");
        textarea.value = localStorage.getItem(memoKey(sectionId)) || "";
    });

    document.querySelectorAll(".memo-participant").forEach(input => {
        input.addEventListener("input", () => setParticipant(input.value));
    });

    document.querySelectorAll("[data-save-memo]").forEach(button => {
        button.addEventListener("click", () => saveMemo(button.dataset.saveMemo));
    });

    document.querySelectorAll("[data-copy-memo]").forEach(button => {
        button.addEventListener("click", () => copySectionMemo(button.dataset.copyMemo));
    });

    document.querySelectorAll("[data-memo-for]").forEach(textarea => {
        textarea.addEventListener("input", () => {
            const sectionId = textarea.dataset.memoFor;
            localStorage.setItem(memoKey(sectionId), textarea.value);
            setMemoStatus(sectionId, "자동 저장됨");
            updateMemoExportPreview();
        });
    });
}

function saveMemo(sectionId) {
    const textarea = document.querySelector(`[data-memo-for="${sectionId}"]`);
    localStorage.setItem(memoKey(sectionId), textarea.value);
    setMemoStatus(sectionId, "저장됨");
    updateMemoExportPreview();
}

function setMemoStatus(sectionId, text) {
    const status = document.querySelector(`[data-status-for="${sectionId}"]`);
    if (!status) return;
    const now = new Date();
    status.textContent = `${text} ${now.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })}`;
}

function buildSectionMemoMarkdown(sectionId) {
    const title = document.getElementById(sectionId)?.dataset.memoTitle || pageMeta[sectionId]?.title || sectionId;
    const memo = localStorage.getItem(memoKey(sectionId)) || "";
    return `## ${title}\n\n${memo.trim() || "(아직 작성된 의견 없음)"}`;
}

function buildAllMemoMarkdown() {
    const participant = getParticipant() || "(이름 / 파트 미입력)";
    const generatedAt = new Date().toLocaleString("ko-KR");
    return [
        "# 기술자산화 워크샵 사전 의견",
        "",
        `- 작성자: ${participant}`,
        `- 작성 시각: ${generatedAt}`,
        "",
        ...memoSectionIds.flatMap(sectionId => [buildSectionMemoMarkdown(sectionId), ""])
    ].join("\n");
}

async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            return fallbackCopy(text);
        }
    }
    return fallbackCopy(text);
}

function fallbackCopy(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand("copy");
    document.body.removeChild(textArea);
    return copied;
}

async function copySectionMemo(sectionId) {
    const copied = await copyText(buildSectionMemoMarkdown(sectionId));
    setMemoStatus(sectionId, copied ? "복사됨" : "복사 실패");
}

function updateMemoExportPreview() {
    const preview = document.getElementById("memo-export-preview");
    if (preview) preview.textContent = buildAllMemoMarkdown();
}

function bindMemoExport() {
    const refreshButton = document.getElementById("refresh-memo-export");
    const copyButton = document.getElementById("copy-memo-export");
    const downloadButton = document.getElementById("download-memo-export");

    refreshButton.addEventListener("click", updateMemoExportPreview);
    copyButton.addEventListener("click", async () => {
        copyButton.innerHTML = (await copyText(buildAllMemoMarkdown()))
            ? "<i class='bx bx-check'></i> 복사됨"
            : "<i class='bx bx-error'></i> 복사 실패";
        setTimeout(() => {
            copyButton.innerHTML = "<i class='bx bx-copy'></i> 전체 복사";
        }, 1600);
    });
    downloadButton.addEventListener("click", () => {
        const blob = new Blob([buildAllMemoMarkdown()], { type: "text/markdown;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "technical-assetization-workshop-memos.md";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });
    updateMemoExportPreview();
}

function bindPromptCopy() {
    const promptBox = document.getElementById("workshop-prompt");
    const copyButton = document.getElementById("copy-workshop-prompt");
    promptBox.textContent = workshopPrompt;

    copyButton.addEventListener("click", async () => {
        copyButton.innerHTML = (await copyText(workshopPrompt))
            ? "<i class='bx bx-check'></i> Copied"
            : "<i class='bx bx-error'></i> Copy failed";
        setTimeout(() => {
            copyButton.innerHTML = "<i class='bx bx-copy'></i> Copy";
        }, 1800);
    });
}

function activateSection(targetId, options = {}) {
    if (!pageMeta[targetId]) return;

    document.querySelectorAll(".nav-links li").forEach(item => {
        item.classList.toggle("active", item.dataset.target === targetId);
    });

    document.querySelectorAll(".content-section").forEach(section => {
        section.classList.toggle("active", section.id === targetId);
    });

    document.getElementById("page-title").textContent = pageMeta[targetId].title;
    document.getElementById("page-subtitle").textContent = pageMeta[targetId].subtitle;

    if (targetId === "memo-section") updateMemoExportPreview();

    if (options.updateHash !== false) {
        const nextHash = `#${targetId}`;
        if (window.location.hash !== nextHash) history.pushState(null, "", nextHash);
    }

    if (options.scrollTop !== false) {
        document.querySelector(".content-wrapper").scrollTo({ top: 0, behavior: options.smooth ? "smooth" : "auto" });
    }
}

function bindNavigation() {
    document.querySelectorAll(".nav-links li").forEach(link => {
        link.addEventListener("click", () => {
            activateSection(link.dataset.target, { smooth: true });
        });
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

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}

document.addEventListener("DOMContentLoaded", () => {
    renderCards("guide-grid", guideCards);
    renderCards("definition-grid", definitionCards);
    renderCards("asset-types-grid", assetTypes);
    renderModelFields();
    renderLevels("maturity-grid", maturityLevels);
    renderLevels("confidence-grid", confidenceLevels);
    renderTechMap();
    renderCards("operation-grid", operationCards);
    renderCards("owner-boundary-grid", ownerBoundaries, "note-card");
    renderCards("webapp-grid", webappCards);
    renderCards("mvp-grid", mvpCards, "note-card");
    renderCards("prep-grid", prepCards);
    renderMemoPanels();
    bindNavigation();
    bindHashRoute();
    bindMemoExport();
    bindPromptCopy();
});
