(function () {
    "use strict";

    const records = Array.isArray(window.TEAM_CULTURE_RECORDS) ? window.TEAM_CULTURE_RECORDS : [];
    let activeType = "전체";
    let activeRecord = null;
    let activeImageIndex = 0;
    const runtime = window.TECHNICAL_ASSET_RUNTIME ?? { mode: "static" };
    const repository = typeof window.createTechnicalAssetRepository === "function"
        ? window.createTechnicalAssetRepository(runtime)
        : null;

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");
    }

    function validHref(value) {
        return /^(https?:\/\/|\/|\.\/|\.\.\/)/i.test(String(value ?? "").trim());
    }

    function typeIcon(type) {
        if (type === "팀장레터") return "bx bx-images";
        if (type === "워크샵 결과") return "bx bx-group";
        if (type === "운영 원칙") return "bx bx-check-shield";
        return "bx bx-archive";
    }

    function renderFilters() {
        const wrap = document.getElementById("culture-type-filters");
        if (!wrap) return;
        const types = ["전체", ...new Set(records.map((record) => record.type))];
        wrap.innerHTML = types.map((type) => `
            <button class="culture-filter${type === activeType ? " is-active" : ""}" type="button" data-culture-type="${escapeHtml(type)}">
                ${escapeHtml(type)} <span>${type === "전체" ? records.length : records.filter((record) => record.type === type).length}</span>
            </button>
        `).join("");
        wrap.querySelectorAll("[data-culture-type]").forEach((button) => {
            button.addEventListener("click", () => {
                activeType = button.dataset.cultureType;
                renderFilters();
                renderRecords();
            });
        });
    }

    function recordCover(record) {
        const cover = record.images?.[0];
        if (cover) {
            return `<img src="${escapeHtml(cover.src)}" alt="${escapeHtml(cover.alt)}" loading="lazy">`;
        }
        return `<span class="culture-cover-empty"><i class="${typeIcon(record.type)}"></i><strong>${escapeHtml(record.type)}</strong><small>내부 자료 연결 전</small></span>`;
    }

    function renderRecords() {
        const wrap = document.getElementById("culture-records");
        const resultCount = document.getElementById("culture-result-count");
        if (!wrap) return;
        const filtered = records.filter((record) => activeType === "전체" || record.type === activeType);
        if (resultCount) resultCount.textContent = `${filtered.length}개 기록`;
        wrap.innerHTML = filtered.map((record) => `
            <button class="culture-record-card" type="button" data-culture-record="${escapeHtml(record.id)}">
                <span class="culture-record-cover">${recordCover(record)}</span>
                <span class="culture-record-body">
                    <span class="culture-record-meta">
                        <span class="culture-type-token"><i class="${typeIcon(record.type)}"></i>${escapeHtml(record.type)}</span>
                        <span>${escapeHtml(record.date || record.status)}</span>
                    </span>
                    <strong>${escapeHtml(record.title)}</strong>
                    <span class="culture-series">${escapeHtml(record.series || "팀 기록")}</span>
                    <span class="culture-summary">${escapeHtml(record.summary)}</span>
                    <span class="culture-record-foot">
                        <span>${record.images?.length ? `<i class="bx bx-images"></i> 이미지 ${record.images.length}` : `<i class="bx bx-link"></i> 링크 ${record.links?.length ?? 0}`}</span>
                        <span>상세 보기 <i class="bx bx-right-arrow-alt"></i></span>
                    </span>
                </span>
            </button>
        `).join("");
        wrap.querySelectorAll("[data-culture-record]").forEach((button) => {
            button.addEventListener("click", () => openRecord(button.dataset.cultureRecord));
        });
    }

    function renderGallery() {
        const media = document.getElementById("culture-modal-media");
        if (!media || !activeRecord) return;
        const images = activeRecord.images ?? [];
        if (!images.length) {
            media.innerHTML = `
                <div class="culture-modal-empty">
                    <i class="${typeIcon(activeRecord.type)}"></i>
                    <strong>내부 이미지가 아직 연결되지 않았습니다</strong>
                    <span>사내 데이터 파일에서 이미지 경로를 여러 개 등록할 수 있습니다.</span>
                </div>
            `;
            return;
        }
        const image = images[activeImageIndex];
        media.innerHTML = `
            <div class="culture-gallery-frame">
                <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}">
                <span class="culture-gallery-count">${activeImageIndex + 1} / ${images.length}</span>
                ${images.length > 1 ? `
                    <button class="culture-gallery-arrow is-prev" type="button" data-gallery-move="-1" aria-label="이전 이미지"><i class="bx bx-chevron-left"></i></button>
                    <button class="culture-gallery-arrow is-next" type="button" data-gallery-move="1" aria-label="다음 이미지"><i class="bx bx-chevron-right"></i></button>
                ` : ""}
            </div>
            ${images.length > 1 ? `<div class="culture-gallery-dots">${images.map((_, index) => `<button type="button" class="${index === activeImageIndex ? "is-active" : ""}" data-gallery-index="${index}" aria-label="${index + 1}번 이미지"></button>`).join("")}</div>` : ""}
        `;
        media.querySelectorAll("[data-gallery-move]").forEach((button) => {
            button.addEventListener("click", () => {
                activeImageIndex = (activeImageIndex + Number(button.dataset.galleryMove) + images.length) % images.length;
                renderGallery();
            });
        });
        media.querySelectorAll("[data-gallery-index]").forEach((button) => {
            button.addEventListener("click", () => {
                activeImageIndex = Number(button.dataset.galleryIndex);
                renderGallery();
            });
        });
    }

    function renderLinks(record) {
        if (!record.links?.length) return "";
        return `
            <section class="culture-detail-section">
                <h3>연결 자료</h3>
                <div class="culture-link-list">
                    ${record.links.map((link) => validHref(link.href)
                        ? `<a href="${escapeHtml(link.href)}" target="_blank" rel="noreferrer"><span><small>${escapeHtml(link.kind || "자료")}</small><strong>${escapeHtml(link.label)}</strong></span><i class="bx bx-link-external"></i></a>`
                        : `<span class="is-pending"><span><small>${escapeHtml(link.kind || "자료")}</small><strong>${escapeHtml(link.label)}</strong></span><em>내부 링크 등록</em></span>`
                    ).join("")}
                </div>
            </section>
        `;
    }

    function openRecord(recordId) {
        activeRecord = records.find((record) => record.id === recordId);
        if (!activeRecord) return;
        activeImageIndex = 0;
        const dialog = document.getElementById("culture-detail-dialog");
        document.getElementById("culture-modal-type").textContent = activeRecord.type;
        document.getElementById("culture-modal-title").textContent = activeRecord.title;
        document.getElementById("culture-modal-series").textContent = activeRecord.series || "팀 기록";
        document.getElementById("culture-modal-summary").textContent = activeRecord.summary;
        document.getElementById("culture-modal-tags").innerHTML = (activeRecord.tags ?? []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join("");
        document.getElementById("culture-modal-links").innerHTML = renderLinks(activeRecord);
        renderGallery();
        dialog.showModal();
        document.body.classList.add("modal-open");
    }

    function closeRecord() {
        const dialog = document.getElementById("culture-detail-dialog");
        if (dialog?.open) dialog.close();
        document.body.classList.remove("modal-open");
        activeRecord = null;
    }

    function createRepeaterRow(kind) {
        const row = document.createElement("div");
        row.className = "culture-register-row";
        if (kind === "image") {
            row.innerHTML = `
                <label>이미지 URL·경로<input data-culture-image-src placeholder="https:// 또는 사내 저장 경로"></label>
                <label>대체 설명<input data-culture-image-alt placeholder="이미지의 핵심 내용을 설명"></label>
                <button type="button" data-remove-row aria-label="이미지 항목 삭제"><i class="bx bx-trash"></i></button>
            `;
        } else {
            row.innerHTML = `
                <label>링크 이름<input data-culture-link-label placeholder="예: 워크샵 결과 파일"></label>
                <label>URL<input data-culture-link-href placeholder="https://사내시스템/..."></label>
                <label>자료 구분<input data-culture-link-kind placeholder="원본·결과물·후속 액션"></label>
                <button type="button" data-remove-row aria-label="링크 항목 삭제"><i class="bx bx-trash"></i></button>
            `;
        }
        row.querySelector("[data-remove-row]").addEventListener("click", () => row.remove());
        return row;
    }

    function addRepeaterRow(kind) {
        const target = document.getElementById(kind === "image" ? "culture-image-fields" : "culture-link-fields");
        target?.appendChild(createRepeaterRow(kind));
    }

    function formRecord(form) {
        const formData = new FormData(form);
        const images = [...form.querySelectorAll(".culture-register-row")]
            .map((row) => ({
                src: row.querySelector("[data-culture-image-src]")?.value.trim() ?? "",
                alt: row.querySelector("[data-culture-image-alt]")?.value.trim() ?? ""
            }))
            .filter((image) => image.src || image.alt);
        const links = [...form.querySelectorAll(".culture-register-row")]
            .map((row) => ({
                label: row.querySelector("[data-culture-link-label]")?.value.trim() ?? "",
                href: row.querySelector("[data-culture-link-href]")?.value.trim() ?? "",
                kind: row.querySelector("[data-culture-link-kind]")?.value.trim() ?? ""
            }))
            .filter((link) => link.label || link.href || link.kind);
        return {
            schemaVersion: "0.1",
            id: `culture-${new Date().toISOString().replace(/\D/g, "").slice(0, 14)}`,
            type: String(formData.get("type") ?? ""),
            title: String(formData.get("title") ?? "").trim(),
            series: String(formData.get("series") ?? "").trim(),
            status: "초안",
            date: String(formData.get("date") ?? "").replaceAll("-", "."),
            summary: String(formData.get("summary") ?? "").trim(),
            tags: String(formData.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
            images,
            links
        };
    }

    function validateCultureRecord(record) {
        const errors = [];
        if (!record.title) errors.push("제목을 입력하세요.");
        if (!record.summary) errors.push("요약을 입력하세요.");
        record.images.forEach((image, index) => {
            if (!image.src || !image.alt) errors.push(`${index + 1}번 이미지는 경로와 대체 설명이 모두 필요합니다.`);
        });
        record.links.forEach((link, index) => {
            if (!link.label || !link.href || !link.kind) errors.push(`${index + 1}번 링크는 이름, URL과 자료 구분이 모두 필요합니다.`);
        });
        if (!record.images.length && !record.links.length) errors.push("이미지 또는 연결 자료를 하나 이상 등록하세요.");
        return errors;
    }

    function openRegistration() {
        const dialog = document.getElementById("culture-register-dialog");
        const form = document.getElementById("culture-register-form");
        form.reset();
        document.getElementById("culture-image-fields").innerHTML = "";
        document.getElementById("culture-link-fields").innerHTML = "";
        addRepeaterRow("image");
        addRepeaterRow("link");
        dialog.showModal();
        document.body.classList.add("modal-open");
    }

    function closeRegistration() {
        const dialog = document.getElementById("culture-register-dialog");
        if (dialog?.open) dialog.close();
        document.body.classList.remove("modal-open");
    }

    function bindRegistration() {
        const dialog = document.getElementById("culture-register-dialog");
        const form = document.getElementById("culture-register-form");
        const isApiMode = runtime.mode === "api";
        const submitButton = document.getElementById("culture-register-submit");
        document.getElementById("culture-register-mode").textContent = isApiMode
            ? "사내 API 연결 · 팀 기록 등록"
            : "Nexus 검토 모드 · 등록 흐름 확인";
        submitButton.innerHTML = '<i class="bx bx-send"></i> 팀 기록 등록';
        document.getElementById("culture-register-open")?.addEventListener("click", openRegistration);
        document.getElementById("culture-register-close")?.addEventListener("click", closeRegistration);
        document.getElementById("culture-register-cancel")?.addEventListener("click", closeRegistration);
        document.getElementById("culture-add-image")?.addEventListener("click", () => addRepeaterRow("image"));
        document.getElementById("culture-add-link")?.addEventListener("click", () => addRepeaterRow("link"));
        dialog?.addEventListener("cancel", (event) => event.preventDefault());
        form?.addEventListener("submit", async (event) => {
            event.preventDefault();
            const record = formRecord(form);
            const errors = validateCultureRecord(record);
            if (errors.length) {
                window.alert(errors.join("\n"));
                return;
            }
            submitButton.disabled = true;
            try {
                if (isApiMode && repository) {
                    const created = await repository.createCultureRecord(record);
                    records.unshift(created);
                    renderFilters();
                    renderRecords();
                    window.alert("Culture & History에 팀 기록 초안을 등록했습니다.");
                } else {
                    window.alert("Culture & History 등록 흐름을 완료했습니다. Nexus 검토본에는 데이터가 저장되지 않습니다.");
                }
                closeRegistration();
            } catch (error) {
                window.alert(error.message || "등록 중 오류가 발생했습니다.");
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    function bindDialog() {
        const dialog = document.getElementById("culture-detail-dialog");
        document.getElementById("culture-modal-close")?.addEventListener("click", closeRecord);
        dialog?.addEventListener("click", (event) => {
            if (event.target === dialog) closeRecord();
        });
        dialog?.addEventListener("close", () => document.body.classList.remove("modal-open"));
        document.addEventListener("keydown", (event) => {
            if (!activeRecord || event.key === "Escape") return;
            if (!activeRecord.images?.length) return;
            if (event.key === "ArrowLeft") {
                activeImageIndex = (activeImageIndex - 1 + activeRecord.images.length) % activeRecord.images.length;
                renderGallery();
            }
            if (event.key === "ArrowRight") {
                activeImageIndex = (activeImageIndex + 1) % activeRecord.images.length;
                renderGallery();
            }
        });
    }

    async function initCulturePage() {
        if (document.body.dataset.page !== "culture") return;
        if (runtime.mode === "api" && repository) {
            try {
                const storedRecords = await repository.listCultureRecords();
                const merged = new Map(records.map((record) => [record.id, record]));
                storedRecords.forEach((record) => merged.set(record.id, record));
                records.splice(0, records.length, ...merged.values());
            } catch (error) {
                console.warn("Culture 기록 API를 불러오지 못해 정적 기록을 사용합니다.", error);
            }
        }
        renderFilters();
        renderRecords();
        bindDialog();
        bindRegistration();
        const params = new URLSearchParams(window.location.search);
        if (params.get("record")) openRecord(params.get("record"));
        if (params.get("register") === "1") openRegistration();
    }

    document.addEventListener("DOMContentLoaded", initCulturePage);
})();
