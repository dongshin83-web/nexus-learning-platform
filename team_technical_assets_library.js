/*
 * Library-only search, filter, list and detail behavior.
 * The shared pages intentionally do not depend on this file.
 */
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


function getUniqueValues(key) {
    return [...new Set(libraryItems.map((item) => item[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b, "ko"));
}

function makeOption(label, value) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    return option;
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

function initLibraryPage() {
    if (document.body.dataset.page !== "library") return;
    renderLibraryMetrics();
    bindLibraryEvents();
    renderLibrary();
    const assetId = new URLSearchParams(window.location.search).get("asset");
    if (assetId && libraryItems.some((item) => item.id === assetId)) {
        window.requestAnimationFrame(() => openFullDetail(assetId));
    }
}

document.addEventListener("DOMContentLoaded", initLibraryPage);
