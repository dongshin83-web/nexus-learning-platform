const technologyDomains = [
    {
        id: "deformation",
        label: "01. 변형",
        description: "구조 변형, 형상 안정성, 공정/사용 조건에서의 치수 변화와 설계 판단 기준"
    },
    {
        id: "delamination",
        label: "02. 박리",
        description: "계면 박리, 접착/층간 취약부, 계면 물성 및 파손 메커니즘"
    },
    {
        id: "impact",
        label: "03. 충격",
        description: "Drop, 충격 하중, 취약부 탐색, 신뢰성 평가 조건과의 연결"
    },
    {
        id: "thermal-flow",
        label: "04. 열유동",
        description: "열전달, 온도장, 유동/냉각 조건, 열-구조 연성 판단"
    },
    {
        id: "fatigue",
        label: "05. 피로",
        description: "반복 하중, 열사이클, 수명 예측, 평가 조건 기반 설계 판단"
    },
    {
        id: "vibration",
        label: "06. 진동",
        description: "고유진동수, 동특성, 가진 조건, 모드 해석과 취약 조건"
    },
    {
        id: "other",
        label: "07. 기타",
        description: "복합 Domain, 신규 방법론, 공통 기준, 교육/운영 자산"
    }
];

const auxiliaryTags = [
    "AI 연계",
    "타 Domain 연계",
    "공정 연계",
    "신뢰성 연계",
    "소재/물성 연계",
    "실험/평가 연계",
    "고객/사업부 대응",
    "Virtual Twin 연계"
];

const statusMeta = {
    "후보": { className: "draft", icon: "bx bx-edit-alt" },
    "작성중": { className: "draft", icon: "bx bx-pencil" },
    "검토중": { className: "review", icon: "bx bx-search-alt" },
    "등록완료": { className: "ready", icon: "bx bx-check-circle" },
    "보완필요": { className: "need", icon: "bx bx-error-circle" }
};

