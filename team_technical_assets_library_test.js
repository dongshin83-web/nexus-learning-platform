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
const TYPE_SPECIFIC_KEYS = {
    "방법론": ["problemAndPurpose", "technicalPrinciples", "inputsAndPrerequisites", "standardProcedure", "resultsAndCriteria", "scopeAndLimits", "validationAndReuse"],
    "BP": ["businessContext", "simulationResponse", "businessFeedback", "businessImpact", "reproductionConditions", "evidence"],
    "VD Request": ["context", "primaryQuestion", "inputsAndConstraints", "approach", "result", "judgmentScope", "limitations", "followUp"],
    "CoR": ["backgroundAndGap", "objectiveAndSuccessCriteria", "scopeAndPlan", "validationDesign", "progressDecisions", "resultAndJudgment", "outputsAndFollowUp"],
    "기술보고서": ["questionAndPurpose", "scopeAndConditions", "methodAndEvidence", "findingsAndConclusion", "validConditionsAndDecisions", "limitations", "officialSource"],
    "외부 보고 자료": ["reportPurpose", "audienceAndDecision", "approvedMessages", "sourceAssetsAndEvidence", "disclosureScope", "versionAndValidity", "limitationsAndNotes"],
    "노하우": ["knowhowCategory", "symptomAndConditions", "causeAndDiagnosis", "resolution", "effectAndEvidence", "risksAndRecovery", "versionsAndSources"],
    "Tool Manual": ["purposeAndOutput", "prerequisites", "procedure", "completionCheck", "errorsAndWarnings", "versionsAndSources"],
    "교육자료": ["learningObjectives", "audienceAndPrerequisites", "outline", "activities", "completionCriteria", "sourcesAndVersion"]
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

export function createSampleHandoff(cardType = "VD Request") {
    const type = CARD_TYPES.includes(cardType) ? cardType : "VD Request";
    return {
        packetVersion: "0.1",
        cardTypeCandidate: type,
        workingTitle: "[샘플] 기존 자산을 활용한 신규 판단 기록",
        abstractContext: "기존 Library 자산을 새로운 조건에 적용해 판단 근거를 보완한 Test Handoff입니다.",
        primaryQuestion: "기존 자산의 판단 구조를 새로운 조건에 재사용할 수 있는가?",
        inputsAndConstraints: ["실제 조건은 사내에서 복원", "적용범위 확인 필요"],
        approachOrContent: "기존 자산을 검색하고 적용 가능한 절차와 판단 기준을 선별했습니다.",
        observationsAndResult: "새 조건에서 확인한 결과와 한계는 사내 등록 단계에서 보완합니다.",
        evidenceAvailable: ["사내 근거 링크 연결 필요"],
        validConditions: ["기존 자산과 신규 조건의 차이 확인 필요"],
        limitationsAndUnknowns: ["확인 필요"],
        reuseOrFollowUp: ["Reviewer 검토 필요"],
        searchTerms: ["기존 자산 재사용", "판단 근거", "조건 변경 적용"],
        relatedAssetCandidates: ["사내 Library에서 검색"],
        placeholdersToRestoreInternally: ["실제 제목", "담당자", "Reviewer", "원본 링크", "적용 조건"],
        itemsToConfirm: ["기존 자산 관계", "Technology Map 연결", "Learning Path 연결"],
        securitySelfCheck: "pass",
        typeSpecific: Object.fromEntries((TYPE_SPECIFIC_KEYS[type] ?? []).map((key) => [key, "확인 필요"]))
    };
}

export function validateHandoffPacket(packet, expectedType) {
    const errors = [];
    if (!packet || typeof packet !== "object" || Array.isArray(packet)) errors.push("Handoff는 JSON 객체여야 합니다.");
    if (packet?.packetVersion !== "0.1") errors.push("packetVersion 0.1을 확인하세요.");
    if (packet?.cardTypeCandidate !== expectedType) errors.push("선택한 Asset type과 cardTypeCandidate가 일치하지 않습니다.");
    if (packet?.securitySelfCheck !== "pass") errors.push("securitySelfCheck가 pass인지 확인하세요.");
    if (!packet?.typeSpecific || typeof packet.typeSpecific !== "object" || Array.isArray(packet.typeSpecific)) errors.push("typeSpecific 객체가 필요합니다.");
    return { errors, passed: errors.length === 0 };
}

export function deriveDraftFromCards(selectedCards, input = {}, generatedRegistrationId = registrationId(), handoffPacket = null) {
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
    const technologyMapDecision = String(input.technologyMapDecision ?? "").trim();
    const technologyMapReason = String(input.technologyMapReason ?? "").trim();
    const learningPathDecision = String(input.learningPathDecision ?? "").trim();
    const learningPathReason = String(input.learningPathReason ?? "").trim();
    const frameworkLinks = [];
    if (technologyMapDecision === "linked" && technologyMapReason) frameworkLinks.push({ framework: "technology-map", targetType: "methodology", targetId: technologyMapReason, relationType: "REFERENCES", note: relationNote, confirmed: true });
    if (learningPathDecision === "linked" && learningPathReason) frameworkLinks.push({ framework: "learning-path", targetType: "capability", targetId: learningPathReason, relationType: "REFERENCES", note: relationNote, confirmed: true });

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
        reviewer: String(input.reviewer ?? "").trim(),
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
        links: String(input.sourceUrl ?? "").trim() ? [{
            label: String(input.sourceLabel ?? "").trim(),
            href: String(input.sourceUrl ?? "").trim(),
            assetType: "사내 원본",
            system: "사내 시스템",
            role: "source",
            accessScope: "사내",
            status: "pending"
        }] : [],
        relations: cards.map((card) => ({
            type: "BASED_ON",
            targetId: card.id,
            note: relationNote,
            confirmed: Boolean(input.relationConfirmed)
        })),
        frameworkLinks,
        frameworkLinkDecisions: {
            technologyMap: technologyMapDecision === "linked" ? { status: "linked" } : { status: technologyMapDecision, reason: technologyMapReason },
            learningPath: learningPathDecision === "linked" ? { status: "linked" } : { status: learningPathDecision, reason: learningPathReason }
        },
        searchReuse: {
            performed: cards.length > 0,
            foundAssetIds: cards.map((card) => card.id),
            usageType: "기존 자산 기반 등록",
            outcome: "확인 필요",
            reviewerConfirmed: Boolean(String(input.reviewer ?? "").trim())
        },
        aiAssistance: {
            externalStructured: Boolean(handoffPacket),
            internalClineStructured: false,
            humanConfirmed: Boolean(input.humanConfirmed)
        },
        content: handoffPacket?.typeSpecific ?? {},
        changeLog: [{
            changedAt: today(),
            changedBy: String(input.registrant ?? "").trim(),
            changeType: "생성",
            reason: "기존 Library 카드 기반 등록 Test에서 초안 생성"
        }],
        registrationSource: {
            method: "library-card-basis-test",
            handoffPacketVersion: handoffPacket?.packetVersion ?? "",
            basisCardIds: cards.map((card) => card.id),
            testOnly: true
        }
    };
}

