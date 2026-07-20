const CARD_TYPES = ["방법론", "BP", "VD Request", "CoR", "기술보고서", "외부 보고 자료", "노하우", "Tool Manual", "교육자료"];
const TYPE_STATUS = {
    "방법론": "방법론 후보",
    "BP": "BP 후보",
    "VD Request": "접수",
    "CoR": "제안",
    "기술보고서": "작성 중",
    "외부 보고 자료": "작성 중",
    "노하우": "작성 중",
    "Tool Manual": "작성 중",
    "교육자료": "작성 중"
};
const DOMAIN_LABELS = {
    deformation: "변형",
    delamination: "박리",
    impact: "충격",
    thermal: "열유동",
    fatigue: "피로",
    vibration: "진동",
    other: "기타"
};

export function normalizeText(value) {
    return String(value ?? "").normalize("NFKC").toLocaleLowerCase("ko").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
}

export function slugify(value) {
    return String(value ?? "")
        .normalize("NFKD")
        .toLocaleLowerCase("en")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 72);
}

function unique(values) {
    return [...new Set(values.map((value) => String(value ?? "").trim()).filter(Boolean))];
}

function today() {
    return new Date().toISOString().slice(0, 10);
}

function registrationId() {
    const stamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "0");
    return `REG-${stamp}-${suffix}`;
}

export function deriveDraftFromCards(selectedCards, input = {}, generatedRegistrationId = registrationId()) {
    const cards = Array.isArray(selectedCards) ? selectedCards.filter(Boolean) : [];
    const selectedDomains = unique(cards.map((card) => card.domain));
    const inheritedContexts = unique(cards.flatMap((card) => card.contexts ?? []));
    const inheritedTags = unique(cards.flatMap((card) => [...(card.tags ?? []), ...(card.aliases ?? [])])).filter((tag) => tag !== "샘플 데이터");
    const addedTags = unique(String(input.tags ?? "").split(","));
    const title = String(input.title ?? "").trim();
    const id = String(input.id ?? "").trim() || slugify(title);
    const type = CARD_TYPES.includes(input.type) ? input.type : "VD Request";
    const domain = String(input.domain ?? "").trim() || (selectedDomains.length === 1 ? selectedDomains[0] : "other");
    const relationNote = String(input.relationNote ?? "").trim();

    return {
        schemaVersion: "1.0",
        registrationId: generatedRegistrationId,
        id,
        type,
        title,
        domain,
        secondaryDomains: selectedDomains.filter((value) => value !== domain),
        publicationStatus: "초안",
        status: TYPE_STATUS[type],
        owner: String(input.owner ?? "").trim(),
        registrant: String(input.registrant ?? "").trim(),
        reviewer: "",
        contributors: [],
        createdAt: today(),
        updatedAt: today(),
        tags: unique([...inheritedTags, ...addedTags]).slice(0, 20),
        contexts: inheritedContexts,
        aliases: unique(cards.flatMap((card) => [card.title, ...(card.aliases ?? [])])).slice(0, 20),
        summary: String(input.summary ?? "").trim(),
        useCase: String(input.useCase ?? "").trim(),
        contents: String(input.contents ?? "").trim(),
        sourceIds: [],
        links: [],
        relations: cards.map((card) => ({
            type: "BASED_ON",
            targetId: card.id,
            note: relationNote,
            confirmed: false
        })),
        frameworkLinks: [],
        frameworkLinkDecisions: {
            technologyMap: { status: "not_applicable", reason: "Test 초안에서 연결 여부 확인 필요" },
            learningPath: { status: "not_applicable", reason: "Test 초안에서 연결 여부 확인 필요" }
        },
        searchReuse: {
            performed: cards.length > 0,
            foundAssetIds: cards.map((card) => card.id),
            usageType: "기존 자산 기반 등록",
            outcome: "확인 필요",
            reviewerConfirmed: false
        },
        aiAssistance: {
            externalStructured: false,
            internalClineStructured: false,
            humanConfirmed: false
        },
        content: {},
        changeLog: [{
            changedAt: today(),
            changedBy: String(input.registrant ?? "").trim(),
            changeType: "생성",
            reason: "기존 Library 카드 기반 등록 Test에서 초안 생성"
        }],
        registrationSource: {
            method: "library-card-basis-test",
            basisCardIds: cards.map((card) => card.id),
            testOnly: true
        }
    };
}

