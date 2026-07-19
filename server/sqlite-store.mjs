import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { HttpError } from "./errors.mjs";

function parsePayload(row) {
    if (!row) return null;
    const payload = JSON.parse(row.payload_json);
    return {
        ...payload,
        id: row.id,
        registrationId: row.registration_id,
        publicationStatus: row.publication_status,
        workflowStatus: row.workflow_status,
        owner: row.owner_id,
        reviewer: row.reviewer_id || payload.reviewer || "",
        createdBy: row.created_by,
        updatedBy: row.updated_by,
        version: row.version,
        createdAt: String(row.created_at).slice(0, 10),
        updatedAt: String(row.updated_at).slice(0, 10),
        publishedAt: row.published_at
    };
}

export class SqliteAssetStore {
    constructor({ databasePath, schemaPath }) {
        fs.mkdirSync(path.dirname(databasePath), { recursive: true });
        this.db = new DatabaseSync(databasePath);
        this.db.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL; PRAGMA busy_timeout = 5000;");
        this.db.exec(fs.readFileSync(schemaPath, "utf8"));
    }

    close() { this.db.close(); }

    transaction(work) {
        this.db.exec("BEGIN IMMEDIATE");
        try {
            const result = work();
            this.db.exec("COMMIT");
            return result;
        } catch (error) {
            this.db.exec("ROLLBACK");
            throw error;
        }
    }

    getAsset(id) {
        const row = this.db.prepare("SELECT * FROM assets WHERE id = ?").get(id);
        return parsePayload(row);
    }

    listAssets({ workflowStatus, publicationStatus, ownerId } = {}) {
        const clauses = [];
        const values = [];
        if (workflowStatus) { clauses.push("workflow_status = ?"); values.push(workflowStatus); }
        if (publicationStatus) { clauses.push("publication_status = ?"); values.push(publicationStatus); }
        if (ownerId) { clauses.push("created_by = ?"); values.push(ownerId); }
        const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
        return this.db.prepare(`SELECT * FROM assets ${where} ORDER BY updated_at DESC, title COLLATE NOCASE`).all(...values).map(parsePayload);
    }

    createAsset(card, actorId, workflowStatus = "초안") {
        const payload = { ...card, publicationStatus: "초안", workflowStatus };
        try {
            this.db.prepare(`INSERT INTO assets (
                id, registration_id, asset_type, title, summary, domain,
                publication_status, workflow_status, owner_id, reviewer_id,
                version, payload_json, created_by, updated_by
            ) VALUES (?, ?, ?, ?, ?, ?, '초안', ?, ?, ?, 1, ?, ?, ?)`)
                .run(card.id, card.registrationId, card.type, card.title, card.summary, card.domain,
                    workflowStatus, card.owner, card.reviewer || null, JSON.stringify(payload), actorId, actorId);
            this.replaceChildren(card.id, payload);
            this.audit("asset", card.id, "asset.created", actorId, null, payload);
            return this.getAsset(card.id);
        } catch (error) {
            if (String(error.message).includes("UNIQUE constraint failed")) {
                throw new HttpError(409, "이미 사용 중인 자산 ID 또는 등록 ID입니다.");
            }
            if (String(error.message).includes("FOREIGN KEY constraint failed")) {
                throw new HttpError(422, "연결한 기존 Library 자산을 DB에서 찾을 수 없습니다. 최초 카드 이관 또는 연결 대상을 확인하세요.");
            }
            throw error;
        }
    }

