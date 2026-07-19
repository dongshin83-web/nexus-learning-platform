PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    registration_id TEXT UNIQUE NOT NULL,
    asset_type TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    domain TEXT NOT NULL,
    publication_status TEXT NOT NULL DEFAULT '초안',
    workflow_status TEXT NOT NULL DEFAULT '초안',
    owner_id TEXT NOT NULL,
    reviewer_id TEXT,
    version INTEGER NOT NULL DEFAULT 1,
    payload_json TEXT NOT NULL,
    created_by TEXT NOT NULL,
    updated_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TEXT,
    CHECK (workflow_status IN ('초안', '검토 요청', '수정 필요', '승인', '게시', '보관'))
);

CREATE TABLE IF NOT EXISTS asset_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset_id TEXT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    link_role TEXT NOT NULL,
    access_scope TEXT NOT NULL,
    verification_status TEXT NOT NULL DEFAULT '미확인',
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS asset_relations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_asset_id TEXT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    target_asset_id TEXT NOT NULL REFERENCES assets(id),
    relation_type TEXT NOT NULL,
    note TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (source_asset_id, target_asset_id, relation_type)
);

CREATE TABLE IF NOT EXISTS framework_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset_id TEXT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    framework TEXT NOT NULL,
    target_id TEXT NOT NULL,
    relation_type TEXT NOT NULL,
    note TEXT NOT NULL,
    confirmed INTEGER NOT NULL DEFAULT 0,
    UNIQUE (asset_id, framework, target_id, relation_type)
);

CREATE TABLE IF NOT EXISTS asset_reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset_id TEXT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    asset_version INTEGER NOT NULL,
    action TEXT NOT NULL,
    comment TEXT,
    actor_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    aggregate_type TEXT NOT NULL,
    aggregate_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    before_json TEXT,
    after_json TEXT,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS culture_records (
    id TEXT PRIMARY KEY,
    record_type TEXT NOT NULL,
    title TEXT NOT NULL,
    series TEXT,
    summary TEXT NOT NULL,
    record_date TEXT,
    publication_status TEXT NOT NULL DEFAULT '초안',
    payload_json TEXT NOT NULL,
    created_by TEXT NOT NULL,
    updated_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS culture_media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id TEXT NOT NULL REFERENCES culture_records(id) ON DELETE CASCADE,
    media_type TEXT NOT NULL DEFAULT 'image',
    source_url TEXT NOT NULL,
    alt_text TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS culture_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    record_id TEXT NOT NULL REFERENCES culture_records(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    link_kind TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS assets_status_idx ON assets (publication_status, workflow_status);
CREATE INDEX IF NOT EXISTS asset_relations_target_idx ON asset_relations (target_asset_id);
CREATE INDEX IF NOT EXISTS culture_records_type_idx ON culture_records (record_type, publication_status);