const technicalAssets = [
    {
        id: "bp-deformation-warpage",
        title: "박막 적층 구조 변형 예측 기준",
        type: "BP",
        domain: "deformation",
        status: "등록완료",
        owner: "1파트",
        tags: ["공정 연계", "소재/물성 연계", "Virtual Twin 연계"],
        decisionImpact: "공정 조건 변경 전 변형 리스크를 비교하고, 허용 가능한 설계/공정 선택지를 좁히는 판단 근거로 사용한다.",
        reusableAssets: "적층 구조 모델, 온도 의존 물성, 공정 온도 이력, 변형량 비교 기준",
        learningUse: "신규 인원이 적층 구조의 변형 원인과 상대 비교 방식, 물성 민감도 점검 절차를 학습할 수 있다.",
        links: [
            { label: "BP 문서", href: "#" },
            { label: "모델 폴더", href: "#" },
            { label: "검토 코멘트", href: "#" }
        ]
    },
    {
        id: "bp-delamination-interface",
        title: "계면 박리 메커니즘 설명 사례",
        type: "BP 후보",
        domain: "delamination",
        status: "검토중",
        owner: "2파트",
        tags: ["소재/물성 연계", "실험/평가 연계", "고객/사업부 대응"],
        decisionImpact: "박리 위치와 계면 취약 조건을 설명해 소재 조합과 공정 관리 기준 논의에 연결한다.",
        reusableAssets: "계면 물성 가정, cohesive zone 입력값, 실험 파단면 피드백, 박리 판정 체크리스트",
        learningUse: "계면 문제를 단일 응력값으로 단정하지 않고 실험 피드백과 함께 해석하는 방법을 익힌다.",
        links: [
            { label: "후보 요약", href: "#" },
            { label: "실험 피드백", href: "#" }
        ]
    },
    {
        id: "model-impact-drop",
        title: "Drop 충격 취약부 탐색 모델",
        type: "모델",
        domain: "impact",
        status: "작성중",
        owner: "3파트",
        tags: ["신뢰성 연계", "실험/평가 연계", "Virtual Twin 연계"],
        decisionImpact: "Drop 조건별 취약부와 개선안의 상대 효과를 비교해 평가 전 우선 검토 위치를 정한다.",
        reusableAssets: "대표 충격 조건, 접촉 정의, 취약부 지표, 평가 조건별 모델 세팅",
        learningUse: "충격 해석에서 contact, time step, 결과 지표를 함께 확인하는 재현 과제로 사용할 수 있다.",
        links: [
            { label: "모델 세팅", href: "#" },
            { label: "결과 비교표", href: "#" }
        ]
    },
    {
        id: "standard-thermal-flow",
        title: "열유동-구조 연계 판단 기준",
        type: "판단 기준",
        domain: "thermal-flow",
        status: "후보",
        owner: "공통",
        tags: ["타 Domain 연계", "공정 연계", "AI 연계"],
        decisionImpact: "열유동 결과를 구조 해석 입력으로 넘길 때 필요한 온도장, 시간축, 보수성 기준을 정렬한다.",
        reusableAssets: "온도장 전달 규칙, mesh 매핑 주의점, 보수 조건 정의, 연계 검토 체크리스트",
        learningUse: "다른 Domain 결과를 받아 구조 판단으로 전환할 때 빠뜨리기 쉬운 확인 항목을 학습한다.",
        links: [
            { label: "연계 기준 초안", href: "#" },
            { label: "데이터 변환 예시", href: "#" }
        ]
    },
    {
        id: "bp-fatigue-cycle",
        title: "열사이클 피로 수명 검토 사례",
        type: "BP",
        domain: "fatigue",
        status: "보완필요",
        owner: "2파트",
        tags: ["신뢰성 연계", "실험/평가 연계", "소재/물성 연계"],
        decisionImpact: "반복 열하중 조건에서 취약 구조를 비교하고, 평가 조건과 설계 보완 방향을 연결한다.",
        reusableAssets: "열사이클 조건, 피로 물성, 손상 누적 가정, 수명 비교 기준",
        learningUse: "수명 예측 결과를 절대 정답으로 보지 않고 조건별 상대 비교와 한계 표시를 학습한다.",
        links: [
            { label: "보완 요청", href: "#" },
            { label: "원천 조건", href: "#" }
        ]
    },
    {
        id: "model-vibration-mode",
        title: "진동 모드 기반 설계 취약 조건 정리",
        type: "모델",
        domain: "vibration",
        status: "검토중",
        owner: "1파트",
        tags: ["타 Domain 연계", "실험/평가 연계"],
        decisionImpact: "동특성 변화가 예상되는 구조 변경안의 위험 조건을 사전에 비교해 설계 검토 순서를 정한다.",
        reusableAssets: "모드 해석 세팅, 경계조건 정의, 실험 모드 비교 양식, 가진 조건 후보",
        learningUse: "고유진동수 숫자만 보는 것이 아니라 모드 형상과 경계조건 민감도를 함께 해석한다.",
        links: [
            { label: "모드 비교", href: "#" },
            { label: "검증 메모", href: "#" }
        ]
    },
    {
        id: "guide-ai-asset-search",
        title: "AI 기반 자산 검색/요약 활용 가이드",
        type: "교육자료",
        domain: "other",
        status: "후보",
        owner: "공통",
        tags: ["AI 연계", "타 Domain 연계", "Virtual Twin 연계"],
        decisionImpact: "기존 BP와 모델을 빠르게 찾아 유사 과제 착수 전에 참고할 판단 기준을 확보한다.",
        reusableAssets: "검색 키워드 규칙, 요약 프롬프트, 내부 링크 작성 기준, 보안 검토 체크",
        learningUse: "신규 인원이 자산을 찾는 방법과 요약 결과를 검증하는 태도를 함께 학습한다.",
        links: [
            { label: "프롬프트 예시", href: "#" },
            { label: "검색 규칙", href: "#" }
        ]
    },
    {
        id: "template-review-sheet",
        title: "Reviewer Comment Sheet",
        type: "템플릿",
        domain: "other",
        status: "등록완료",
        owner: "공통",
        tags: ["고객/사업부 대응", "실험/평가 연계"],
        decisionImpact: "자산 등록 전에 의사결정 영향, 재사용성, 교육 활용성, 공개 가능성을 같은 기준으로 점검한다.",
        reusableAssets: "검토 질문, 판정 옵션, 보완 요청 항목, 승인 전 체크리스트",
        learningUse: "작성자와 Reviewer가 같은 언어로 품질 기준을 맞추는 데 사용한다.",
        links: [
            { label: "검토표", href: "#" },
            { label: "작성 예시", href: "#" }
        ]
    }
];

const filters = {
    search: "",
    domain: "all",
    tag: "all",
    type: "all",
    status: "all",
    link: "all"
};

let selectedAssetId = null;

const domainById = Object.fromEntries(technologyDomains.map((domain) => [domain.id, domain]));

function getUniqueValues(key) {
    return [...new Set(technicalAssets.map((asset) => asset[key]))].sort((a, b) => a.localeCompare(b, "ko"));
}

function makeOption(label, value) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
}

