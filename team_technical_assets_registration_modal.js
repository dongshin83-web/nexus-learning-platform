(() => {
    const TYPES = ["방법론", "BP", "VD Request", "CoR", "기술보고서", "외부 보고 자료", "노하우", "Tool Manual", "교육자료"];
    const TYPE_ALIASES = { "임원 보고 자료": "외부 보고 자료", "Trouble Shooting": "노하우" };
    const DOMAINS = [
        ["deformation", "01. 변형"], ["delamination", "02. 박리"], ["impact", "03. 충격"],
        ["thermal-flow", "04. 열유동"], ["fatigue", "05. 피로"], ["vibration", "06. 진동"], ["other", "07. 기타"]
    ];
    const PUBLICATION_STATUSES = ["초안", "검토 중", "게시", "개정 필요", "폐기"];
    const RELATION_TYPES = ["USES", "ADAPTS", "VALIDATES", "REVEALS_GAP", "EVIDENCE_FOR", "PRODUCES", "TRIGGERS", "ORIGINATES_FROM", "DEVELOPS", "DOCUMENTS", "DERIVED_FROM", "REFERENCES", "ENABLES", "IMPROVES", "TEACHES", "PRACTICES"];
    const RELATION_TYPE_ALIASES = { EVIDENCES: "EVIDENCE_FOR", RELATED_TO: "REFERENCES", RESULTED_IN: "PRODUCES" };
    const FRAMEWORKS = [
        { id: "technology-map", label: "Technology Map", registryKey: "technologyMap" },
        { id: "learning-path", label: "Learning Path", registryKey: "learningPath" }
    ];
    const FRAMEWORK_DECISIONS = [
        ["linked", "연결됨"],
        ["not_applicable", "해당 없음"],
        ["target_missing", "대상 없음"]
    ];
    const FRAMEWORK_RELATION_TYPES = [
        ["DEFINES", "정의·판단 기준"],
        ["TEACHES", "학습 자료"],
        ["PRACTICES", "실습 자료"],
        ["ENABLES", "실행 도구"],
        ["EXAMPLE_OF", "대표 사례"],
        ["APPLIES", "적용 사례"],
        ["VALIDATES", "검증 자료"],
        ["EVIDENCE_FOR", "판단 근거"],
        ["REFERENCES", "참고 자료"]
    ];
    const LINK_TYPES = ["VD Request 원문", "Simulation 결과보고서", "기술보고서", "BP", "CoR", "모델·해석 파일", "시험 결과", "요구사항·회의체 결정", "교육자료", "기타 사내 시스템"];
    const LINK_ROLES = [["source", "원본"], ["evidence", "검증 근거"], ["deliverable", "결과물"], ["model", "모델·해석 파일"], ["decision", "의사결정 기록"], ["reference", "참고자료"]];
    const ACCESS_SCOPES = ["VDE 내부", "CTO 내부", "사업부 협업", "회사 전체", "권한 확인 필요"];

    const dialog = document.getElementById("asset-registration-dialog");
    const form = document.getElementById("asset-registration-form");
    if (!dialog || !form) return;

    const fileInput = document.getElementById("registration-json-file");
    const dropZone = document.getElementById("registration-drop-zone");
    const nextButton = document.getElementById("registration-next");
    const previousButton = document.getElementById("registration-previous");
    const downloadButton = document.getElementById("registration-download");
    const importMessage = document.getElementById("registration-import-message");
    const preview = document.getElementById("registration-json-preview");
    const validation = document.getElementById("registration-validation");
    const submitNote = document.getElementById("registration-submit-note") || form.querySelector(".registration-static-note");
    const publishProcessTitle = document.getElementById("registration-publish-process-title");
    const publishProcessList = document.getElementById("registration-publish-process-list") || form.querySelector(".registration-publish-process ol");
    const runtime = window.TECHNICAL_ASSET_RUNTIME ?? { mode: "static" };
    const repository = typeof window.createTechnicalAssetRepository === "function"
        ? window.createTechnicalAssetRepository(runtime)
        : null;
    const isApiMode = runtime.mode === "api";
    let currentStep = 1;
    let sourcePacket = null;
    let sourceFileName = "";
    let returnFocus = null;
    let selectedRelations = [];
    let selectedFrameworkLinks = [];
    let frameworkDecisions = createEmptyFrameworkDecisions();
    let frameworkSearchQueries = createEmptyFrameworkSearchQueries();
    let internalLinks = [];
    let relationSearchPerformed = false;
    let registrationId = "";

    function configureRegistrationCompletionUi() {
        const finalIndicator = form.querySelector('[data-registration-step-indicator="4"]');
        if (finalIndicator) finalIndicator.innerHTML = "<span>4</span>검증·등록";

        if (submitNote) {
            submitNote.innerHTML = '<i class="bx bx-info-circle"></i>검증 후 Library에 등록하고 Reviewer 검토를 요청합니다.';
        }
        if (publishProcessTitle) publishProcessTitle.textContent = "등록 후 게시 순서";
        if (publishProcessList) {
            publishProcessList.innerHTML = `
                <li><span>1</span><div><strong>Library 등록</strong><p>검증을 통과한 자산을 Library에 등록합니다.</p></div></li>
                <li><span>2</span><div><strong>Reviewer 검토</strong><p>등록과 동시에 Reviewer에게 검토를 요청합니다.</p></div></li>
                <li><span>3</span><div><strong>승인·게시</strong><p>Reviewer 승인 후 Library 검색과 상세 화면에 게시됩니다.</p></div></li>
            `;
        }
    }

    const field = (name) => form.elements.namedItem(name);
    const text = (value) => String(value ?? "").trim();
    const list = (value) => Array.isArray(value) ? value : text(value).split(",").map((item) => item.trim()).filter(Boolean);
    const today = () => new Date().toISOString().slice(0, 10);

    function createEmptyFrameworkDecisions() {
        return Object.fromEntries(FRAMEWORKS.map((framework) => [framework.id, { status: null, reason: "" }]));
    }

    function createEmptyFrameworkSearchQueries() {
        return Object.fromEntries(FRAMEWORKS.map((framework) => [framework.id, ""]));
    }

    function normalizeAssetType(value) {
        const normalized = text(value);
        return TYPE_ALIASES[normalized] || normalized;
    }

    function normalizeRelationType(value) {
        const normalized = text(value);
        return RELATION_TYPE_ALIASES[normalized] || normalized;
    }

    function normalizeFrameworkId(value) {
        const normalized = text(value);
        if (normalized === "technologyMap") return "technology-map";
        if (normalized === "learningPath") return "learning-path";
        return normalized;
    }

    function createRegistrationId() {
        const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
        const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
        return `REG-${timestamp}-${suffix}`;
    }

    function setOptions(select, options) {
        select.innerHTML = options.map(([value, label]) => `<option value="${value}">${label}</option>`).join("");
    }

    function slugify(value) {
        return text(value).normalize("NFKD").toLowerCase()
            .replace(/[^a-z0-9가-힣]+/g, "-").replace(/^-+|-+$/g, "") || `asset-${Date.now()}`;
    }

    function setMessage(message, type = "") {
        importMessage.textContent = message;
        importMessage.className = `registration-message${type ? ` is-${type}` : ""}`;
    }

    function populateForm(packet) {
        const isCard = packet && packet.schemaVersion && packet.content;
        if (text(packet.registrationId)) {
            registrationId = text(packet.registrationId);
            document.getElementById("registration-id-display").textContent = registrationId;
        }
        const title = isCard ? packet.title : packet.actualTitle || packet.workingTitle;
        field("title").value = text(title);
        field("id").value = text(packet.id || packet.cardId || slugify(title));
        field("type").value = normalizeAssetType(packet.type || packet.cardTypeCandidate || "VD Request");
        field("domain").value = text(packet.domain || "other");
        field("publicationStatus").value = text(packet.publicationStatus || "초안");
        field("status").value = text(packet.status || "초안");
        field("owner").value = text(packet.owner);
        field("registrant").value = text(packet.registrant);
        field("reviewer").value = text(packet.reviewer);
        field("contexts").value = list(packet.contexts).join(", ");
        field("summary").value = text(packet.summary || packet.abstractContext || packet.observationsAndResult);
        field("useCase").value = text(packet.useCase || packet.primaryQuestion);
        field("contents").value = text(packet.contents || packet.approachOrContent || packet.observationsAndResult);
        field("tags").value = list(packet.tags?.length ? packet.tags : packet.searchTerms).join(", ");
        selectedRelations = Array.isArray(packet.relations) ? packet.relations.map((relation) => ({
            ...relation,
            type: normalizeRelationType(relation.type),
            selectionSource: text(relation.selectionSource || "imported"),
            confirmed: relation.confirmed === true
        })) : [];
        selectedFrameworkLinks = Array.isArray(packet.frameworkLinks) ? packet.frameworkLinks.map((link) => ({
            ...link,
            framework: normalizeFrameworkId(link.framework || (link.targetType === "methodology" ? "technology-map" : link.targetType === "capability" ? "learning-path" : "")),
            targetType: link.targetType || (normalizeFrameworkId(link.framework) === "technology-map" ? "methodology" : "capability"),
            targetId: text(link.targetId || link.methodologyId || link.capabilityId),
            relationType: normalizeRelationType(link.relationType || link.type),
            note: text(link.note),
            selectionSource: text(link.selectionSource || "imported"),
            confirmed: link.confirmed !== false
        })).filter((link) => FRAMEWORKS.some((framework) => framework.id === link.framework) && link.targetId) : [];
        frameworkDecisions = createEmptyFrameworkDecisions();
        frameworkSearchQueries = createEmptyFrameworkSearchQueries();
        FRAMEWORKS.forEach((framework) => {
            const source = packet.frameworkLinkDecisions?.[framework.registryKey]
                ?? packet.frameworkLinkDecisions?.[framework.id]
                ?? packet.frameworkDecisions?.[framework.id]
                ?? packet.frameworkDecisions?.[framework.registryKey];
            const status = text(typeof source === "string" ? source : source?.status || source?.decision);
            const reason = text(typeof source === "object" ? source?.reason : "");
            if (FRAMEWORK_DECISIONS.some(([value]) => value === status)) {
                frameworkDecisions[framework.id] = { status, reason };
            } else if (selectedFrameworkLinks.some((link) => link.framework === framework.id)) {
                frameworkDecisions[framework.id] = { status: "linked", reason: "" };
            }
        });
        internalLinks = Array.isArray(packet.links) ? packet.links.filter((link) => link?.href).map((link) => ({
            label: link.label || "내부 자산",
            href: link.href,
            assetType: link.assetType || link.type || "기타 사내 시스템",
            system: link.system || "확인 필요",
            role: link.role || "reference",
            accessScope: link.accessScope || "권한 확인 필요",
            selectionSource: text(link.selectionSource || "recommended"),
            status: link.status === "verified" ? "verified" : "pending",
            verifiedAt: link.verifiedAt || ""
        })) : [];
        relationSearchPerformed = packet.searchReuse?.performed === true;
        field("relationSearch").value = list(packet.searchReuse?.searchTerms).join(", ");
        renderSelectedRelations();
        renderFrameworkPanels();
        renderInternalLinks();
    }

    function escapeHtml(value) {
        return text(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
    }

    function libraryCards() {
        return Array.isArray(window.TECHNICAL_ASSET_LIBRARY?.cards) ? window.TECHNICAL_ASSET_LIBRARY.cards : [];
    }

    function frameworkRegistry() {
        return window.TECHNICAL_ASSET_FRAMEWORKS || {};
    }

    function frameworkTargets(frameworkId) {
        if (frameworkId === "technology-map") {
            return (frameworkRegistry().technologyMap?.methodologies || []).map((item) => ({
                id: item.id,
                label: item.label,
                group: item.categoryLabel || "기타"
            }));
        }
        if (frameworkId === "learning-path") {
            return (frameworkRegistry().learningPath?.families || []).flatMap((family) => (
                (family.capabilities || []).map((item) => ({ id: item.id, label: item.label, group: family.label }))
            ));
        }
        return [];
    }

    function frameworkTargetLabel(frameworkId, targetId) {
        return frameworkTargets(frameworkId).find((item) => item.id === targetId)?.label || targetId;
    }

    function frameworkRelationLabel(relationType) {
        const label = FRAMEWORK_RELATION_TYPES.find(([value]) => value === relationType)?.[1];
        return label ? `${label} · ${relationType}` : relationType;
    }

    function registrationRecommendationTerms() {
        const values = [
            field("title").value,
            field("summary").value,
            field("useCase").value,
            field("contents").value,
            field("tags").value,
            field("contexts").value,
            field("domain").value
        ];
        return [...new Set(values.join(" ").toLocaleLowerCase("ko").split(/[\s,·/()\[\]{}:;]+/).map((item) => item.trim()).filter((item) => item.length >= 2))];
    }

    function candidateScore(haystack, terms = registrationRecommendationTerms()) {
        const normalized = text(haystack).toLocaleLowerCase("ko");
        return terms.reduce((score, term) => score + (normalized.includes(term) ? 1 : 0), 0);
    }

    function sourceLabel(source) {
        if (source === "recommended") return "자동 추천";
        if (source === "searched") return "직접 검색";
        return "불러온 연결";
    }

    function candidateGroupMarkup(title, note, items, modifier = "") {
        return `<section class="connection-candidate-group ${modifier}">
            <header><strong>${escapeHtml(title)}</strong><span>${escapeHtml(note)}</span></header>
            <div class="connection-candidate-list">${items || '<div class="connection-empty">표시할 후보가 없습니다.</div>'}</div>
        </section>`;
    }

    function frameworkTargetOptions(frameworkId) {
        const groups = new Map();
        frameworkTargets(frameworkId).forEach((item) => {
            if (!groups.has(item.group)) groups.set(item.group, []);
            groups.get(item.group).push(item);
        });
        return `<option value="">연결 대상 선택</option>${[...groups.entries()].map(([group, items]) => `
            <optgroup label="${escapeHtml(group)}">
                ${items.map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.label)}</option>`).join("")}
            </optgroup>`).join("")}`;
    }

    function ensureFrameworkPanels() {
        const container = form.querySelector('[data-registration-step="3"] .registration-connections');
        if (!container) return;
        FRAMEWORKS.forEach((framework) => {
            if (container.querySelector(`[data-framework-panel="${framework.id}"]`)) return;
            const panel = document.createElement("section");
            panel.className = "registration-connection-panel is-framework";
            panel.dataset.frameworkPanel = framework.id;
            container.appendChild(panel);
        });
    }

    function renderFrameworkPanel(frameworkId) {
        const framework = FRAMEWORKS.find((item) => item.id === frameworkId);
        const panel = form.querySelector(`[data-framework-panel="${frameworkId}"]`);
        if (!framework || !panel) return;
        const decision = frameworkDecisions[frameworkId] || { status: null, reason: "" };
        const links = selectedFrameworkLinks.filter((link) => link.framework === frameworkId);
        const linked = decision.status === "linked";
        const needsReason = Boolean(decision.status && !linked);
        const linkRecords = links.length ? links.map((link) => {
            const linkIndex = selectedFrameworkLinks.indexOf(link);
            return `<div class="connection-record" data-framework-link-index="${linkIndex}">
                <div class="connection-record-main">
                    <strong>${escapeHtml(frameworkTargetLabel(frameworkId, link.targetId))}<span class="connection-source-token is-${escapeHtml(link.selectionSource || "imported")}">${escapeHtml(sourceLabel(link.selectionSource))}</span></strong>
                    <small>${escapeHtml(link.targetId)}</small>
                    <div class="connection-record-fields">
                        <select data-framework-link-relation aria-label="관계 유형">
                            ${FRAMEWORK_RELATION_TYPES.map(([value, label]) => `<option value="${value}"${link.relationType === value ? " selected" : ""}>${escapeHtml(label)} · ${value}</option>`).join("")}
                        </select>
                        <input data-framework-link-note value="${escapeHtml(link.note)}" aria-label="연결 설명" placeholder="이 자산이 대상과 어떻게 연결되는지 입력">
                    </div>
                    <label class="connection-none-option"><input type="checkbox" data-confirm-framework-link${link.confirmed ? " checked" : ""}>관계와 연결 설명을 확인함</label>
                </div>
                <button type="button" data-remove-framework-link aria-label="프레임워크 연결 삭제"><i class="bx bx-trash"></i></button>
            </div>`;
        }).join("") : '<div class="connection-empty">선택된 연결 대상이 없습니다.</div>';

        panel.innerHTML = `
            <header>
                <div><h3>${escapeHtml(framework.label)} 연결</h3><p>검색어가 아니라 고정 ID와 관계 의미로 연결합니다.</p></div>
                <span class="required-token">연결 판정 필수</span>
            </header>
            <fieldset class="framework-decision-field">
                <legend>연결 결정</legend>
                <div class="framework-decision-options">
                    ${FRAMEWORK_DECISIONS.map(([value, label]) => `<label><input type="radio" name="framework-decision-${frameworkId}" value="${value}" data-framework-decision="${frameworkId}"${decision.status === value ? " checked" : ""}><span>${label}</span></label>`).join("")}
                </div>
            </fieldset>
            <div data-framework-linked-fields${linked ? "" : " hidden"}>
                <label class="registration-field framework-search-field">검색어
                    <input data-framework-search value="${escapeHtml(frameworkSearchQueries[frameworkId])}" placeholder="${framework.id === "technology-map" ? "방법론명·중분류 검색" : "역량명·계열 검색"}">
                </label>
                <div class="framework-candidate-results" data-framework-candidates aria-live="polite"></div>
                <div class="selected-relations" data-selected-framework-links>${linkRecords}</div>
            </div>
            <label class="registration-field" data-framework-reason-field${needsReason ? "" : " hidden"}>판정 사유
                <textarea rows="2" data-framework-reason placeholder="해당 없음 또는 대상 없음으로 판단한 이유를 입력">${escapeHtml(decision.reason)}</textarea>
            </label>`;
        if (linked) renderFrameworkCandidates(frameworkId);
    }

    function renderFrameworkPanels() {
        ensureFrameworkPanels();
        FRAMEWORKS.forEach((framework) => renderFrameworkPanel(framework.id));
    }

    function renderFrameworkCandidates(frameworkId) {
        const container = form.querySelector(`[data-framework-panel="${frameworkId}"] [data-framework-candidates]`);
        if (!container) return;
        const targets = frameworkTargets(frameworkId);
        const selectedIds = new Set(selectedFrameworkLinks.filter((link) => link.framework === frameworkId).map((link) => link.targetId));
        const recommendations = targets.map((target) => ({ target, score: candidateScore(`${target.label} ${target.group}`) }))
            .filter((item) => item.score > 0 && !selectedIds.has(item.target.id))
            .sort((a, b) => b.score - a.score || a.target.label.localeCompare(b.target.label, "ko"))
            .slice(0, 4)
            .map(({ target }) => target);
        const query = text(frameworkSearchQueries[frameworkId]).toLocaleLowerCase("ko");
        const queryTerms = query.split(/\s+/).filter(Boolean);
        const searched = query ? targets.filter((target) => {
            const haystack = `${target.label} ${target.group} ${target.id}`.toLocaleLowerCase("ko");
            return queryTerms.every((term) => haystack.includes(term));
        }).filter((target) => !selectedIds.has(target.id)).slice(0, 8) : [];
        const itemMarkup = (target, source) => `<div class="relation-result">
            <div class="relation-result-main"><strong>${escapeHtml(target.label)}<span class="connection-source-token is-${source}">${sourceLabel(source)}</span></strong><small>${escapeHtml(target.group)} · ${escapeHtml(target.id)}</small></div>
            <button type="button" data-add-framework-candidate="${escapeHtml(target.id)}" data-candidate-source="${source}">연결</button>
        </div>`;
        container.innerHTML = [
            candidateGroupMarkup("자동 추천", "등록 태그·본문 기준", recommendations.map((target) => itemMarkup(target, "recommended")).join(""), "is-recommended"),
            candidateGroupMarkup("직접 검색 결과", query ? `‘${query}’ 검색` : "검색어를 입력하세요", searched.map((target) => itemMarkup(target, "searched")).join(""), "is-searched")
        ].join("");
    }

    function addFrameworkCandidate(frameworkId, targetId, selectionSource) {
        if (!frameworkTargets(frameworkId).some((target) => target.id === targetId)) return;
        if (selectedFrameworkLinks.some((link) => link.framework === frameworkId && link.targetId === targetId)) return;
        selectedFrameworkLinks.push({
            framework: frameworkId,
            targetType: frameworkId === "technology-map" ? "methodology" : "capability",
            targetId,
            relationType: "REFERENCES",
            note: "",
            selectionSource,
            confirmed: false
        });
        renderFrameworkPanel(frameworkId);
    }

    function updateFrameworkLinkFromEvent(event) {
        const record = event.target.closest("[data-framework-link-index]");
        if (!record) return false;
        const link = selectedFrameworkLinks[Number(record.dataset.frameworkLinkIndex)];
        if (!link) return false;
        if (event.target.matches("[data-framework-link-relation]")) link.relationType = event.target.value;
        if (event.target.matches("[data-framework-link-note]")) link.note = event.target.value;
        if (event.target.matches("[data-confirm-framework-link]")) link.confirmed = event.target.checked;
        return true;
    }

    function renderRelationCandidates() {
        const container = document.getElementById("relation-search-results");
        const query = text(field("relationSearch").value).toLocaleLowerCase("ko");
        if (query) relationSearchPerformed = true;
        const available = libraryCards().filter((card) => card.id !== text(field("id").value) && !selectedRelations.some((relation) => relation.targetId === card.id));
        const recommendations = available.map((card) => ({
            card,
            score: candidateScore([card.title, card.summary, card.domain, card.type, ...(card.tags || []), ...(card.contexts || [])].join(" "))
        })).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 4).map((item) => item.card);
        const queryTerms = query.split(/\s+/).filter(Boolean);
        const searched = query ? available.filter((card) => {
            const haystack = [card.title, card.summary, card.domain, card.type, ...(card.tags || []), ...(card.contexts || [])].join(" ").toLocaleLowerCase("ko");
            return queryTerms.every((term) => haystack.includes(term));
        }).slice(0, 8) : [];
        const itemMarkup = (card, source) => `<div class="relation-result">
            <div class="relation-result-main"><strong>${escapeHtml(card.title)}<span class="connection-source-token is-${source}">${sourceLabel(source)}</span></strong><small>${escapeHtml(card.type)} · ${escapeHtml(card.domain)} · ${escapeHtml(card.publicationStatus)}</small></div>
            <button type="button" data-add-relation="${escapeHtml(card.id)}" data-candidate-source="${source}">연결</button>
        </div>`;
        container.innerHTML = [
            candidateGroupMarkup("자동 추천", "등록 태그·본문 기준", recommendations.map((card) => itemMarkup(card, "recommended")).join(""), "is-recommended"),
            candidateGroupMarkup("직접 검색 결과", query ? `‘${query}’ 검색` : "검색어를 입력하세요", searched.map((card) => itemMarkup(card, "searched")).join(""), "is-searched")
        ].join("");
    }

    function addRelation(cardId, selectionSource = "searched") {
        const card = libraryCards().find((item) => item.id === cardId);
        if (!card || selectedRelations.some((relation) => relation.targetId === cardId)) return;
        selectedRelations.push({ type: "USES", targetId: card.id, note: "", selectionSource, confirmed: false });
        relationSearchPerformed = true;
        field("noRelationFound").checked = false;
        document.getElementById("no-relation-reason-field").hidden = true;
        renderRelationCandidates();
        renderSelectedRelations();
    }

    function renderSelectedRelations() {
        const container = document.getElementById("selected-relations");
        if (!container) return;
        container.innerHTML = selectedRelations.length ? selectedRelations.map((relation, index) => {
            const card = libraryCards().find((item) => item.id === relation.targetId);
            return `<div class="connection-record" data-relation-index="${index}">
                <div class="connection-record-main"><strong>${escapeHtml(card?.title || relation.targetId)}<span class="connection-source-token is-${escapeHtml(relation.selectionSource || "imported")}">${escapeHtml(sourceLabel(relation.selectionSource))}</span></strong><small>${escapeHtml(relation.targetId)}</small>
                    <div class="connection-record-fields">
                        <select aria-label="관계 유형">${RELATION_TYPES.map((type) => `<option value="${type}"${relation.type === type ? " selected" : ""}>${type}</option>`).join("")}</select>
                        <input value="${escapeHtml(relation.note)}" aria-label="활용 내용" placeholder="이 자산을 어떻게 활용했는지 입력">
                    </div>
                    <label class="connection-none-option"><input type="checkbox" data-confirm-relation${relation.confirmed ? " checked" : ""}>관계와 활용 내용을 확인함</label>
                </div><button type="button" data-remove-relation aria-label="연결 삭제"><i class="bx bx-trash"></i></button>
            </div>`;
        }).join("") : '<div class="connection-empty">선택된 연결 자산이 없습니다.</div>';
    }

    function renderInternalLinks() {
        const container = document.getElementById("selected-links");
        if (!container) return;
        container.innerHTML = internalLinks.length ? internalLinks.map((link, index) => `<div class="connection-record" data-link-index="${index}">
            <div class="connection-record-main"><strong>${escapeHtml(link.label)}<span class="connection-source-token is-${escapeHtml(link.selectionSource || "recommended")}">${link.selectionSource === "manual" ? "직접 추가" : "자동 추천"}</span></strong><small>${escapeHtml(link.assetType)} · ${escapeHtml(link.system)} · ${escapeHtml(link.accessScope)}<br>${escapeHtml(link.href)}</small>
                <label class="connection-none-option"><input type="checkbox" data-verify-link${link.status === "verified" ? " checked" : ""}>링크 접근 가능 여부를 확인함</label>
            </div><button type="button" data-remove-link aria-label="링크 삭제"><i class="bx bx-trash"></i></button>
        </div>`).join("") : '<div class="connection-empty">등록된 회사 내부 자산 링크가 없습니다.</div>';
    }

    function addInternalLink() {
        const label = text(document.getElementById("internal-link-label").value);
        const href = text(document.getElementById("internal-link-url").value);
        const system = text(document.getElementById("internal-link-system").value);
        if (!label || !/^https:\/\//i.test(href) || !system) {
            document.getElementById("internal-link-label").reportValidity();
            alert("링크 이름, https:// URL, 원본 시스템을 모두 입력하세요.");
            return;
        }
        internalLinks.push({
            label, href, system,
            assetType: document.getElementById("internal-link-type").value,
            role: document.getElementById("internal-link-role").value,
            accessScope: document.getElementById("internal-link-scope").value,
            selectionSource: "manual",
            status: "pending", verifiedAt: ""
        });
        ["internal-link-label", "internal-link-url", "internal-link-system"].forEach((id) => { document.getElementById(id).value = ""; });
        renderInternalLinks();
    }

    function buildCard() {
        const original = sourcePacket?.schemaVersion ? sourcePacket : {};
        const content = original.content || {
            sourcePacket: sourcePacket,
            primaryQuestion: text(sourcePacket?.primaryQuestion),
            inputsAndConstraints: sourcePacket?.inputsAndConstraints || [],
            approachOrContent: text(sourcePacket?.approachOrContent),
            observationsAndResult: text(sourcePacket?.observationsAndResult),
            limitationsAndUnknowns: sourcePacket?.limitationsAndUnknowns || [],
            reuseOrFollowUp: sourcePacket?.reuseOrFollowUp || []
        };
        return {
            ...original,
            schemaVersion: original.schemaVersion || "1.0",
            registrationId,
            id: text(field("id").value),
            type: field("type").value,
            title: text(field("title").value),
            domain: field("domain").value,
            secondaryDomains: original.secondaryDomains || [],
            contexts: list(field("contexts").value),
            publicationStatus: field("publicationStatus").value,
            status: text(field("status").value),
            owner: text(field("owner").value),
            registrant: text(field("registrant").value),
            reviewer: text(field("reviewer").value),
            contributors: original.contributors || [],
            createdAt: original.createdAt || today(),
            updatedAt: today(),
            summary: text(field("summary").value),
            useCase: text(field("useCase").value),
            contents: text(field("contents").value),
            tags: list(field("tags").value),
            aliases: original.aliases || [],
            sourceIds: original.sourceIds || [],
            links: internalLinks.map((link) => ({ ...link, registrationId })),
            relations: selectedRelations.map((relation) => ({ ...relation, registrationId })),
            frameworkLinks: selectedFrameworkLinks.map((link) => ({ ...link, registrationId })),
            frameworkLinkDecisions: Object.fromEntries(FRAMEWORKS.flatMap((framework) => {
                const decision = frameworkDecisions[framework.id];
                return FRAMEWORK_DECISIONS.some(([value]) => value === decision?.status)
                    ? [[framework.registryKey, { status: decision.status, reason: text(decision.reason) }]]
                    : [];
            })),
            searchReuse: {
                performed: relationSearchPerformed,
                searchedAt: today(),
                searchedBy: text(field("registrant").value),
                searchTerms: list(field("relationSearch").value),
                foundAssetIds: selectedRelations.map((relation) => relation.targetId),
                decision: selectedRelations.length ? "linked" : (field("noRelationFound").checked ? "no-candidate" : "pending"),
                reason: selectedRelations.length ? selectedRelations.map((relation) => relation.note).filter(Boolean).join("; ") : text(field("noRelationReason").value),
                reviewerConfirmed: Boolean(text(field("reviewer").value))
            },
            aiAssistance: original.aiAssistance || {
                externalStructured: false,
                internalStructured: false,
                internalClineStructured: false,
                manualStructured: true,
                humanConfirmed: true
            },
            changeLog: [...(original.changeLog || []), { date: today(), author: text(field("registrant").value), summary: "Library 등록 화면에서 내부정보 보완" }],
            content,
            registrationSource: {
                registrationId,
                fileName: sourceFileName,
                importedAt: new Date().toISOString(),
                originalPreservedInContent: !sourcePacket?.schemaVersion,
                groupedSections: ["basicInformation", "relations", "frameworkConnections", "internalLinks", "validationHistory"]
            }
        };
    }

    function validateCard(card) {
        const errors = [];
        if (!/^REG-\d{14}-[A-Z0-9]{4}$/.test(card.registrationId)) errors.push("유효한 등록 ID가 필요합니다.");
        [["id", "자산 ID"], ["title", "자산 제목"], ["type", "자료 유형"], ["domain", "기술영역"], ["status", "유형별 상태"], ["owner", "담당자"], ["registrant", "등록자"], ["summary", "요약"], ["useCase", "활용 상황"], ["contents", "핵심 내용"]]
            .forEach(([key, label]) => { if (!text(card[key])) errors.push(`${label}을(를) 입력하세요.`); });
        if (!/^[a-z0-9][a-z0-9-]*$/.test(card.id)) errors.push("자산 ID는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.");
        if (!card.contexts.length) errors.push("활용 맥락을 하나 이상 입력하세요.");
        if (card.publicationStatus === "게시" && !card.reviewer) errors.push("게시 자산은 검토자가 필요합니다.");
        if (card.publicationStatus === "게시" && !card.links.length) errors.push("게시 자산은 내부 원본 또는 근거 링크가 필요합니다.");
        if (!card.searchReuse.performed) errors.push("기존 Library 자산 검색을 수행하세요.");
        if (!card.relations.length && card.searchReuse.decision !== "no-candidate") errors.push("연결 자산을 선택하거나 '연결할 기존 자산 없음'을 확인하세요.");
        if (card.searchReuse.decision === "no-candidate" && !card.searchReuse.reason) errors.push("연결 후보가 없는 경우 검색 범위와 판단 사유를 입력하세요.");
        if (card.relations.some((relation) => !relation.note)) errors.push("모든 연결 자산에 활용 내용을 입력하세요.");
        if (card.relations.some((relation) => relation.confirmed !== true)) errors.push("모든 연결 관계를 확인하세요.");
        FRAMEWORKS.forEach((framework) => {
            const decision = card.frameworkLinkDecisions?.[framework.registryKey];
            const status = text(decision?.status);
            const links = card.frameworkLinks.filter((link) => link.framework === framework.id);
            const validTargetIds = new Set(frameworkTargets(framework.id).map((item) => item.id));
            const expectedTargetType = framework.id === "technology-map" ? "methodology" : "capability";
            if (!FRAMEWORK_DECISIONS.some(([value]) => value === status)) {
                errors.push(`${framework.label} 연결 결정을 선택하세요.`);
                return;
            }
            if (status === "linked" && !links.length) errors.push(`${framework.label}에서 연결 대상을 하나 이상 추가하세요.`);
            if (status !== "linked" && links.length) errors.push(`${framework.label} 연결 결정과 선택 대상이 일치하지 않습니다.`);
            if (status !== "linked" && !text(decision?.reason)) errors.push(`${framework.label}의 '${status === "not_applicable" ? "해당 없음" : "대상 없음"}' 사유를 입력하세요.`);
            links.forEach((link) => {
                if (link.targetType !== expectedTargetType) errors.push(`${framework.label} 연결 '${link.targetId}'의 대상 유형을 확인하세요.`);
                if (!validTargetIds.has(link.targetId)) errors.push(`${framework.label}의 연결 대상 '${link.targetId}'을 Registry에서 확인할 수 없습니다.`);
                if (!FRAMEWORK_RELATION_TYPES.some(([value]) => value === link.relationType)) errors.push(`${framework.label} 연결 '${link.targetId}'의 관계 유형을 확인하세요.`);
                if (!text(link.note)) errors.push(`${framework.label} 연결 '${link.targetId}'의 설명을 입력하세요.`);
                if (link.confirmed !== true) errors.push(`${framework.label} 연결 '${link.targetId}'을 확인하세요.`);
            });
        });
        const frameworkLinkKeys = card.frameworkLinks.map((link) => `${link.framework}:${link.targetId}:${link.relationType}`);
        if (new Set(frameworkLinkKeys).size !== frameworkLinkKeys.length) errors.push("중복된 Technology Map 또는 Learning Path 연결이 있습니다.");
        if (card.links.some((link) => !/^https:\/\//i.test(link.href))) errors.push("회사 내부 자산 링크는 https:// 주소여야 합니다.");
        if (card.publicationStatus === "게시" && card.links.some((link) => link.status !== "verified")) errors.push("게시 전 모든 내부 링크의 접근 가능 여부를 확인하세요.");
        if (card.publicationStatus === "게시" && !card.searchReuse.reviewerConfirmed) errors.push("게시 전 Reviewer가 연결 판단을 확인해야 합니다.");
        return errors;
    }

    function renderReview() {
        const card = buildCard();
        const errors = validateCard(card);
        validation.innerHTML = errors.length
            ? errors.map((error) => `<div class="registration-validation-item is-error"><i class="bx bx-error-circle"></i><span>${error}</span></div>`).join("")
            : '<div class="registration-validation-item is-success"><i class="bx bx-check-circle"></i><span>필수 등록정보 검증을 통과했습니다. Library 등록과 Reviewer 검토를 요청할 수 있습니다.</span></div>';
        preview.textContent = JSON.stringify(card, null, 2);
        downloadButton.disabled = errors.length > 0 || !repository;
    }

    function setStep(step) {
        currentStep = step;
        form.querySelectorAll("[data-registration-step]").forEach((section) => {
            const active = Number(section.dataset.registrationStep) === step;
            section.classList.toggle("is-active", active);
            section.hidden = !active;
        });
        form.querySelectorAll("[data-registration-step-indicator]").forEach((item) => {
            const itemStep = Number(item.dataset.registrationStepIndicator);
            item.classList.toggle("is-active", itemStep === step);
            item.classList.toggle("is-complete", itemStep < step);
        });
        previousButton.hidden = step === 1;
        nextButton.hidden = step === 4;
        downloadButton.hidden = step !== 4;
        downloadButton.innerHTML = '<i class="bx bx-send"></i> Library 등록 요청';
        nextButton.textContent = step === 3 ? "검증하기" : "다음";
        nextButton.disabled = step === 1 && !sourcePacket;
        if (step === 3) {
            renderRelationCandidates();
            renderSelectedRelations();
            renderFrameworkPanels();
            renderInternalLinks();
        }
        if (step === 4) renderReview();
    }

    async function loadFile(file) {
        if (!file) return;
        try {
            const source = await file.text();
            const parsed = JSON.parse(source.replace(/^\uFEFF/, ""));
            if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") throw new Error("JSON 객체가 아닙니다.");
            sourcePacket = parsed;
            sourceFileName = file.name;
            populateForm(parsed);
            document.getElementById("registration-file-name").textContent = file.name;
            setMessage("JSON을 불러왔습니다. 다음 단계에서 내부 등록정보를 확인하세요.", "success");
            nextButton.disabled = false;
        } catch (error) {
            sourcePacket = null;
            setMessage(`파일을 읽지 못했습니다: ${error.message}`, "error");
            nextButton.disabled = true;
        }
    }

    function openDialog(trigger) {
        returnFocus = trigger;
        form.reset();
        registrationId = createRegistrationId();
        sourcePacket = null;
        sourceFileName = "";
        selectedRelations = [];
        selectedFrameworkLinks = [];
        frameworkDecisions = createEmptyFrameworkDecisions();
        frameworkSearchQueries = createEmptyFrameworkSearchQueries();
        internalLinks = [];
        relationSearchPerformed = false;
        document.getElementById("registration-file-name").textContent = "선택된 파일 없음";
        document.getElementById("registration-id-display").textContent = registrationId;
        document.getElementById("no-relation-reason-field").hidden = true;
        renderFrameworkPanels();
        setMessage("");
        dialog.showModal();
        document.body.classList.add("asset-registration-open");
        setStep(1);
        document.getElementById("asset-registration-title").focus({ preventScroll: true });
    }

    function closeDialog() { if (dialog.open) dialog.close(); }

    setOptions(field("type"), TYPES.map((item) => [item, item]));
    setOptions(field("domain"), DOMAINS);
    setOptions(field("publicationStatus"), PUBLICATION_STATUSES.map((item) => [item, item]));
    setOptions(document.getElementById("internal-link-type"), LINK_TYPES.map((item) => [item, item]));
    setOptions(document.getElementById("internal-link-role"), LINK_ROLES);
    setOptions(document.getElementById("internal-link-scope"), ACCESS_SCOPES.map((item) => [item, item]));

    document.getElementById("open-asset-registration")?.addEventListener("click", (event) => openDialog(event.currentTarget));
    document.getElementById("close-asset-registration")?.addEventListener("click", closeDialog);
    document.getElementById("registration-cancel")?.addEventListener("click", closeDialog);
    fileInput.addEventListener("change", () => loadFile(fileInput.files?.[0]));
    ["dragenter", "dragover"].forEach((name) => dropZone.addEventListener(name, (event) => { event.preventDefault(); dropZone.classList.add("is-dragging"); }));
    ["dragleave", "drop"].forEach((name) => dropZone.addEventListener(name, (event) => { event.preventDefault(); dropZone.classList.remove("is-dragging"); }));
    dropZone.addEventListener("drop", (event) => loadFile(event.dataTransfer?.files?.[0]));
    document.getElementById("relation-search").addEventListener("input", renderRelationCandidates);
    document.getElementById("relation-search-results").addEventListener("click", (event) => {
        const button = event.target.closest("[data-add-relation]");
        if (button) addRelation(button.dataset.addRelation, button.dataset.candidateSource || "searched");
    });
    document.getElementById("selected-relations").addEventListener("input", (event) => {
        const record = event.target.closest("[data-relation-index]");
        if (!record) return;
        const relation = selectedRelations[Number(record.dataset.relationIndex)];
        if (event.target.matches("select")) relation.type = event.target.value;
        if (event.target.matches("input[aria-label='활용 내용']")) relation.note = text(event.target.value);
        if (event.target.matches("[data-confirm-relation]")) relation.confirmed = event.target.checked;
    });
    document.getElementById("selected-relations").addEventListener("click", (event) => {
        const record = event.target.closest("[data-relation-index]");
        if (record && event.target.closest("[data-remove-relation]")) {
            selectedRelations.splice(Number(record.dataset.relationIndex), 1);
            renderRelationCandidates();
            renderSelectedRelations();
        }
    });
    document.getElementById("no-relation-found").addEventListener("change", (event) => {
        document.getElementById("no-relation-reason-field").hidden = !event.target.checked;
        if (event.target.checked) selectedRelations = [];
        renderSelectedRelations();
    });
    form.addEventListener("change", (event) => {
        const decisionSelect = event.target.closest("[data-framework-decision]");
        if (!decisionSelect) return;
        const frameworkId = decisionSelect.dataset.frameworkDecision;
        const status = FRAMEWORK_DECISIONS.some(([value]) => value === decisionSelect.value) ? decisionSelect.value : null;
        frameworkDecisions[frameworkId] = {
            status,
            reason: status === "linked" ? "" : text(frameworkDecisions[frameworkId]?.reason)
        };
        if (status !== "linked") {
            selectedFrameworkLinks = selectedFrameworkLinks.filter((link) => link.framework !== frameworkId);
        }
        renderFrameworkPanel(frameworkId);
    });
    form.addEventListener("input", (event) => {
        const frameworkId = event.target.closest("[data-framework-panel]")?.dataset.frameworkPanel;
        if (!frameworkId) return;
        if (event.target.matches("[data-framework-reason]")) {
            if (frameworkDecisions[frameworkId]) frameworkDecisions[frameworkId].reason = event.target.value;
            return;
        }
        if (event.target.matches("[data-framework-search]")) {
            frameworkSearchQueries[frameworkId] = event.target.value;
            renderFrameworkCandidates(frameworkId);
            return;
        }
        updateFrameworkLinkFromEvent(event);
    });
    form.addEventListener("change", (event) => {
        updateFrameworkLinkFromEvent(event);
    });
    form.addEventListener("click", (event) => {
        const panel = event.target.closest("[data-framework-panel]");
        if (!panel) return;
        const frameworkId = panel.dataset.frameworkPanel;
        const candidateButton = event.target.closest("[data-add-framework-candidate]");
        if (candidateButton) {
            addFrameworkCandidate(frameworkId, candidateButton.dataset.addFrameworkCandidate, candidateButton.dataset.candidateSource || "searched");
            return;
        }
        const record = event.target.closest("[data-framework-link-index]");
        if (record && event.target.closest("[data-remove-framework-link]")) {
            selectedFrameworkLinks.splice(Number(record.dataset.frameworkLinkIndex), 1);
            renderFrameworkPanel(frameworkId);
        }
    });
    document.getElementById("add-internal-link").addEventListener("click", addInternalLink);
    document.getElementById("selected-links").addEventListener("change", (event) => {
        const record = event.target.closest("[data-link-index]");
        if (!record || !event.target.matches("[data-verify-link]")) return;
        const link = internalLinks[Number(record.dataset.linkIndex)];
        link.status = event.target.checked ? "verified" : "pending";
        link.verifiedAt = event.target.checked ? today() : "";
    });
    document.getElementById("selected-links").addEventListener("click", (event) => {
        const record = event.target.closest("[data-link-index]");
        if (record && event.target.closest("[data-remove-link]")) {
            internalLinks.splice(Number(record.dataset.linkIndex), 1);
            renderInternalLinks();
        }
    });
    previousButton.addEventListener("click", () => setStep(Math.max(1, currentStep - 1)));
    nextButton.addEventListener("click", () => {
        if (currentStep === 2 && !form.reportValidity()) return;
        setStep(Math.min(4, currentStep + 1));
    });
    downloadButton.addEventListener("click", async () => {
        const card = buildCard();
        if (validateCard(card).length) return;
        if (isApiMode && repository) {
            downloadButton.disabled = true;
            try {
                const created = await repository.createAsset({ ...card, workflowStatus: "초안" });
                await repository.submitAsset(created?.id || card.id);
                window.alert("사내 Library 등록을 완료하고 Reviewer 검토를 요청했습니다.");
                closeDialog();
            } catch (error) {
                window.alert(error.message || "초안 저장 중 오류가 발생했습니다.");
            } finally {
                downloadButton.disabled = false;
            }
            return;
        }
        window.alert("Library 등록과 Reviewer 검토 요청 흐름을 완료했습니다. Nexus 검토본에는 데이터가 저장되지 않습니다.");
        closeDialog();
    });
    dialog.addEventListener("cancel", (event) => event.preventDefault());
    dialog.addEventListener("close", () => {
        document.body.classList.remove("asset-registration-open");
        window.setTimeout(() => returnFocus?.isConnected && returnFocus.focus({ preventScroll: true }), 0);
    });
    configureRegistrationCompletionUi();
    if (window.location.hash === "#register") openDialog(document.getElementById("open-asset-registration"));
})();
