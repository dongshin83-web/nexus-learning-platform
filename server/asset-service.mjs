import path from "node:path";
import { validateCard, findDuplicateCandidates, scoreCard } from "../tools/card-contract.mjs";
import { assert, HttpError } from "./errors.mjs";
import { requireRole } from "./auth.mjs";

function serverCard(card, user) {
    const today = new Date().toISOString().slice(0, 10);
    return {
        ...card,
        publicationStatus: "초안",
        workflowStatus: "초안",
        registrant: user.displayName,
        createdAt: card.createdAt || today,
        updatedAt: today
    };
}

function validateOrThrow(card) {
    const result = validateCard(card);
    if (result.errors.length) throw new HttpError(422, "등록 데이터 검증에 실패했습니다.", result.errors);
    return result;
}

export class AssetService {
    constructor(store) { this.store = store; }

    register(card, user) {
        requireRole(user, "registrant");
        const prepared = serverCard(card, user);
        validateOrThrow(prepared);
        return this.store.transaction(() => {
            const created = this.store.createAsset(prepared, user.id, "초안");
            return this.store.transition(created.id, {
                workflowStatus: "검토 요청",
                publicationStatus: "초안",
                action: "submitted",
                comment: "등록과 동시에 Reviewer 검토 요청",
                actorId: user.id
            });
        });
    }

    createDraft(card, user) {
        requireRole(user, "registrant");
        const prepared = serverCard(card, user);
        validateOrThrow(prepared);
        return this.store.transaction(() => this.store.createAsset(prepared, user.id));
    }

    update(id, patch, user, expectedVersion) {
        requireRole(user, "registrant", "reviewer");
        const current = this.store.getAsset(id);
        assert(current, 404, "자산을 찾을 수 없습니다.");
        assert(user.roles.includes("reviewer") || user.roles.includes("admin") || current.createdBy === user.id, 403, "등록자 또는 Reviewer만 수정할 수 있습니다.");
        assert(["초안", "수정 필요"].includes(current.workflowStatus), 409, "게시된 자산은 새 개정 절차로 수정해야 합니다.");
        const next = { ...current, ...patch, id, publicationStatus: "초안" };
        validateOrThrow(next);
        return this.store.transaction(() => this.store.updateAsset(id, next, user.id, expectedVersion));
    }

    submit(id, user) {
        requireRole(user, "registrant");
        const current = this.store.getAsset(id);
        assert(current, 404, "자산을 찾을 수 없습니다.");
        assert(user.roles.includes("admin") || current.createdBy === user.id, 403, "해당 자산의 등록자만 검토를 요청할 수 있습니다.");
        assert(["초안", "수정 필요"].includes(current.workflowStatus), 409, "현재 상태에서는 검토를 요청할 수 없습니다.");
        validateOrThrow({ ...current, publicationStatus: "초안" });
        return this.store.transaction(() => this.store.transition(id, {
            workflowStatus: "검토 요청", action: "submitted", actorId: user.id
        }));
    }

    requestChanges(id, comment, user) {
        requireRole(user, "reviewer");
        assert(String(comment ?? "").trim(), 422, "수정 요청 사유를 입력하세요.");
        const current = this.store.getAsset(id);
        assert(current, 404, "자산을 찾을 수 없습니다.");
        assert(current.workflowStatus === "검토 요청", 409, "검토 요청 상태의 자산만 수정 요청할 수 있습니다.");
        return this.store.transaction(() => this.store.transition(id, {
            workflowStatus: "수정 필요", publicationStatus: "초안", reviewerId: user.displayName,
            action: "changes_requested", comment: String(comment).trim(), actorId: user.id
        }));
    }

    publish(id, user) {
        requireRole(user, "reviewer");
        const current = this.store.getAsset(id);
        assert(current, 404, "자산을 찾을 수 없습니다.");
        assert(current.workflowStatus === "검토 요청", 409, "검토 요청 상태의 자산만 게시할 수 있습니다.");
        const published = { ...current, publicationStatus: "게시", workflowStatus: "게시", reviewer: user.displayName };
        validateOrThrow(published);
        return this.store.transaction(() => this.store.transition(id, {
            workflowStatus: "게시", publicationStatus: "게시", reviewerId: user.displayName,
            action: "published", comment: "Reviewer 승인 및 게시", actorId: user.id
        }));
    }

    list(query, user) {
        const requestedStatus = query.get("workflowStatus");
        if (requestedStatus) requireRole(user, "reviewer");
        return requestedStatus
            ? this.store.listAssets({ workflowStatus: requestedStatus })
            : this.store.listAssets({ publicationStatus: "게시" });
    }

    get(id, user) {
        const item = this.store.getAsset(id);
        assert(item, 404, "자산을 찾을 수 없습니다.");
        const canRead = item.publicationStatus === "게시" || item.createdBy === user.id || user.roles.includes("reviewer") || user.roles.includes("admin");
        assert(canRead, 403, "이 자산을 조회할 권한이 없습니다.");
        return item;
    }

    reviewQueue(user) {
        requireRole(user, "reviewer");
        return this.store.listAssets({ workflowStatus: "검토 요청" });
    }

    recommendations(id, query, user) {
        requireRole(user, "registrant", "reviewer");
        const current = this.store.getAsset(id);
        assert(current, 404, "자산을 찾을 수 없습니다.");
        assert(current.publicationStatus === "게시" || current.createdBy === user.id || user.roles.includes("reviewer") || user.roles.includes("admin"), 403, "이 자산의 추천 결과를 조회할 권한이 없습니다.");
        const published = this.store.listAssets({ publicationStatus: "게시" });
        const q = String(query.get("q") ?? "").trim();
        const recommended = findDuplicateCandidates(current, published);
        const searchResults = q
            ? published.map((card) => ({ ...card, score: scoreCard(card, q) })).filter((card) => card.score > 0).sort((a, b) => b.score - a.score)
            : [];
        return { recommended, searchResults, selected: current.relations ?? [] };
    }
}