function initSelect(id, values, allLabel) {
    const select = document.getElementById(id);
    select.appendChild(makeOption(allLabel, "all"));
    values.forEach((value) => select.appendChild(makeOption(value, value)));
}

function renderFilterChips() {
    const domainWrap = document.getElementById("domain-chips");
    domainWrap.innerHTML = "";

    const allButton = createChip("전체", filters.domain === "all", () => {
        filters.domain = "all";
        render();
    });
    domainWrap.appendChild(allButton);

    technologyDomains.forEach((domain) => {
        const button = createChip(domain.label, filters.domain === domain.id, () => {
            filters.domain = domain.id;
            render();
        });
        domainWrap.appendChild(button);
    });

    const tagWrap = document.getElementById("tag-chips");
    tagWrap.innerHTML = "";
    tagWrap.appendChild(createChip("태그 전체", filters.tag === "all", () => {
        filters.tag = "all";
        render();
    }));

    auxiliaryTags.forEach((tag) => {
        const button = createChip(tag, filters.tag === tag, () => {
            filters.tag = tag;
            render();
        });
        tagWrap.appendChild(button);
    });
}

function createChip(label, isActive, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.textContent = label;
    button.setAttribute("aria-pressed", String(isActive));
    if (isActive) {
        button.style.borderColor = "rgba(121, 85, 72, 0.55)";
        button.style.background = "#efebe9";
        button.style.color = "#3e2723";
    }
    button.addEventListener("click", onClick);
    return button;
}

function getFilteredAssets() {
    const keyword = filters.search.trim().toLowerCase();
    return technicalAssets.filter((asset) => {
        const haystack = [
            asset.title,
            asset.type,
            asset.status,
            asset.owner,
            domainById[asset.domain]?.label,
            asset.decisionImpact,
            asset.reusableAssets,
            asset.learningUse,
            ...asset.tags
        ].join(" ").toLowerCase();

        const matchesSearch = !keyword || haystack.includes(keyword);
        const matchesDomain = filters.domain === "all" || asset.domain === filters.domain;
        const matchesTag = filters.tag === "all" || asset.tags.includes(filters.tag);
        const matchesType = filters.type === "all" || asset.type === filters.type;
        const matchesStatus = filters.status === "all" || asset.status === filters.status;
        const matchesLink = filters.link === "all"
            || (filters.link === "AI 연계" && asset.tags.includes("AI 연계"))
            || (filters.link === "타 Domain 연계" && asset.tags.includes("타 Domain 연계"));

        return matchesSearch && matchesDomain && matchesTag && matchesType && matchesStatus && matchesLink;
    });
}

function renderAssetList() {
    const wrap = document.getElementById("asset-list");
    const assets = getFilteredAssets();
    wrap.innerHTML = "";

    if (!assets.length) {
        const empty = document.createElement("div");
        empty.className = "no-results";
        empty.innerHTML = "<strong>조건에 맞는 샘플이 없습니다.</strong><br>검색어 또는 필터를 줄여 다시 확인하세요.";
        wrap.appendChild(empty);
        selectedAssetId = null;
        renderDetail(null);
        return;
    }

    if (!selectedAssetId || !assets.some((asset) => asset.id === selectedAssetId)) {
        selectedAssetId = assets[0].id;
    }

    assets.forEach((asset) => {
        const status = statusMeta[asset.status] ?? statusMeta["후보"];
        const card = document.createElement("article");
        card.className = `asset-card${asset.id === selectedAssetId ? " active" : ""}`;
        card.tabIndex = 0;
        card.innerHTML = `
            <div class="asset-top">
                <div class="badge-row">
                    <span class="badge domain">${domainById[asset.domain].label}</span>
                    <span class="badge">${asset.type}</span>
                </div>
                <span class="badge ${status.className}"><i class="${status.icon}"></i>${asset.status}</span>
            </div>
            <h3>${asset.title}</h3>
            <p>${asset.decisionImpact}</p>
            <div class="badge-row" style="margin-top: 0.8rem;">
                ${asset.tags.map((tag) => `<span class="badge">${tag}</span>`).join("")}
            </div>
            <div class="asset-footer">
                <span><i class="bx bx-user"></i> ${asset.owner}</span>
                <span class="link-hint">${asset.links.length} links <i class="bx bx-link-external"></i></span>
            </div>
        `;
        card.addEventListener("click", () => selectAsset(asset.id));
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selectAsset(asset.id);
            }
        });
        wrap.appendChild(card);
    });

    renderDetail(technicalAssets.find((asset) => asset.id === selectedAssetId));
}

