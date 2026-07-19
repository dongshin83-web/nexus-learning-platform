CREATE TABLE assets (
    id VARCHAR(120) PRIMARY KEY,
    registration_id VARCHAR(40) UNIQUE NOT NULL,
    asset_type VARCHAR(40) NOT NULL,
    title VARCHAR(300) NOT NULL,
    summary TEXT NOT NULL,
    domain VARCHAR(80) NOT NULL,
    publication_status VARCHAR(30) NOT NULL DEFAULT '초안',
    workflow_status VARCHAR(30) NOT NULL DEFAULT '초안',
    owner_id VARCHAR(120) NOT NULL,
    reviewer_id VARCHAR(120),
    version INTEGER NOT NULL DEFAULT 1,
    payload_json JSONB NOT NULL,
    created_by VARCHAR(120) NOT NULL,
    updated_by VARCHAR(120) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMPTZ,
    CONSTRAINT assets_workflow_status_check CHECK (workflow_status IN ('초안', '검토 요청', '수정 필요', '승인', '게시', '보관'))
);

CREATE TABLE asset_links (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    asset_id VARCHAR(120) NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    label VARCHAR(300) NOT NULL,
    href TEXT NOT NULL,
    link_role VARCHAR(80) NOT NULL,
    access_scope VARCHAR(80) NOT NULL,
    verification_status VARCHAR(30) NOT NULL DEFAULT '미확인',
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE asset_relations (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    source_asset_id VARCHAR(120) NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    target_asset_id VARCHAR(120) NOT NULL REFERENCES assets(id),
    relation_type VARCHAR(60) NOT NULL,
    note TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (source_asset_id, target_asset_id, relation_type)
);

CREATE TABLE framework_links (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    asset_id VARCHAR(120) NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    framework VARCHAR(40) NOT NULL,
    target_id VARCHAR(160) NOT NULL,
    relation_type VARCHAR(60) NOT NULL,
    note TEXT NOT NULL,
    confirmed BOOLEAN NOT NULL DEFAULT FALSE,
    UNIQUE (asset_id, framework, target_id, relation_type)
);

CREATE TABLE asset_reviews (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    asset_id VARCHAR(120) NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    asset_version INTEGER NOT NULL,
    action VARCHAR(30) NOT NULL,
    comment TEXT,
    actor_id VARCHAR(120) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_events (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    aggregate_type VARCHAR(40) NOT NULL,
    aggregate_id VARCHAR(120) NOT NULL,
    event_type VARCHAR(60) NOT NULL,
    actor_id VARCHAR(120) NOT NULL,
    before_json JSONB,
    after_json JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE culture_records (
    id VARCHAR(120) PRIMARY KEY,
    record_type VARCHAR(40) NOT NULL,
    title VARCHAR(300) NOT NULL,
    series VARCHAR(160),
    summary TEXT NOT NULL,
    record_date DATE,
    publication_status VARCHAR(30) NOT NULL DEFAULT '초안',
    payload_json JSONB NOT NULL,
    created_by VARCHAR(120) NOT NULL,
    updated_by VARCHAR(120) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE culture_media (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    record_id VARCHAR(120) NOT NULL REFERENCES culture_records(id) ON DELETE CASCADE,
    media_type VARCHAR(20) NOT NULL DEFAULT 'image',
    source_url TEXT NOT NULL,
    alt_text VARCHAR(500) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE culture_links (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    record_id VARCHAR(120) NOT NULL REFERENCES culture_records(id) ON DELETE CASCADE,
    label VARCHAR(300) NOT NULL,
    href TEXT NOT NULL,
    link_kind VARCHAR(80) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX assets_search_idx ON assets USING GIN (to_tsvector('simple', coalesce(title, '') || ' ' || coalesce(summary, '')));
CREATE INDEX assets_status_idx ON assets (publication_status, workflow_status);
CREATE INDEX asset_relations_target_idx ON asset_relations (target_asset_id);
CREATE INDEX culture_records_type_idx ON culture_records (record_type, publication_status);
