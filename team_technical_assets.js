const technologyDomains = [
    { id: "deformation", label: "01. 변형", description: "구조 변형, 형상 안정성, 공정/사용 조건에서의 치수 변화와 설계 판단 기준" },
    { id: "delamination", label: "02. 박리", description: "계면 박리, 접착/층간 취약 조건과 실험 피드백 기반 판단 기준" },
    { id: "impact", label: "03. 충격", description: "Drop, 충격 취약부, 평가 조건과 연결되는 구조 리스크" },
    { id: "thermal-flow", label: "04. 열유동", description: "온도장, 유동 조건, 열-구조 연계와 공정 조건 판단" },
    { id: "fatigue", label: "05. 피로", description: "반복 하중, 열사이클, 수명 예측과 신뢰성 판단" },
    { id: "vibration", label: "06. 진동", description: "모드, 가진 조건, 동특성과 설계 취약 조건" },
    { id: "other", label: "07. 기타", description: "복합 Domain, 신규 방법론, 공통 기준, 교육/운영 자산" }
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
        decisionImpact: "공정 조건 변경 전 변형 리스크를 비교하고 허용 가능한 설계/공정 선택지를 좁히는 판단 근거로 사용한다.",
        reusableAssets: "적층 구조 모델, 온도 의존 물성, 공정 온도 이력, 변형량 비교 기준",
        learningUse: "신규 인원이 적층 구조의 변형 원인과 상대 비교 방식, 물성 민감도 점검 절차를 학습할 수 있다.",
        links: [{ label: "BP 문서", href: "#" }, { label: "모델 폴더", href: "#" }, { label: "검토 코멘트", href: "#" }]
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
        links: [{ label: "후보 요약", href: "#" }, { label: "실험 피드백", href: "#" }]
    },
    {
        id: "model-impact-drop",
        title: "Drop 충격 취약부 탐색 모델",
        type: "모델",
        domain: "impact",
        status: "작성중",
        owner: "3파트",
        tags: ["타 Domain 연계", "신뢰성 연계", "실험/평가 연계"],
        decisionImpact: "동일 조건에서 취약부와 설계안 차이를 비교해 평가 전 검토 우선순위를 정한다.",
        reusableAssets: "충격 모델 세팅, 접촉 조건, 재료 모델, 취약부 비교 기준",
        learningUse: "충격 해석에서 경계조건과 접촉 조건이 결과 해석에 미치는 영향을 학습한다.",
        links: [{ label: "모델 세팅", href: "#" }, { label: "결과 비교표", href: "#" }]
    },
    {
        id: "standard-thermal-flow",
        title: "열유동-구조 연계 판단 기준",
        type: "판단 기준",
        domain: "thermal-flow",
        status: "후보",
        owner: "공통",
        tags: ["AI 연계", "타 Domain 연계", "공정 연계"],
        decisionImpact: "열유동 결과를 구조 해석 입력으로 넘길 때 필요한 온도장, 시간축, 보수성 기준을 정렬한다.",
        reusableAssets: "온도장 전달 규칙, mesh 매핑 주의점, 보수 조건 정의, 연계 검토 체크리스트",
        learningUse: "다른 Domain 결과를 받아 구조 판단으로 전환할 때 빠뜨리기 쉬운 확인 항목을 학습한다.",
        links: [{ label: "연계 기준 초안", href: "#" }, { label: "데이터 변환 예시", href: "#" }]
    },
    {
        id: "bp-fatigue-cycle",
        title: "열사이클 피로 수명 검토 사례",
        type: "BP",
        domain: "fatigue",
        status: "보완필요",
        owner: "2파트",
        tags: ["신뢰성 연계", "실험/평가 연계", "소재/물성 연계"],
        decisionImpact: "반복 열하중 조건에서 취약 구조를 비교하고 평가 조건과 설계 보완 방향을 연결한다.",
        reusableAssets: "열사이클 조건, 피로 물성, 손상 누적 가정, 수명 비교 기준",
        learningUse: "수명 예측 결과를 절대 정답으로 보지 않고 조건별 상대 비교와 한계 표시를 학습한다.",
        links: [{ label: "보완 요청", href: "#" }, { label: "원천 조건", href: "#" }]
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
        links: [{ label: "모드 비교", href: "#" }, { label: "검증 메모", href: "#" }]
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
        links: [{ label: "검색 가이드", href: "#" }, { label: "요약 예시", href: "#" }]
    },
    {
        id: "standard-review-sheet",
        title: "Reviewer Comment Sheet 초안",
        type: "운영 기준",
        domain: "other",
        status: "등록완료",
        owner: "공통",
        tags: ["고객/사업부 대응", "Virtual Twin 연계"],
        decisionImpact: "작성자와 Reviewer가 같은 기준으로 의사결정 영향, 재사용성, 교육 활용성을 검토한다.",
        reusableAssets: "검토 질문, 판정 옵션, 보완 요청 항목, 승인 전 체크리스트",
        learningUse: "리뷰가 개인 취향이 아니라 팀 공통 기준에 따라 이루어지게 한다.",
        links: [{ label: "검토표", href: "#" }, { label: "작성 예시", href: "#" }]
    }
];