function selectAsset(assetId) {
    selectedAssetId = assetId;
    renderAssetList();
}

function renderDetail(asset) {
    const panel = document.getElementById("detail-panel");
    if (!asset) {
        panel.innerHTML = `
            <div class="detail-empty">
                <strong>자산을 선택하세요.</strong>
                <p>왼쪽 카드에서 대표 사례를 누르면 의사결정 영향, 재사용 요소, 내부 링크 placeholder를 확인할 수 있습니다.</p>
            </div>
        `;
        return;
    }

    const status = statusMeta[asset.status] ?? statusMeta["후보"];
    panel.innerHTML = `
        <div class="badge-row">
            <span class="badge domain">${domainById[asset.domain].label}</span>
            <span class="badge">${asset.type}</span>
            <span class="badge ${status.className}"><i class="${status.icon}"></i>${asset.status}</span>
        </div>
        <h2 style="font-size: 1.25rem; line-height: 1.28; margin: 0.85rem 0 0.6rem;">${asset.title}</h2>
        <div class="detail-list">
            <div class="detail-item">
                <span>의사결정 영향</span>
                <strong>${asset.decisionImpact}</strong>
            </div>
            <div class="detail-item">
                <span>재사용 자산</span>
                <strong>${asset.reusableAssets}</strong>
            </div>
            <div class="detail-item">
                <span>성장/교육 활용</span>
                <strong>${asset.learningUse}</strong>
            </div>
            <div class="detail-item">
                <span>Owner</span>
                <strong>${asset.owner}</strong>
            </div>
        </div>
        <div class="badge-row">
            ${asset.tags.map((tag) => `<span class="badge">${tag}</span>`).join("")}
        </div>
        <div style="display: grid; gap: 0.5rem; margin-top: 1rem;">
            ${asset.links.map((link) => `
                <a class="btn btn-secondary" href="${link.href}" onclick="return false;" title="내부 환경에서 실제 링크로 교체">
                    <i class="bx bx-link-alt"></i>${link.label}
                </a>
            `).join("")}
        </div>
    `;
}

function renderTechnologyMap() {
    const wrap = document.getElementById("map-grid");
    wrap.innerHTML = "";

    technologyDomains.forEach((domain) => {
        const count = technicalAssets.filter((asset) => asset.domain === domain.id).length;
        const linked = technicalAssets
            .filter((asset) => asset.domain === domain.id)
            .filter((asset) => asset.tags.includes("AI 연계") || asset.tags.includes("타 Domain 연계")).length;

        const card = document.createElement("article");
        card.className = "map-card";
        card.innerHTML = `
            <header>
                <h3>${domain.label}</h3>
                <span class="count-pill">${count}</span>
            </header>
            <p>${domain.description}</p>
            <div class="badge-row" style="margin-top: 0.8rem;">
                <span class="badge">${linked} linked</span>
                <span class="badge">${count ? "샘플 있음" : "추가 필요"}</span>
            </div>
        `;
        card.addEventListener("click", () => {
            filters.domain = domain.id;
            document.getElementById("library").scrollIntoView({ behavior: "smooth" });
            render();
        });
        wrap.appendChild(card);
    });
}

function renderMetrics() {
    document.getElementById("metric-total").textContent = technicalAssets.length;
    const linkedCount = technicalAssets.filter((asset) => (
        asset.tags.includes("AI 연계") || asset.tags.includes("타 Domain 연계")
    )).length;
    document.getElementById("metric-linked").textContent = linkedCount;
}

function bindEvents() {
    const searchInput = document.getElementById("search-input");
    searchInput.addEventListener("input", (event) => {
        filters.search = event.target.value;
        renderAssetList();
    });

    document.getElementById("type-filter").addEventListener("change", (event) => {
        filters.type = event.target.value;
        renderAssetList();
    });
    document.getElementById("status-filter").addEventListener("change", (event) => {
        filters.status = event.target.value;
        renderAssetList();
    });
    document.getElementById("link-filter").addEventListener("change", (event) => {
        filters.link = event.target.value;
        renderAssetList();
    });
}

function render() {
    renderFilterChips();
    renderAssetList();
    renderTechnologyMap();
}

function init() {
    initSelect("type-filter", getUniqueValues("type"), "자산 유형 전체");
    initSelect("status-filter", getUniqueValues("status"), "상태 전체");
    initSelect("link-filter", ["AI 연계", "타 Domain 연계"], "연계 전체");
    bindEvents();
    renderMetrics();
    render();
}

document.addEventListener("DOMContentLoaded", init);
