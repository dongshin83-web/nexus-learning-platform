(() => {
    const TYPES = ["방법론", "BP", "VD Request", "CoR", "기술보고서", "임원 보고 자료", "Trouble Shooting", "Tool Manual", "교육자료"];
    const DOMAINS = [
        ["deformation", "01. 변형"], ["delamination", "02. 박리"], ["impact", "03. 충격"],
        ["thermal-flow", "04. 열유동"], ["fatigue", "05. 피로"], ["vibration", "06. 진동"], ["other", "07. 기타"]
    ];
    const PUBLICATION_STATUSES = ["초안", "검토 중", "게시", "개정 필요", "폐기"];
    const RELATION_TYPES = ["USES", "EVIDENCES", "DERIVED_FROM", "IMPROVES", "RELATED_TO", "SUPERSEDES", "REQUESTED_BY", "RESULTED_IN"];
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
    let currentStep = 1;
    let sourcePacket = null;
    let sourceFileName = "";
    let returnFocus = null;
    let selectedRelations = [];
    let internalLinks = [];
    let relationSearchPerformed = false;
    let registrationId = "";

    const field = (name) => form.elements.namedItem(name);
    const text = (value) => String(value ?? "").trim();
    const list = (value) => Array.isArray(value) ? value : text(value).split(",").map((item) => item.trim()).filter(Boolean);
    const today = () => new Date().toISOString().slice(0, 10);

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
        field("type").value = text(packet.type || packet.cardTypeCandidate || "VD Request");
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
        selectedRelations = Array.isArray(packet.relations) ? packet.relations.map((relation) => ({ ...relation, confirmed: relation.confirmed === true })) : [];
        internalLinks = Array.isArray(packet.links) ? packet.links.filter((link) => link?.href).map((link) => ({
            label: link.label || "내부 자산",
            href: link.href,
            assetType: link.assetType || link.type || "기타 사내 시스템",
            system: link.system || "확인 필요",
            role: link.role || "reference",
            accessScope: link.accessScope || "권한 확인 필요",
            status: link.status === "verified" ? "verified" : "pending",
            verifiedAt: link.verifiedAt || ""
        })) : [];
        relationSearchPerformed = packet.searchReuse?.performed === true;
        field("relationSearch").value = list(packet.searchReuse?.searchTerms).join(", ");
        renderSelectedRelations();
        renderInternalLinks();
    }

    function escapeHtml(value) {
        return text(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
    }

    function libraryCards() {
        return Array.isArray(window.TECHNICAL_ASSET_LIBRARY?.cards) ? window.TECHNICAL_ASSET_LIBRARY.cards : [];
    }

    function renderRelationCandidates() {
        const container = document.getElementById("relation-search-results");
        const query = text(field("relationSearch").value).toLocaleLowerCase("ko");
        if (!query) {
            container.innerHTML = '<div class="connection-empty">검색어를 입력하면 기존 Library 카드 후보가 표시됩니다.</div>';
            return;
        }
        relationSearchPerformed = true;
        const terms = query.split(/\s+/).filter(Boolean);
        const matches = libraryCards().filter((card) => card.id !== text(field("id").value)).map((card) => {
            const haystack = [card.title, card.summary, card.domain, card.type, ...(card.tags || []), ...(card.contexts || [])].join(" ").toLocaleLowerCase("ko");
            return { card, score: terms.filter((term) => haystack.includes(term)).length };
        }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, 6);
        container.innerHTML = matches.length ? matches.map(({ card }) => `
            <div class="relation-result">
                <div class="relation-result-main"><strong>${escapeHtml(card.title)}</strong><small>${escapeHtml(card.type)} · ${escapeHtml(card.domain)} · ${escapeHtml(card.publicationStatus)}</small></div>
                <button type="button" data-add-relation="${escapeHtml(card.id)}">연결</button>
            </div>`).join("") : '<div class="connection-empty">일치하는 기존 카드가 없습니다. 다른 검색어도 확인해 주세요.</div>';
    }

    function addRelation(cardId) {
        const card = libraryCards().find((item) => item.id === cardId);
        if (!card || selectedRelations.some((relation) => relation.targetId === cardId)) return;
        selectedRelations.push({ type: "RELATED_TO", targetId: card.id, note: "", confirmed: false });
        field("noRelationFound").checked = false;
        document.getElementById("no-relation-reason-field").hidden = true;
        renderSelectedRelations();
    }

    function renderSelectedRelations() {
        const container = document.getElementById("selected-relations");
        if (!container) return;
        container.innerHTML = selectedRelations.length ? selectedRelations.map((relation, index) => {
            const card = libraryCards().find((item) => item.id === relation.targetId);
            return `<div class="connection-record" data-relation-index="${index}">
                <div class="connection-record-main"><strong>${escapeHtml(card?.title || relation.targetId)}</strong><small>${escapeHtml(relation.targetId)}</small>
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
            <div class="connection-record-main"><strong>${escapeHtml(link.label)}</strong><small>${escapeHtml(link.assetType)} · ${escapeHtml(link.system)} · ${escapeHtml(link.accessScope)}<br>${escapeHtml(link.href)}</small>
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
                externalStructured: true,
                internalClineStructured: true,
                humanConfirmed: true
            },
            changeLog: [...(original.changeLog || []), { date: today(), author: text(field("registrant").value), summary: "Library 등록 화면에서 내부정보 보완" }],
            content,
            registrationSource: {
                registrationId,
                fileName: sourceFileName,
                importedAt: new Date().toISOString(),
                originalPreservedInContent: !sourcePacket?.schemaVersion,
                groupedSections: ["basicInformation", "relations", "internalLinks", "validationHistory"]
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
            : `<div class="registration-validation-item is-success"><i class="bx bx-check-circle"></i><span>필수 등록정보 검증을 통과했습니다. JSON을 다운로드할 수 있습니다.</span></div>`;
        preview.textContent = JSON.stringify(card, null, 2);
        downloadButton.disabled = errors.length > 0;
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
        nextButton.textContent = step === 3 ? "검증하기" : "다음";
        nextButton.disabled = step === 1 && !sourcePacket;
        if (step === 3) {
            renderRelationCandidates();
            renderSelectedRelations();
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
        internalLinks = [];
        relationSearchPerformed = false;
        document.getElementById("registration-file-name").textContent = "선택된 파일 없음";
        document.getElementById("registration-id-display").textContent = registrationId;
        document.getElementById("no-relation-reason-field").hidden = true;
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
        if (button) addRelation(button.dataset.addRelation);
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
            renderSelectedRelations();
        }
    });
    document.getElementById("no-relation-found").addEventListener("change", (event) => {
        document.getElementById("no-relation-reason-field").hidden = !event.target.checked;
        if (event.target.checked) selectedRelations = [];
        renderSelectedRelations();
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
    downloadButton.addEventListener("click", () => {
        const card = buildCard();
        if (validateCard(card).length) return;
        const blob = new Blob([`${JSON.stringify(card, null, 2)}\n`], { type: "application/json;charset=utf-8" });
        const anchor = document.createElement("a");
        anchor.href = URL.createObjectURL(blob);
        anchor.download = `${card.id}.json`;
        anchor.click();
        URL.revokeObjectURL(anchor.href);
    });
    dialog.addEventListener("click", (event) => { if (event.target === dialog) closeDialog(); });
    dialog.addEventListener("close", () => {
        document.body.classList.remove("asset-registration-open");
        window.setTimeout(() => returnFocus?.isConnected && returnFocus.focus({ preventScroll: true }), 0);
    });
    if (window.location.hash === "#register") openDialog(document.getElementById("open-asset-registration"));
})();
