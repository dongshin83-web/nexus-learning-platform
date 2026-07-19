(function () {
    "use strict";

    class StaticRepository {
        async listAssets() {
            return Array.isArray(window.TECHNICAL_ASSET_LIBRARY?.cards)
                ? window.TECHNICAL_ASSET_LIBRARY.cards
                : [];
        }

        async listCultureRecords() {
            return Array.isArray(window.TEAM_CULTURE_RECORDS) ? window.TEAM_CULTURE_RECORDS : [];
        }

        async recommendations() {
            return { recommended: [], searchResults: [], selected: [] };
        }

        async write() {
            throw new Error("정적 모드에서는 직접 등록할 수 없습니다. 사내 API 모드를 설정하세요.");
        }

        createAsset(payload) { return this.write(payload); }
        updateAsset(id, payload) { return this.write({ id, ...payload }); }
        submitAsset(id) { return this.write({ id }); }
        publishAsset(id) { return this.write({ id }); }
        createCultureRecord(payload) { return this.write(payload); }
        updateCultureRecord(id, payload) { return this.write({ id, ...payload }); }
    }

    class RestRepository {
        constructor(config) {
            this.baseUrl = String(config.apiBaseUrl ?? "").replace(/\/$/, "");
            this.credentials = config.credentials ?? "include";
            if (!this.baseUrl) throw new Error("REST API 모드에는 apiBaseUrl이 필요합니다.");
        }

        async request(path, options = {}) {
            const response = await fetch(`${this.baseUrl}${path}`, {
                credentials: this.credentials,
                ...options,
                headers: {
                    Accept: "application/json",
                    ...(options.body ? { "Content-Type": "application/json" } : {}),
                    ...(options.headers ?? {})
                }
            });
            if (!response.ok) {
                const problem = await response.json().catch(() => ({}));
                throw new Error(problem.message || `API 요청 실패 (${response.status})`);
            }
            if (response.status === 204) return null;
            return response.json();
        }

        listAssets(query = "") {
            return this.request(`/assets${query ? `?${query}` : ""}`);
        }

        getAsset(id) {
            return this.request(`/assets/${encodeURIComponent(id)}`);
        }

        createAsset(payload) {
            return this.request("/assets", { method: "POST", body: JSON.stringify(payload) });
        }

        updateAsset(id, payload) {
            return this.request(`/assets/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(payload) });
        }

        recommendations(id, query = "") {
            return this.request(`/assets/${encodeURIComponent(id)}/recommendations${query ? `?${query}` : ""}`);
        }

        submitAsset(id) {
            return this.request(`/assets/${encodeURIComponent(id)}/submit`, { method: "POST" });
        }

        publishAsset(id) {
            return this.request(`/assets/${encodeURIComponent(id)}/publish`, { method: "POST" });
        }

        listCultureRecords(query = "") {
            return this.request(`/culture-records${query ? `?${query}` : ""}`);
        }

        createCultureRecord(payload) {
            return this.request("/culture-records", { method: "POST", body: JSON.stringify(payload) });
        }

        updateCultureRecord(id, payload) {
            return this.request(`/culture-records/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(payload) });
        }
    }

    window.createTechnicalAssetRepository = function createTechnicalAssetRepository(config = {}) {
        return config.mode === "api" ? new RestRepository(config) : new StaticRepository();
    };
})();