const domainById = Object.fromEntries(technologyDomains.map((domain) => [domain.id, domain]));
const filters = { search: "", domain: "all", tag: "all", type: "all", status: "all", link: "all" };
let selectedAssetId = null;

function getUniqueValues(key) {
    return [...new Set(technicalAssets.map((asset) => asset[key]))].sort((a, b) => a.localeCompare(b, "ko"));
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
    setText("metric-total", technicalAssets.length);
    setText("metric-domain", technologyDomains.length);
    setText("metric-linked", technicalAssets.filter((asset) => asset.tags.includes("AI 연계") || asset.tags.includes("타 Domain 연계")).length);
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

        return (!keyword || haystack.includes(keyword))
            && (filters.domain === "all" || asset.domain === filters.domain)
            && (filters.tag === "all" || asset.tags.includes(filters.tag))
            && (filters.type === "all" || asset.type === filters.type)
            && (filters.status === "all" || asset.status === filters.status)
            && (filters.link === "all" || asset.tags.includes(filters.link));
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

    const assets = getFilteredAssets();
    list.innerHTML = "";

    if (!assets.length) {
        selectedAssetId = null;
        list.innerHTML = `<div class="detail-empty"><strong>조건에 맞는 샘플이 없습니다.</strong><p>검색어 또는 필터를 줄여 다시 확인하세요.</p></div>`;
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
            <div class="badge-row" style="margin-top: 0.8rem;">${asset.tags.map((tag) => `<span class="badge">${tag}</span>`).join("")}</div>
            <div class="asset-footer">
                <span><i class="bx bx-user"></i> ${asset.owner}</span>
                <span>${asset.links.length} links <i class="bx bx-link-external"></i></span>
            </div>
        `;
        card.addEventListener("click", () => selectAsset(asset.id));
        card.addEventListener("keydown", (event) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                selectAsset(asset.id);
            }
        });
        list.appendChild(card);
    });

    renderDetail(technicalAssets.find((asset) => asset.id === selectedAssetId));
}

function selectAsset(assetId) {
    selectedAssetId = assetId;
    renderLibrary();
}

function renderDetail(asset) {
    const panel = document.getElementById("detail-panel");
    if (!panel) return;
    if (!asset) {
        panel.innerHTML = `<div class="detail-empty"><strong>자산을 선택하세요.</strong><p>왼쪽 카드에서 대표 사례를 누르면 상세 정보와 내부 링크 placeholder를 확인할 수 있습니다.</p></div>`;
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
            <div class="detail-item"><span>의사결정 영향</span><strong>${asset.decisionImpact}</strong></div>
            <div class="detail-item"><span>재사용 요소</span><strong>${asset.reusableAssets}</strong></div>
            <div class="detail-item"><span>성장/교육 활용</span><strong>${asset.learningUse}</strong></div>
        </div>
        <div class="badge-row">${asset.tags.map((tag) => `<span class="badge">${tag}</span>`).join("")}</div>
        <div style="display: grid; gap: 0.5rem; margin-top: 1rem;">
            ${asset.links.map((link) => `<a class="btn btn-secondary" href="${link.href}" onclick="return false;" title="내부 환경에서 실제 링크로 교체"><i class="bx bx-link-alt"></i>${link.label}</a>`).join("")}
        </div>
    `;
}

function renderMap() {
    const wrap = document.getElementById("map-grid");
    if (!wrap) return;
    wrap.innerHTML = "";

    technologyDomains.forEach((domain) => {
        const assets = technicalAssets.filter((asset) => asset.domain === domain.id);
        const linked = assets.filter((asset) => asset.tags.includes("AI 연계") || asset.tags.includes("타 Domain 연계")).length;
        const card = document.createElement("article");
        card.className = "map-card clickable";
        card.innerHTML = `
            <header>
                <h3>${domain.label}</h3>
                <span class="badge domain">${assets.length}건</span>
            </header>
            <p>${domain.description}</p>
            <div class="badge-row" style="margin-top: 0.8rem;">
                <span class="badge">${linked} linked</span>
                <span class="badge">${assets.length ? "샘플 있음" : "추가 필요"}</span>
            </div>
        `;
        card.addEventListener("click", () => {
            window.location.href = `team_technical_assets_library.html?domain=${encodeURIComponent(domain.id)}`;
        });
        wrap.appendChild(card);
    });
}

function renderTagMatrix() {
    const wrap = document.getElementById("tag-matrix");
    if (!wrap) return;
    wrap.innerHTML = "";

    auxiliaryTags.forEach((tag) => {
        const count = technicalAssets.filter((asset) => asset.tags.includes(tag)).length;
        const card = document.createElement("article");
        card.className = "guide-card";
        card.innerHTML = `<h3>${tag}</h3><p>${count}개 샘플에서 사용 중입니다. 실제 내부 운영에서는 기술영역을 넘나드는 연결성을 확인하는 필터로 씁니다.</p>`;
        wrap.appendChild(card);
    });
}

function bindLibraryEvents() {
    initSelect("type-filter", getUniqueValues("type"), "자산 유형 전체");
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
        renderLibrary();
    }
    if (page === "map") {
        renderMap();
        renderTagMatrix();
    }
}

document.addEventListener("DOMContentLoaded", initPage);