    updateAsset(id, card, actorId, expectedVersion) {
        const current = this.getAsset(id);
        if (!current) throw new HttpError(404, "자산을 찾을 수 없습니다.");
        if (expectedVersion && current.version !== expectedVersion) throw new HttpError(409, "다른 사용자가 먼저 수정했습니다. 최신 내용을 다시 불러오세요.");
        const next = { ...current, ...card, id, version: current.version + 1, updatedAt: new Date().toISOString().slice(0, 10) };
        this.db.prepare(`UPDATE assets SET asset_type = ?, title = ?, summary = ?, domain = ?, owner_id = ?, reviewer_id = ?,
            publication_status = ?, workflow_status = ?, version = version + 1, payload_json = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
            .run(next.type, next.title, next.summary, next.domain, next.owner, next.reviewer || null,
                next.publicationStatus, next.workflowStatus, JSON.stringify(next), actorId, id);
        this.replaceChildren(id, next);
        this.audit("asset", id, "asset.updated", actorId, current, next);
        return this.getAsset(id);
    }

    transition(id, { workflowStatus, publicationStatus, reviewerId, action, comment, actorId }) {
        const current = this.getAsset(id);
        if (!current) throw new HttpError(404, "자산을 찾을 수 없습니다.");
        const next = {
            ...current,
            workflowStatus,
            publicationStatus: publicationStatus ?? current.publicationStatus,
            reviewer: reviewerId ?? current.reviewer,
            version: current.version + 1,
            updatedAt: new Date().toISOString().slice(0, 10)
        };
        if (workflowStatus === "게시") next.publishedAt = new Date().toISOString();
        this.db.prepare(`UPDATE assets SET workflow_status = ?, publication_status = ?, reviewer_id = ?, version = version + 1,
            payload_json = ?, updated_by = ?, updated_at = CURRENT_TIMESTAMP,
            published_at = CASE WHEN ? = '게시' THEN CURRENT_TIMESTAMP ELSE published_at END WHERE id = ?`)
            .run(workflowStatus, next.publicationStatus, next.reviewer || null, JSON.stringify(next), actorId, workflowStatus, id);
        this.db.prepare("INSERT INTO asset_reviews (asset_id, asset_version, action, comment, actor_id) VALUES (?, ?, ?, ?, ?)")
            .run(id, next.version, action, comment || null, actorId);
        this.audit("asset", id, `asset.${action}`, actorId, current, next);
        return this.getAsset(id);
    }

    replaceChildren(assetId, card) {
        this.db.prepare("DELETE FROM asset_links WHERE asset_id = ?").run(assetId);
        this.db.prepare("DELETE FROM asset_relations WHERE source_asset_id = ?").run(assetId);
        this.db.prepare("DELETE FROM framework_links WHERE asset_id = ?").run(assetId);
        const insertLink = this.db.prepare(`INSERT INTO asset_links
            (asset_id, label, href, link_role, access_scope, verification_status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)`);
        (card.links ?? []).forEach((link, index) => insertLink.run(assetId, link.label, link.href, link.role || "reference", link.accessScope || "권한 확인 필요", link.status || "pending", index));
        const insertRelation = this.db.prepare(`INSERT INTO asset_relations
            (source_asset_id, target_asset_id, relation_type, note) VALUES (?, ?, ?, ?)`);
        (card.relations ?? []).forEach((relation) => insertRelation.run(assetId, relation.targetId, relation.type, relation.note || ""));
        const insertFramework = this.db.prepare(`INSERT INTO framework_links
            (asset_id, framework, target_id, relation_type, note, confirmed) VALUES (?, ?, ?, ?, ?, ?)`);
        (card.frameworkLinks ?? []).forEach((link) => insertFramework.run(assetId, link.framework, link.targetId, link.relationType, link.note || "", link.confirmed ? 1 : 0));
    }

    audit(aggregateType, aggregateId, eventType, actorId, before, after) {
        this.db.prepare(`INSERT INTO audit_events
            (aggregate_type, aggregate_id, event_type, actor_id, before_json, after_json) VALUES (?, ?, ?, ?, ?, ?)`)
            .run(aggregateType, aggregateId, eventType, actorId, before ? JSON.stringify(before) : null, after ? JSON.stringify(after) : null);
    }

    listReviews(assetId) {
        return this.db.prepare("SELECT * FROM asset_reviews WHERE asset_id = ? ORDER BY created_at, id").all(assetId);
    }

    seedCards(cards, actorId = "migration") {
        return this.transaction(() => {
            const inserted = [];
            const skipped = [];
            const unresolvedRelations = [];
            const insert = this.db.prepare(`INSERT OR IGNORE INTO assets (
                id, registration_id, asset_type, title, summary, domain, publication_status, workflow_status,
                owner_id, reviewer_id, version, payload_json, created_by, updated_by, published_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, CASE WHEN ? = '게시' THEN CURRENT_TIMESTAMP ELSE NULL END)`);
            cards.forEach((card) => {
                const registrationId = card.registrationId || `MIG-${card.id}`;
                const workflowStatus = card.publicationStatus === "게시" ? "게시" : "초안";
                const result = insert.run(card.id, registrationId, card.type, card.title, card.summary, card.domain,
                    card.publicationStatus || "초안", workflowStatus, card.owner, card.reviewer || null,
                    JSON.stringify({ ...card, registrationId, workflowStatus }), actorId, actorId, card.publicationStatus || "초안");
                (result.changes ? inserted : skipped).push(card.id);
            });
            const ids = new Set(this.db.prepare("SELECT id FROM assets").all().map((row) => row.id));
            cards.filter((card) => inserted.includes(card.id)).forEach((card) => {
                const safeCard = {
                    ...card,
                    relations: (card.relations ?? []).filter((relation) => {
                        if (ids.has(relation.targetId)) return true;
                        unresolvedRelations.push(`${card.id} -> ${relation.targetId}`);
                        return false;
                    })
                };
                this.replaceChildren(card.id, safeCard);
                this.audit("asset", card.id, "asset.seeded", actorId, null, safeCard);
            });
            return { inserted, skipped, unresolvedRelations };
        });
    }
}