export function validateBasisDraft(draft, existingCards = []) {
    const errors = [];
    const warnings = [];
    if (!draft.registrationSource?.basisCardIds?.length) errors.push("기반 카드를 1개 이상 선택해야 합니다.");
    [["title", "새 카드 제목"], ["id", "자산 ID"], ["owner", "담당자"], ["registrant", "등록자"], ["useCase", "새 활용 상황"], ["summary", "신규 카드 요약"], ["contents", "새로 확인한 내용"]]
        .forEach(([key, label]) => { if (!String(draft[key] ?? "").trim()) errors.push(`${label}을(를) 입력하세요.`); });
    if (!/^[a-z0-9][a-z0-9-]*$/.test(draft.id)) errors.push("자산 ID는 영문 소문자, 숫자와 하이픈만 사용할 수 있습니다.");
    if (existingCards.some((card) => card.id === draft.id)) errors.push("이미 사용 중인 자산 ID입니다.");
    if (draft.relations.some((relation) => !relation.note)) errors.push("기반 카드 활용 내용을 입력하세요.");
    if (!draft.contexts.length) warnings.push("선택한 카드에 활용 맥락이 없어 등록 시 직접 보완해야 합니다.");
    if (draft.relations.length > 3) warnings.push("기반 카드가 많습니다. 실제로 사용한 핵심 자산인지 다시 확인하세요.");
    warnings.push("Test 초안입니다. 유형별 필수 본문, 사내 원본 링크와 Reviewer 확인은 별도 등록 단계에서 보완해야 합니다.");
    return { errors, warnings, passed: errors.length === 0 };
}

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

function cardSearchText(card) {
    return normalizeText([card.id, card.type, card.title, card.summary, card.useCase, card.domain, ...(card.tags ?? []), ...(card.aliases ?? []), ...(card.contexts ?? [])].join(" "));
}