export function validateBasisDraft(draft, existingCards = [], workflow = {}) {
    const errors = [];
    const warnings = [];
    if (!workflow.conversationComplete) errors.push("1단계 AI 대화 완료를 확인하세요.");
    if (!workflow.securityComplete) errors.push("1단계 일반화·보안 경계를 확인하세요.");
    if (!workflow.fileReady) errors.push("2단계 Handoff JSON 파일 확인을 완료하세요.");
    if (!workflow.handoffValid) errors.push("3단계에서 유효한 Handoff JSON을 반입하세요.");
    if (!draft.registrationSource?.basisCardIds?.length) errors.push("기반 카드를 1개 이상 선택해야 합니다.");
    [["title", "새 카드 제목"], ["id", "자산 ID"], ["owner", "담당자"], ["registrant", "등록자"], ["reviewer", "Reviewer"], ["useCase", "새 활용 상황"], ["summary", "신규 카드 요약"], ["contents", "새로 확인한 내용"]]
        .forEach(([key, label]) => { if (!String(draft[key] ?? "").trim()) errors.push(`${label}을(를) 입력하세요.`); });
    if (!/^[a-z0-9][a-z0-9-]*$/.test(draft.id)) errors.push("자산 ID는 영문 소문자, 숫자와 하이픈만 사용할 수 있습니다.");
    if (existingCards.some((card) => card.id === draft.id)) errors.push("이미 사용 중인 자산 ID입니다.");
    if (draft.relations.some((relation) => !relation.note)) errors.push("기반 카드 활용 내용을 입력하세요.");
    if (draft.relations.some((relation) => relation.confirmed !== true)) errors.push("기존 자산 관계와 활용 내용을 확인하세요.");
    if (!draft.links.length || !draft.links[0].label) errors.push("사내 원본 이름을 입력하세요.");
    if (!draft.links.length || !/^https:\/\//i.test(draft.links[0].href)) errors.push("사내 원본 URL은 https:// 주소여야 합니다.");
    ["technologyMap", "learningPath"].forEach((key) => {
        const decision = draft.frameworkLinkDecisions?.[key];
        if (!decision?.status) errors.push(`${key === "technologyMap" ? "Technology Map" : "Learning Path"} 연결 판단을 선택하세요.`);
        if (decision?.status === "linked" && !draft.frameworkLinks.some((link) => link.framework === (key === "technologyMap" ? "technology-map" : "learning-path"))) errors.push(`${key === "technologyMap" ? "Technology Map" : "Learning Path"} 연결 대상 ID를 입력하세요.`);
        if (decision?.status && decision.status !== "linked" && !decision.reason) errors.push(`${key === "technologyMap" ? "Technology Map" : "Learning Path"} 판단 사유를 입력하세요.`);
    });
    if (draft.aiAssistance?.humanConfirmed !== true) errors.push("사실·적용범위·한계·보안 경계를 사람이 최종 확인해야 합니다.");
    if (!draft.contexts.length) warnings.push("선택한 카드에 활용 맥락이 없어 등록 시 직접 보완해야 합니다.");
    if (draft.relations.length > 3) warnings.push("기반 카드가 많습니다. 실제로 사용한 핵심 자산인지 다시 확인하세요.");
    warnings.push("Dry-run Test입니다. 실제 운영 DB 저장과 Reviewer 알림은 수행하지 않습니다.");
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
