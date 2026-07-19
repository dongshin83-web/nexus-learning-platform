(() => {
    const runtime = window.TECHNICAL_ASSET_RUNTIME ?? { mode: "static" };
    const repository = window.createTechnicalAssetRepository?.(runtime);
    const list = document.getElementById("review-list");
    const count = document.getElementById("review-count");
    const note = document.getElementById("review-mode-note");
    const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);

    function render(items) {
        count.textContent = `${items.length}건`;
        if (!items.length) {
            list.innerHTML = '<div class="review-empty"><i class="bx bx-check-circle"></i><p>현재 검토 요청 자산이 없습니다.</p></div>';
            return;
        }
        list.innerHTML = items.map((item) => `
            <article class="review-item" data-review-id="${escapeHtml(item.id)}">
                <header><div><span class="page-kicker">${escapeHtml(item.type)}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.summary)}</p></div><strong>v${escapeHtml(item.version)}</strong></header>
                <div class="review-meta"><span>등록자 ${escapeHtml(item.registrant)}</span><span>Owner ${escapeHtml(item.owner)}</span><span>Library 연결 ${(item.relations || []).length}</span><span>Framework 연결 ${(item.frameworkLinks || []).length}</span><span>내부 링크 ${(item.links || []).length}</span></div>
                <div class="review-actions"><button class="review-request-changes" type="button">수정 요청</button><button class="review-publish" type="button">승인·게시</button></div>
            </article>`).join("");
    }

    async function refresh() {
        if (runtime.mode !== "api") {
            note.textContent = "Nexus 검토본에서는 화면만 확인할 수 있습니다. 사내 API 모드에서 검토 요청 건이 표시됩니다.";
            render([]);
            return;
        }
        note.textContent = "검토 결과는 즉시 감사 기록에 남으며, 승인된 자산만 Library에 게시됩니다.";
        try { render(await repository.reviewQueue()); }
        catch (error) { note.textContent = error.message; render([]); }
    }

    list.addEventListener("click", async (event) => {
        const item = event.target.closest("[data-review-id]");
        if (!item) return;
        const id = item.dataset.reviewId;
        try {
            if (event.target.closest(".review-request-changes")) {
                const comment = window.prompt("등록자에게 전달할 수정 요청 사유를 입력하세요.");
                if (!comment?.trim()) return;
                await repository.requestChanges(id, comment.trim());
            } else if (event.target.closest(".review-publish")) {
                if (!window.confirm("검증을 완료하고 이 자산을 Library에 게시할까요?")) return;
                await repository.publishAsset(id);
            } else return;
            await refresh();
        } catch (error) { window.alert(error.message || "검토 처리 중 오류가 발생했습니다."); }
    });

    refresh();
})();