function initializePage() {
    const cards = Array.isArray(window.TECHNICAL_ASSET_LIBRARY?.cards) ? window.TECHNICAL_ASSET_LIBRARY.cards : [];
    const selectedIds = new Set();
    const generatedRegistrationId = registrationId();
    const form = document.getElementById("basis-draft-form");
    const typeFilter = document.getElementById("basis-type-filter");
    const typeSelect = form.elements.type;
    const domainSelect = form.elements.domain;
    let latestDraft = null;
    let latestValidation = null;

    CARD_TYPES.forEach((type) => {
        typeFilter.add(new Option(type, type));
        typeSelect.add(new Option(type, type));
    });
    Object.entries(DOMAIN_LABELS).forEach(([value, label]) => domainSelect.add(new Option(label, value)));
    typeSelect.value = "VD Request";
    domainSelect.value = "other";
    document.getElementById("basis-source-count").textContent = String(cards.length);

    function selectedCards() {
        return cards.filter((card) => selectedIds.has(card.id));
    }

    function renderCards() {
        const query = normalizeText(document.getElementById("basis-search").value);
        const selectedType = typeFilter.value;
        const filtered = cards.filter((card) => (!query || cardSearchText(card).includes(query)) && (selectedType === "all" || card.type === selectedType));
        document.getElementById("basis-result-summary").textContent = `${filtered.length}개 카드 · 선택 ${selectedIds.size}개`;
        document.getElementById("basis-card-list").innerHTML = filtered.length ? filtered.map((card) => `
            <label class="basis-card-row${selectedIds.has(card.id) ? " is-selected" : ""}">
                <input type="checkbox" value="${escapeHtml(card.id)}" ${selectedIds.has(card.id) ? "checked" : ""}>
                <span class="basis-card-row-copy">
                    <span><b>${escapeHtml(card.type)}</b><em>${escapeHtml(DOMAIN_LABELS[card.domain] ?? card.domain)}</em>${card.demo ? "<em>샘플</em>" : ""}</span>
                    <strong>${escapeHtml(card.title)}</strong>
                    <small>${escapeHtml(card.summary)}</small>
                </span>
            </label>`).join("") : '<p class="basis-empty">검색 조건에 맞는 카드가 없습니다.</p>';
    }

    function renderSelection() {
        const selected = selectedCards();
        const list = document.getElementById("basis-selected-list");
        list.innerHTML = selected.length ? selected.map((card) => `<li><span><b>${escapeHtml(card.type)}</b>${escapeHtml(card.title)}</span><button type="button" data-remove-basis="${escapeHtml(card.id)}" aria-label="${escapeHtml(card.title)} 선택 해제"><i class="bx bx-x"></i></button></li>`).join("") : '<li class="basis-empty">아직 선택한 카드가 없습니다.</li>';
        document.getElementById("basis-selected-count").textContent = String(selected.length);

        const domains = unique(selected.map((card) => card.domain));
        const contexts = unique(selected.flatMap((card) => card.contexts ?? []));
        const tags = unique(selected.flatMap((card) => card.tags ?? [])).filter((tag) => tag !== "샘플 데이터");
        document.getElementById("basis-inherited-domain").textContent = domains.map((value) => DOMAIN_LABELS[value] ?? value).join(", ") || "—";
        document.getElementById("basis-inherited-contexts").textContent = contexts.join(", ") || "—";
        document.getElementById("basis-inherited-tags").textContent = tags.slice(0, 8).join(", ") || "—";
        document.getElementById("basis-inherited-relations").textContent = selected.length ? `BASED_ON ${selected.length}건` : "—";

        if (selected.length === 1) domainSelect.value = selected[0].domain;
        updateDraft();
    }

    function formValues() {
        return Object.fromEntries(new FormData(form).entries());
    }

    function updateDraft() {
        const input = formValues();
        if (input.title && !form.elements.id.dataset.edited) form.elements.id.value = slugify(input.title);
        latestDraft = deriveDraftFromCards(selectedCards(), formValues(), generatedRegistrationId);
        latestValidation = validateBasisDraft(latestDraft, cards);
        document.getElementById("basis-json-preview").textContent = JSON.stringify(latestDraft, null, 2);
        document.getElementById("basis-readiness").textContent = latestValidation.passed ? "기반 등록 가능" : "입력 필요";
        document.getElementById("basis-readiness").dataset.state = latestValidation.passed ? "passed" : "pending";
        document.getElementById("basis-validation").innerHTML = [
            ...latestValidation.errors.map((message) => `<p class="basis-validation-item is-error"><i class="bx bx-error-circle"></i><span>${escapeHtml(message)}</span></p>`),
            ...(latestValidation.passed ? ['<p class="basis-validation-item is-success"><i class="bx bx-check-circle"></i><span>기존 카드의 분류·검색어·관계를 포함한 신규 등록 초안을 생성할 수 있습니다.</span></p>'] : []),
            ...latestValidation.warnings.map((message) => `<p class="basis-validation-item is-warning"><i class="bx bx-info-circle"></i><span>${escapeHtml(message)}</span></p>`)
        ].join("");
        document.getElementById("basis-copy-json").disabled = !latestValidation.passed;
        document.getElementById("basis-download-json").disabled = !latestValidation.passed;
    }

    document.getElementById("basis-search").addEventListener("input", renderCards);
    typeFilter.addEventListener("change", renderCards);
    document.getElementById("basis-card-list").addEventListener("change", (event) => {
        if (!event.target.matches('input[type="checkbox"]')) return;
        if (event.target.checked) selectedIds.add(event.target.value);
        else selectedIds.delete(event.target.value);
        renderCards();
        renderSelection();
    });
    document.getElementById("basis-selected-list").addEventListener("click", (event) => {
        const button = event.target.closest("[data-remove-basis]");
        if (!button) return;
        selectedIds.delete(button.dataset.removeBasis);
        renderCards();
        renderSelection();
    });
    document.getElementById("basis-clear-selection").addEventListener("click", () => {
        selectedIds.clear();
        renderCards();
        renderSelection();
    });
    form.addEventListener("input", (event) => {
        if (event.target.name === "id") event.target.dataset.edited = "true";
        updateDraft();
    });
    form.addEventListener("change", updateDraft);
    document.getElementById("basis-copy-json").addEventListener("click", async () => {
        if (!latestValidation?.passed) return;
        await navigator.clipboard.writeText(`${JSON.stringify(latestDraft, null, 2)}\n`);
        document.getElementById("basis-copy-json").innerHTML = '<i class="bx bx-check"></i>복사 완료';
    });
    document.getElementById("basis-download-json").addEventListener("click", () => {
        if (!latestValidation?.passed) return;
        const blob = new Blob([`${JSON.stringify(latestDraft, null, 2)}\n`], { type: "application/json;charset=utf-8" });
        const anchor = document.createElement("a");
        anchor.href = URL.createObjectURL(blob);
        anchor.download = `${latestDraft.id}.test.json`;
        anchor.click();
        URL.revokeObjectURL(anchor.href);
    });

    renderCards();
    renderSelection();
}

if (typeof document !== "undefined") initializePage();
