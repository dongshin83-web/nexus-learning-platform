const textValue = (value) => String(value ?? "").trim();
const CARD_MARKER_START = "<!-- TECHNICAL_ASSET_CARD_JSON";
const CARD_MARKER_END = "-->";
const ASSET_ID_PATTERN = /^TA-(MTH|BPR|VDR|COR|TRP|ERM|KHW|TML|EDU)-20[0-9]{2}-(?!00000)[0-9]{5}$/;
const ASSET_TYPE_CONFIG = {
    "방법론": { code: "MTH", path: "methodology", assetType: "methodology" },
    "BP": { code: "BPR", path: "bp", assetType: "bp" },
    "VD Request": { code: "VDR", path: "vd-request", assetType: "vd_request" },
    "CoR": { code: "COR", path: "cor", assetType: "cor" },
    "기술보고서": { code: "TRP", path: "technical-report", assetType: "technical_report" },
    "외부 보고 자료": { code: "ERM", path: "external-report-material", assetType: "external_report_material" },
    "노하우": { code: "KHW", path: "knowhow", assetType: "knowhow" },
    "Tool Manual": { code: "TML", path: "tool-manual", assetType: "tool_manual" },
    "교육자료": { code: "EDU", path: "education-material", assetType: "education_material" }
};
const COR_PROJECT_OUTCOMES = Object.freeze({ 완료: "completed", Drop: "drop" });
const METHODOLOGY_QUALIFICATIONS = Object.freeze({ "방법론 후보": "candidate", "정식 방법론": "formal" });
const METHODOLOGY_LEVELS = Object.freeze(["unassessed", "L1", "L2", "L3", "L4", "L5"]);
const TECHNOLOGY_MAP_STATUSES = Object.freeze(["linked", "unlisted_new", "unlisted_omitted", "pending"]);
const DOMAIN_LABELS = {
    deformation: "변형",
    delamination: "박리",
    impact: "충격",
    "thermal-flow": "열유동",
    fatigue: "피로",
    vibration: "진동",
    other: "기타"
};

export function normalizeGitLabRegistrationConfig(config = {}) {
    return {
        baseUrl: textValue(config.baseUrl).replace(/\/+$/, ""),
        projectId: textValue(config.projectId),
        wikiUrl: textValue(config.wikiUrl).replace(/\/+$/, ""),
        token: textValue(config.token)
    };
}

export function validateGitLabRegistrationConfig(config = {}) {
    const normalized = normalizeGitLabRegistrationConfig(config);
    const errors = [];
    if (!normalized.baseUrl) errors.push("GitLab 서버 주소를 입력하세요.");
    if (normalized.baseUrl && !/^https:\/\//i.test(normalized.baseUrl) && !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalized.baseUrl)) {
        errors.push("GitLab 서버 주소는 HTTPS를 사용해야 합니다.");
    }
    if (!normalized.projectId) errors.push("GitLab 프로젝트 ID 또는 경로를 입력하세요.");
    if (!normalized.token) errors.push("현재 사용자 GitLab Access Token을 입력하세요.");
    return errors;
}

export function buildGitLabWikiApiUrl(config = {}) {
    const normalized = normalizeGitLabRegistrationConfig(config);
    return `${normalized.baseUrl}/api/v4/projects/${encodeURIComponent(normalized.projectId)}/wikis`;
}

export function buildGitLabCurrentUserApiUrl(config = {}) {
    const normalized = normalizeGitLabRegistrationConfig(config);
    return `${normalized.baseUrl}/api/v4/user`;
}

export function buildGitLabIssuesApiUrl(config = {}) {
    const normalized = normalizeGitLabRegistrationConfig(config);
    return `${normalized.baseUrl}/api/v4/projects/${encodeURIComponent(normalized.projectId)}/issues`;
}

export function buildGitLabWikiWebUrl(slug, config = {}) {
    const normalized = normalizeGitLabRegistrationConfig(config);
    const encodedSlug = textValue(slug).split("/").map(encodeURIComponent).join("/");
    if (normalized.wikiUrl) return `${normalized.wikiUrl}/${encodedSlug}`;
    if (!normalized.baseUrl || !normalized.projectId || /^\d+$/.test(normalized.projectId)) return "";
    return `${normalized.baseUrl}/${normalized.projectId.replace(/^\/+|\/+$/g, "")}/-/wikis/${encodedSlug}`;
}

function markdownValue(value) {
    if (Array.isArray(value)) return value.map((item) => `- ${markdownValue(item)}`).join("\n");
    if (value && typeof value === "object") return Object.entries(value).map(([key, item]) => `- **${key}**: ${markdownValue(item)}`).join("\n");
    return textValue(value) || "미기록";
}

function yamlScalar(value) {
    if (value === null || value === undefined || value === "") return "null";
    if (typeof value === "boolean") return value ? "true" : "false";
    return JSON.stringify(String(value));
}

function yamlArray(values, indent = 0) {
    const items = Array.isArray(values) ? values.filter((item) => textValue(item)) : [];
    if (!items.length) return "[]";
    const prefix = " ".repeat(indent);
    return `\n${items.map((item) => `${prefix}- ${yamlScalar(item)}`).join("\n")}`;
}

function yamlObjectArray(values, keys, indent = 0) {
    const items = Array.isArray(values) ? values.filter((item) => item && typeof item === "object") : [];
    if (!items.length) return "[]";
    const prefix = " ".repeat(indent);
    const nested = " ".repeat(indent + 2);
    return `\n${items.map((item) => {
        const [first, ...rest] = keys;
        return `${prefix}- ${first}: ${yamlScalar(item[first])}\n${rest.map((key) => `${nested}${key}: ${yamlScalar(item[key])}`).join("\n")}`;
    }).join("\n")}`;
}

function normalizeMethodologyLevel(value) {
    const level = textValue(value);
    if (["미평가", "unassessed"].includes(level)) return "unassessed";
    return METHODOLOGY_LEVELS.includes(level) ? level : "unassessed";
}

function methodologyLevelChangeType(fromLevel, toLevel, preferred = "") {
    const allowed = ["initial", "upgrade", "maintain", "downgrade", "unassessed"];
    if (allowed.includes(textValue(preferred))) return textValue(preferred);
    if (fromLevel === "unassessed" && toLevel === "unassessed") return "unassessed";
    if (fromLevel === "unassessed") return "initial";
    if (toLevel === "unassessed") return "unassessed";
    const fromNumber = Number(fromLevel.slice(1));
    const toNumber = Number(toLevel.slice(1));
    if (toNumber > fromNumber) return "upgrade";
    if (toNumber < fromNumber) return "downgrade";
    return "maintain";
}

function methodologyRegistration(card = {}) {
    const source = card.internalCompletion?.methodology ?? {};
    const fromLevel = normalizeMethodologyLevel(source.previousLevel);
    const proposedLevel = normalizeMethodologyLevel(source.proposedLevel);
    const toLevel = normalizeMethodologyLevel(source.confirmedLevel || source.proposedLevel);
    const map = source.technologyMap ?? {};
    return {
        qualificationStatus: METHODOLOGY_QUALIFICATIONS[textValue(card.status)] || "candidate",
        fromLevel,
        proposedLevel,
        toLevel,
        changeType: methodologyLevelChangeType(fromLevel, toLevel, source.changeType),
        rationale: textValue(source.rationale),
        evidenceRefs: uniqueValues(source.evidenceRefs),
        assessedAt: textValue(card.registrationSource?.importedAt || card.updatedAt || card.createdAt).slice(0, 10) || null,
        assessedBy: textValue(card.registrant || card.owner),
        reviewedBy: textValue(card.reviewer),
        technologyMap: {
            status: TECHNOLOGY_MAP_STATUSES.includes(textValue(map.status)) ? textValue(map.status) : "pending",
            nodeId: textValue(map.targetId) || null,
            note: textValue(map.note) || null
        }
    };
}

function methodologyFrontMatter(card = {}) {
    if (textValue(card.type) !== "방법론") return "";
    const method = methodologyRegistration(card);
    return `methodology:\n` +
        `  qualification_status: ${yamlScalar(method.qualificationStatus)}\n` +
        `  maturity:\n` +
        `    current_level: ${yamlScalar(method.fromLevel)}\n` +
        `    proposed_level: ${yamlScalar(method.toLevel)}\n` +
        `    level_history:\n` +
        `      - from_level: ${yamlScalar(method.fromLevel)}\n` +
        `        to_level: ${yamlScalar(method.toLevel)}\n` +
        `        change_type: ${yamlScalar(method.changeType)}\n` +
        `        rationale: ${yamlScalar(method.rationale)}\n` +
        `        evidence_refs: ${yamlArray(method.evidenceRefs, 10)}\n` +
        `        assessed_at: ${yamlScalar(method.assessedAt)}\n` +
        `        assessed_by: ${yamlScalar(method.assessedBy)}\n` +
        `        reviewed_by: ${yamlScalar(method.reviewedBy)}\n` +
        `        review_status: "pending_peer_review"\n` +
        `  technology_map:\n` +
        `    status: ${yamlScalar(method.technologyMap.status)}\n` +
        `    node_id: ${yamlScalar(method.technologyMap.nodeId)}\n` +
        `    note: ${yamlScalar(method.technologyMap.note)}\n\n`;
}

function methodologyInternalDecisionMarkdown(card = {}) {
    if (textValue(card.type) !== "방법론") return "";
    const method = methodologyRegistration(card);
    const mapLabels = {
        linked: "기존 Map 항목과 연결",
        unlisted_new: "신규 방법론·아직 미등재",
        unlisted_omitted: "기존 분류에서 생략·누락",
        pending: "연결 확인 필요"
    };
    return `\n\n## 사내 방법론 판정\n\n` +
        `- 방법론 자격: ${method.qualificationStatus === "formal" ? "정식 방법론" : "방법론 후보"}\n` +
        `- Level 변경: ${method.fromLevel} → ${method.toLevel} (${method.changeType})\n` +
        `- 변경 근거: ${method.rationale || "Peer 확인 필요"}\n` +
        `- 근거 참조: ${method.evidenceRefs.length ? method.evidenceRefs.join(", ") : "별도 참조 없음"}\n` +
        `- Technology Map: ${mapLabels[method.technologyMap.status]}${method.technologyMap.nodeId ? ` · ${method.technologyMap.nodeId}` : ""}${method.technologyMap.note ? ` · ${method.technologyMap.note}` : ""}`;
}

function uniqueValues(values) {
    return [...new Set((Array.isArray(values) ? values : []).map(textValue).filter(Boolean))];
}

function cardSearchFacets(card = {}) {
    return card.searchMetadata?.searchFacets ?? card.searchMetadata?.facets ?? {};
}

function additionalTags(card = {}) {
    const facets = cardSearchFacets(card);
    const reserved = new Set([
        card.type,
        DOMAIN_LABELS[card.domain],
        ...uniqueValues(card.secondaryDomains).map((domain) => DOMAIN_LABELS[domain]),
        ...uniqueValues(card.contexts),
        ...uniqueValues(facets.problemPhenomena),
        ...uniqueValues(facets.productStructureProcess),
        ...uniqueValues(facets.toolModelData)
    ].map(textValue).filter(Boolean));
    return uniqueValues(card.tags).filter((tag) => !reserved.has(tag));
}

const CARD_CONTENT_HEADINGS = {
    "방법론": [
        ["해결 문제와 활용 목적", ["problemAndPurpose"]],
        ["기술 원리와 가정", ["technicalPrinciples"]],
        ["입력과 전제조건", ["inputsAndPrerequisites"]],
        ["표준 절차와 판단 흐름", ["standardProcedure"]],
        ["결과와 판단기준", ["resultsAndCriteria"]],
        ["적용범위와 한계", ["scopeAndLimits"]],
        ["검증·재사용 근거", ["validationAndReuse"]]
    ],
    "BP": [
        ["사업 맥락과 판단 질문", ["businessContext"]],
        ["Simulation 대응", ["simulationResponse"]],
        ["사업부 피드백과 행동", ["businessFeedback"]],
        ["사업 영향과 확인 수준", ["businessImpact"]],
        ["재현 조건", ["reproductionConditions"]],
        ["근거 종류와 역할", ["evidence"]]
    ],
    "VD Request": [
        ["요청 맥락과 판단 질문", ["context", "primaryQuestion"]],
        ["입력·전제조건·제약", ["inputsAndConstraints"]],
        ["기존 기술자산 검색과 활용", ["searchReuse"]],
        ["Simulation 대응과 판단 결과", ["approach", "evidenceSummary", "result", "applicability"]],
        ["활용 범위·실제 영향·후속 연결", ["applicability", "requesterFeedback", "decisionImpact", "followUp"]]
    ],
    "CoR": [
        ["발굴 배경과 기술 Gap", ["backgroundAndGap"]],
        ["과제 목표와 성공기준", ["objectiveAndSuccessCriteria"]],
        ["범위·수행계획·책임", ["scopeAndPlan"]],
        ["검증 설계", ["validationDesign"]],
        ["진행 중 판단과 변경", ["progressDecisions"]],
        ["결과와 판단 가능 범위", ["resultAndJudgment"]],
        ["산출물·파생 자산·후속조치", ["outputsAndFollowUp"]]
    ],
    "기술보고서": [
        ["기술 질문과 작성 목적", ["questionAndPurpose"]],
        ["검토 범위와 핵심 조건", ["scopeAndConditions"]],
        ["분석·실험 방법과 검증 근거", ["methodAndEvidence"]],
        ["주요 발견과 기술적 결론", ["findingsAndConclusion"]],
        ["결론의 유효조건과 지원 가능한 판단", ["validConditionsAndDecisions"]],
        ["한계와 추가 확인사항", ["limitations"]],
        ["원문·근거·관련 자산의 역할", ["sourceAndRelationRoles"]]
    ],
    "외부 보고 자료": [
        ["보고 목적", ["reportPurpose"]],
        ["보고 대상과 의사결정", ["audienceAndDecision"]],
        ["승인된 핵심 메시지", ["approvedMessages"]],
        ["근거 자산의 종류와 역할", ["sourceAssetsAndEvidence"]],
        ["공유범위·익명화·제외정보", ["disclosureScope"]],
        ["유효 조건과 재검토 조건", ["versionAndValidity"]],
        ["해석 한계와 전달 주의점", ["limitationsAndNotes"]]
    ],
    "노하우": [
        ["노하우 범주", ["knowhowCategory"]],
        ["적용 상황·목표", ["symptomAndConditions"]],
        ["핵심 난점·사전 확인", ["causeAndDiagnosis"]],
        ["실행 절차·판단 이유", ["resolution"]],
        ["완료·품질 확인·근거", ["effectAndEvidence"]],
        ["예외·위험·대응", ["risksAndRecovery"]],
        ["재사용 범위와 연결 자료 역할", ["versionsAndSources"]]
    ],
    "Tool Manual": [
        ["작업 목적과 결과물", ["purposeAndOutput"]],
        ["사전 준비와 입력", ["prerequisites"]],
        ["표준 실행 절차", ["procedure"]],
        ["정상 완료 확인", ["completionCheck"]],
        ["오류·주의사항·관련 노하우", ["errorsAndWarnings"]],
        ["버전 조건과 연결 자료 역할", ["versionsAndSources"]]
    ],
    "교육자료": [
        ["학습목표", ["learningObjectives"]],
        ["대상과 사전지식", ["audienceAndPrerequisites"]],
        ["핵심 내용과 구성", ["outline"]],
        ["학습활동·시간·준비물", ["activities"]],
        ["완료·이해 확인기준", ["completionCriteria"]],
        ["학습 대상 자산과 자료 역할", ["sourcesAndVersion"]]
    ]
};

function sectionMarkdown(card, keys) {
    const values = keys.map((key) => card.content?.[key]).filter((value) => {
        if (Array.isArray(value)) return value.length > 0;
        return value !== null && value !== undefined && textValue(value);
    });
    return values.length ? values.map(markdownValue).join("\n\n") : "확인된 내용 없음";
}

function markdownList(values, emptyText = "확인된 내용 없음") {
    const items = uniqueValues(values);
    return items.length ? items.map((item) => `- ${item}`).join("\n") : emptyText;
}

function markdownSubsection(title, value, { quote = false, emptyText = "확인된 내용 없음" } = {}) {
    const body = Array.isArray(value)
        ? markdownList(value, emptyText)
        : (textValue(value) || emptyText);
    const formatted = quote && body !== emptyText
        ? body.split(/\r?\n/).map((line) => `> ${line}`).join("\n")
        : body;
    return `### ${title}\n\n${formatted}`;
}

function requiredEvidenceDisplay(card, key, contentValue) {
    const entry = card.internalCompletion?.requiredEvidence?.[key] ?? {};
    const status = textValue(entry.status);
    if (status === "confirmed") {
        if (key === "decisionImpact" && contentValue && typeof contentValue === "object") {
            const outcomes = uniqueValues(contentValue.outcomes);
            return [
                textValue(contentValue.summary),
                outcomes.length ? `- 반영 유형: ${outcomes.join(", ")}` : ""
            ].filter(Boolean).join("\n");
        }
        return textValue(contentValue) || "확인된 내용 없음";
    }
    const statusLabel = REQUIRED_EVIDENCE_STATUS_LABELS[status] || "상태 미확정";
    const note = textValue(entry.note);
    return `- 상태: ${statusLabel}${note ? `\n- 사유·후속 확인 계획: ${note}` : ""}`;
}

function vdRequestSearchReuseMarkdown(card = {}) {
    const reuse = card.searchReuse ?? {};
    if (reuse.performed !== true) return "기존 Wiki 자산 검색이 완료되지 않았습니다.";
    const linked = uniqueValues(reuse.foundAssetIds);
    const lines = [
        "- 검색 수행: 등록 시 Wiki Index 자동 검색 완료",
        reuse.indexVersion ? `- 검색 Index: ${textValue(reuse.indexVersion)}` : "",
        linked.length ? `- 연결 자산: ${linked.join(", ")}` : "- 검색 결과: 적용 가능한 기존 자산을 연결하지 않음",
        reuse.usageType ? `- 활용 방식: ${textValue(reuse.usageType)}` : "",
        reuse.reason ? `- 활용 결과·판단 사유: ${textValue(reuse.reason)}` : ""
    ].filter(Boolean);
    return lines.join("\n");
}

function internalLinksMarkdown(card = {}) {
    const links = (Array.isArray(card.links) ? card.links : []).filter((link) => textValue(link.href));
    const relations = (Array.isArray(card.relations) ? card.relations : []).filter((relation) => textValue(relation.targetId));
    const lines = [
        ...links.map((link) => `- [${textValue(link.label) || "사내 근거"}](${textValue(link.href)}) · ${textValue(link.role || link.type || "근거")}`),
        ...relations.map((relation) => `- 관련 자산 ${textValue(relation.targetId)} · ${textValue(relation.note) || textValue(relation.type)}`)
    ];
    if (lines.length) return lines.join("\n");
    const decision = card.internalCompletion?.sourceLinkDecision ?? {};
    if (textValue(decision.status) === "no_internal_asset") {
        return `- 상태: 회사 내부 자산 링크 없음\n- 판단 사유: ${textValue(decision.reason) || "사유 미기록"}`;
    }
    return "회사 내부 자산 링크 판단이 완료되지 않았습니다.";
}

function vdRequestWikiMarkdown(card = {}) {
    const content = card.content ?? {};
    const applicability = content.applicability ?? {};
    return [
        "## 요청 맥락과 판단 질문",
        markdownSubsection("요청 맥락", content.context),
        markdownSubsection("핵심 판단 질문", content.primaryQuestion, { quote: true }),
        "## 입력·전제조건·제약",
        markdownList(content.inputsAndConstraints),
        "## 기존 기술자산 검색과 활용",
        vdRequestSearchReuseMarkdown(card),
        "## Simulation 대응과 판단 결과",
        markdownSubsection("검토 방법", content.approach),
        markdownSubsection("관찰 근거", content.evidenceSummary),
        markdownSubsection("기술적 해석과 결론", content.result),
        markdownSubsection("판단 가능 범위", applicability.judgmentScope),
        "## 활용 범위·실제 영향·후속 연결",
        markdownSubsection("적용 가능한 조건", applicability.validConditions),
        markdownSubsection("한계", applicability.limitations),
        markdownSubsection("요청자 피드백", requiredEvidenceDisplay(card, "requesterFeedback", content.requesterFeedback)),
        markdownSubsection("의사결정 영향", requiredEvidenceDisplay(card, "decisionImpact", content.decisionImpact)),
        markdownSubsection("후속조치", content.followUp, { emptyText: "확인된 후속조치 없음" }),
        markdownSubsection("사내 근거와 관련 자산", internalLinksMarkdown(card))
    ].join("\n\n");
}

function corWikiMarkdown(card = {}) {
    const content = card.content ?? {};
    return [
        "## 발굴 배경과 기술 Gap",
        textValue(content.backgroundAndGap) || "확인된 내용 없음",
        markdownSubsection("과제 종료 상태", card.status),
        "## 과제 목표와 성공기준",
        textValue(content.objectiveAndSuccessCriteria) || "확인된 내용 없음",
        "## 범위·수행계획·책임",
        textValue(content.scopeAndPlan) || "확인된 내용 없음",
        "## 검증 설계",
        textValue(content.validationDesign) || "확인된 내용 없음",
        "## 진행 중 판단과 변경",
        markdownList(content.progressDecisions),
        "## 결과와 판단 가능 범위",
        textValue(content.resultAndJudgment) || "확인된 내용 없음",
        "## 산출물·파생 자산·후속조치",
        markdownSubsection("산출물과 후속조치", content.outputsAndFollowUp),
        markdownSubsection("사내 완료 근거와 관련 자산", internalLinksMarkdown(card))
    ].join("\n\n");
}

function currentKoreanYear(now = new Date()) {
    return new Intl.DateTimeFormat("en", { timeZone: "Asia/Seoul", year: "numeric" }).format(now);
}

export function nextAssetId(cardType, existingValues = [], now = new Date()) {
    const config = ASSET_TYPE_CONFIG[cardType];
    if (!config) throw new Error(`자산 ID를 발급할 수 없는 유형입니다: ${cardType}`);
    const year = currentKoreanYear(now);
    const prefix = `TA-${config.code}-${year}-`;
    const maximum = existingValues
        .flatMap((value) => String(value ?? "").match(/TA-(?:MTH|BPR|VDR|COR|TRP|ERM|KHW|TML|EDU)-20[0-9]{2}-(?:[0-9]{5})/g) ?? [])
        .filter((id) => id.startsWith(prefix))
        .reduce((max, id) => Math.max(max, Number(id.slice(-5))), 0);
    if (maximum >= 99999) throw new Error(`${config.label || cardType} ${year}년 자산 ID 발급 한도를 초과했습니다.`);
    return `${prefix}${String(maximum + 1).padStart(5, "0")}`;
}

export async function loadGitLabWikiPages(config = {}, fetchImpl = globalThis.fetch, options = {}) {
    const normalized = normalizeGitLabRegistrationConfig(config);
    const errors = validateGitLabRegistrationConfig(normalized);
    if (errors.length) throw new Error(errors.join(" "));
    const values = [];
    const withContent = options.withContent === true;
    let page = 1;
    while (page <= 1000) {
        const query = new URLSearchParams({ per_page: "100", page: String(page), with_content: String(withContent) });
        const response = await fetchImpl(`${buildGitLabWikiApiUrl(normalized)}?${query}`, {
            method: "GET",
            headers: { "PRIVATE-TOKEN": normalized.token }
        });
        if (!response.ok) {
            const message = await readApiMessage(response);
            throw new Error(`GitLab Wiki ID 조회 실패 (${response.status}): ${message}`);
        }
        const pages = await response.json().catch(() => []);
        (Array.isArray(pages) ? pages : []).forEach((item) => values.push(item));
        const nextPage = textValue(response.headers?.get?.("x-next-page"));
        if (nextPage) page = Number(nextPage);
        else if (!Array.isArray(pages) || pages.length < 100) break;
        else page += 1;
    }
    return values;
}

export async function loadGitLabWikiPageSlugs(config = {}, fetchImpl = globalThis.fetch) {
    const pages = await loadGitLabWikiPages(config, fetchImpl, { withContent: false });
    return pages.flatMap((item) => [textValue(item?.slug), textValue(item?.title)]).filter(Boolean);
}

function wikiFrontMatterScalar(content, key) {
    const escapedKey = String(key).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const match = String(content ?? "").match(new RegExp(`^${escapedKey}:\\s*(.+?)\\s*$`, "m"));
    if (!match) return "";
    const raw = match[1].trim();
    if (!raw || raw === "null" || raw === "~") return "";
    try {
        return textValue(JSON.parse(raw));
    } catch {
        return textValue(raw.replace(/^['"]|['"]$/g, ""));
    }
}

function wikiPageAssetId(page = {}) {
    const fromContent = wikiFrontMatterScalar(page.content, "asset_id");
    if (ASSET_ID_PATTERN.test(fromContent)) return fromContent;
    const match = `${textValue(page.slug)} ${textValue(page.title)}`.match(/TA-(?:MTH|BPR|VDR|COR|TRP|ERM|KHW|TML|EDU)-20[0-9]{2}-(?!00000)[0-9]{5}/);
    return match?.[0] ?? "";
}

function findWikiPageByRegistrationId(pages = [], registrationId = "") {
    const target = textValue(registrationId);
    if (!target) return null;
    const matches = pages.filter((page) => wikiFrontMatterScalar(page?.content, "registration_id") === target);
    if (matches.length > 1) throw new Error(`같은 registration_id가 여러 Wiki 문서에 있습니다: ${target}`);
    return matches[0] ?? null;
}

function existingRegistrationResult(page, card, normalized, typeConfig) {
    const assetId = wikiPageAssetId(page);
    if (!assetId) throw new Error("기존 registration_id 문서에서 자산 ID를 확인할 수 없습니다.");
    const expectedPathPrefix = `assets/${typeConfig.path}/`;
    const slug = textValue(page.slug) || `${expectedPathPrefix}${assetId}`;
    if (!slug.startsWith(expectedPathPrefix)) {
        throw new Error(`같은 registration_id가 다른 자산유형에 사용되었습니다: ${textValue(card.registrationId)}`);
    }
    const issuedCard = { ...card, id: assetId };
    return {
        assetId,
        issuedCard,
        slug,
        wikiUrl: buildGitLabWikiWebUrl(slug, normalized),
        projectId: normalized.projectId,
        idempotentReplay: true,
        searchIndexStatus: "pending_index_build"
    };
}

const REQUIRED_EVIDENCE_STATUS_LABELS = {
    confirmed: "확인 완료",
    deferred: "추후 확인",
    not_applicable: "해당 없음"
};

function markdownTableCell(value) {
    return textValue(value)
        .replace(/\|/g, "\\|")
        .replace(/\r?\n/g, "<br>");
}

function vdRequestRequiredEvidenceMarkdown(card = {}) {
    if (textValue(card.type) !== "VD Request") return "";
    const requiredEvidence = card.internalCompletion?.requiredEvidence;
    if (!requiredEvidence || typeof requiredEvidence !== "object" || Array.isArray(requiredEvidence)) return "";

    const rows = [
        ["요청자 피드백", requiredEvidence.requesterFeedback],
        ["의사결정 영향", requiredEvidence.decisionImpact]
    ].map(([label, entry]) => {
        const statusLabel = REQUIRED_EVIDENCE_STATUS_LABELS[textValue(entry?.status)];
        if (!statusLabel) return "";
        return `| ${label} | ${statusLabel} | ${markdownTableCell(entry?.note) || "-"} |`;
    }).filter(Boolean);

    if (!rows.length) return "";
    return `\n\n## 사내 완료 상태\n\n` +
        `| 항목 | 상태 | 사유·후속 확인 계획 |\n` +
        `| --- | --- | --- |\n` +
        rows.join("\n");
}

export function cardToGitLabWikiMarkdown(card) {
    const config = ASSET_TYPE_CONFIG[card.type];
    if (!config) throw new Error(`YAML Wiki Page로 변환할 수 없는 자산유형입니다: ${card.type}`);
    if (!ASSET_ID_PATTERN.test(textValue(card.id))) throw new Error("표준 자산 ID를 먼저 발급해야 합니다.");
    const facets = cardSearchFacets(card);
    const stages = uniqueValues(card.searchMetadata?.workflowStages ?? card.contexts).filter((value) => ["연구", "설계", "개발", "공정", "제조", "품질"].includes(value));
    const audiences = uniqueValues(card.searchMetadata?.responseTargets ?? card.contexts).filter((value) => ["고객", "사업부", "CTO", "AX", "품질경영", "생산기술"].includes(value));
    const links = (Array.isArray(card.links) ? card.links : []).map((link) => ({
        label: textValue(link.label),
        link_type: textValue(link.role || link.type || "other"),
        url: textValue(link.href),
        source_system: textValue(link.system || link.assetType || "사내 시스템"),
        source_version: textValue(link.sourceVersion) || null,
        last_checked_at: textValue(link.verifiedAt).slice(0, 10) || null,
        status: link.status === "verified" ? "active" : "review_required"
    })).filter((link) => link.url);
    const relations = (Array.isArray(card.relations) ? card.relations : []).map((relation) => ({
        type: textValue(relation.type || "REFERENCES"),
        target_asset_id: textValue(relation.targetId),
        target_version: textValue(relation.targetVersion) || null,
        note: textValue(relation.note) || "등록 과정에서 연결",
        evidence_url: textValue(relation.evidenceUrl) || null,
        status: relation.status === "inactive" ? "inactive" : "active",
        ended_at: textValue(relation.endedAt) || null,
        ended_reason: textValue(relation.endedReason) || null
    })).filter((relation) => relation.target_asset_id);
    const requiredEvidence = card.internalCompletion?.requiredEvidence ?? {};
    const sourceLinkDecision = card.internalCompletion?.sourceLinkDecision ?? {};
    const projectOutcomeFrontMatter = card.type === "CoR"
        ? `project_outcome: ${yamlScalar(COR_PROJECT_OUTCOMES[textValue(card.status)])}\n`
        : "";
    const sourceLinkDecisionFrontMatter = `source_link_decision:\n` +
        `  status: ${yamlScalar(sourceLinkDecision.status)}\n` +
        `  reason: ${yamlScalar(sourceLinkDecision.reason)}\n` +
        `  decided_by: ${yamlScalar(sourceLinkDecision.decidedBy)}\n` +
        `  decided_at: ${yamlScalar(sourceLinkDecision.decidedAt)}\n`;
    const contentCompletion = card.type === "VD Request"
        ? `\ncontent_completion:\n` +
          `  requester_feedback:\n    status: ${yamlScalar(requiredEvidence.requesterFeedback?.status)}\n    note: ${yamlScalar(requiredEvidence.requesterFeedback?.note)}\n` +
          `  decision_impact:\n    status: ${yamlScalar(requiredEvidence.decisionImpact?.status)}\n    note: ${yamlScalar(requiredEvidence.decisionImpact?.note)}\n`
        : "";
    const searchReuse = card.searchReuse ?? {};
    const searchReuseFrontMatter = card.type === "VD Request"
        ? `search_reuse:\n` +
          `  performed: ${searchReuse.performed === true}\n` +
          `  searched_at: ${yamlScalar(searchReuse.searchedAt)}\n` +
          `  searched_by: ${yamlScalar(searchReuse.searchedBy)}\n` +
          `  index_version: ${yamlScalar(searchReuse.indexVersion)}\n` +
          `  search_terms: ${yamlArray(uniqueValues(searchReuse.searchTerms), 4)}\n` +
          `  found_asset_ids: ${yamlArray(uniqueValues(searchReuse.foundAssetIds), 4)}\n` +
          `  decision: ${yamlScalar(searchReuse.decision)}\n` +
          `  usage_type: ${yamlScalar(searchReuse.usageType)}\n` +
          `  reason: ${yamlScalar(searchReuse.reason)}\n\n`
        : "";
    const methodologyMetadata = methodologyFrontMatter(card);
    const frontMatter = `---\n` +
        `schema_version: "1.0"\n` +
        `registration_id: ${yamlScalar(card.registrationId)}\n` +
        `asset_id: ${yamlScalar(card.id)}\n` +
        `asset_type: ${yamlScalar(config.assetType)}\n` +
        `title: ${yamlScalar(card.title)}\n` +
        `summary: ${yamlScalar(card.summary)}\n` +
        `asset_status: "registered"\n` +
        `${projectOutcomeFrontMatter}` +
        `${methodologyMetadata}` +
        `current_version: null\nreplaces: []\nreplaced_by: null\nretired_at: null\nretirement_reason: null\n\n` +
        `ownership:\n  owner: ${yamlScalar(card.owner)}\n  contributors: ${yamlArray(uniqueValues(card.contributors), 4)}\n\n` +
        `review:\n  reviewer: ${yamlScalar(card.reviewer)}\n  confirmed_at: null\n  note: "Peer 확인 대기"\n\n` +
        `classification:\n` +
        `  primary_domain: ${yamlScalar(card.domain)}\n` +
        `  secondary_domains: ${yamlArray(uniqueValues(card.secondaryDomains), 4)}\n` +
        `  products_processes: ${yamlArray(uniqueValues(facets.productStructureProcess), 4)}\n` +
        `  problems: ${yamlArray(uniqueValues(facets.problemPhenomena), 4)}\n` +
        `  contexts:\n    stages: ${yamlArray(stages, 6)}\n    audiences: ${yamlArray(audiences, 6)}\n` +
        `  tools_models_data: ${yamlArray(uniqueValues(facets.toolModelData), 4)}\n` +
        `  additional_tags: ${yamlArray(additionalTags(card), 4)}\n\n` +
        `aliases: ${yamlArray(uniqueValues(card.aliases), 2)}\n` +
        `expected_queries: ${yamlArray(uniqueValues(card.searchMetadata?.expectedQueries), 2)}\n` +
        `${searchReuseFrontMatter}` +
        `source_ids: ${yamlArray(uniqueValues(card.sourceIds), 2)}\n` +
        `${sourceLinkDecisionFrontMatter}` +
        `source_links: ${yamlObjectArray(links, ["label", "link_type", "url", "source_system", "source_version", "last_checked_at", "status"], 2)}\n` +
        `relations: ${yamlObjectArray(relations, ["type", "target_asset_id", "target_version", "note", "evidence_url", "status", "ended_at", "ended_reason"], 2)}\n` +
        `verification:\n  external_ai_abstracted: ${card.aiAssistance?.externalStructured === true}\n  internal_ai_prechecked: false\n` +
        `${contentCompletion}---`;
    const details = card.type === "VD Request"
        ? vdRequestWikiMarkdown(card)
        : card.type === "CoR"
            ? corWikiMarkdown(card)
            : [
                ...(CARD_CONTENT_HEADINGS[card.type] ?? [])
                    .map(([heading, keys]) => `## ${heading}\n\n${sectionMarkdown(card, keys)}`),
                `## 사내 근거와 관련 자산\n\n${internalLinksMarkdown(card)}`
            ].join("\n\n");
    return `${frontMatter}\n\n${details}${methodologyInternalDecisionMarkdown(card)}\n\n## 검토 메모\n\nPeer 확인 전입니다. 지정된 Reviewer가 적용범위·한계와 근거를 확인한 뒤 Front Matter의 상태를 갱신합니다.\n`;
}

export function gitLabWikiPageToCard(page = {}) {
    const content = textValue(page.content);
    const start = content.indexOf(CARD_MARKER_START);
    if (start < 0) return null;
    const jsonStart = start + CARD_MARKER_START.length;
    const end = content.indexOf(CARD_MARKER_END, jsonStart);
    if (end < 0) return null;
    try {
        const card = JSON.parse(content.slice(jsonStart, end).trim());
        return card && typeof card === "object" && !Array.isArray(card) ? card : null;
    } catch {
        return null;
    }
}

async function readApiMessage(response) {
    try {
        const body = await response.json();
        if (typeof body?.message === "string") return body.message;
        if (body?.message && typeof body.message === "object") return Object.values(body.message).flat().join(" ");
        if (typeof body?.error === "string") return body.error;
    } catch {
        return response.statusText || "응답 내용을 확인할 수 없습니다.";
    }
    return response.statusText || "요청이 거부되었습니다.";
}

export async function loadGitLabCurrentUser(config = {}, fetchImpl = globalThis.fetch) {
    const normalized = normalizeGitLabRegistrationConfig(config);
    const errors = [];
    if (!normalized.baseUrl) errors.push("GitLab 서버 주소를 입력하세요.");
    if (!normalized.token) errors.push("현재 사용자 GitLab Access Token을 입력하세요.");
    if (errors.length) throw new Error(errors.join(" "));
    if (typeof fetchImpl !== "function") throw new Error("GitLab 현재 사용자 확인 요청을 실행할 수 없습니다.");

    const response = await fetchImpl(buildGitLabCurrentUserApiUrl(normalized), {
        method: "GET",
        headers: { "PRIVATE-TOKEN": normalized.token }
    });
    if (!response.ok) {
        const message = await readApiMessage(response);
        if (response.status === 401 || response.status === 403) {
            throw new Error("현재 사용자의 GitLab 인증 또는 접근 권한을 확인하세요.");
        }
        throw new Error(`GitLab 현재 사용자 확인 실패 (${response.status}): ${message}`);
    }

    const user = await response.json().catch(() => ({}));
    const username = textValue(user.username);
    if (!username) throw new Error("GitLab 응답에서 현재 사용자 Username을 확인할 수 없습니다.");
    if (textValue(user.state) && textValue(user.state) !== "active") {
        throw new Error("활성 상태의 GitLab 사용자만 기술자산을 등록할 수 있습니다.");
    }
    return {
        id: user.id ?? null,
        username,
        name: textValue(user.name),
        actor: `@${username}`
    };
}

function discussionTitle(card = {}) {
    return `[Wiki 자산 논의] ${textValue(card.id)} · ${textValue(card.title)}`;
}

function discussionDescription(card = {}, config = {}) {
    const wikiUrl = buildGitLabWikiWebUrl(card.id, config);
    return `기술자산 Wiki 문서의 질문·적용 경험·개선 의견을 기록하는 Thread입니다.\n\n` +
        `- 자산 ID: \`${textValue(card.id)}\`\n` +
        `- 자산명: ${textValue(card.title)}\n` +
        `${wikiUrl ? `- Wiki 문서: ${wikiUrl}\n` : ""}` +
        `\n이 Issue의 Note 작성자와 작성일은 GitLab이 자동으로 기록합니다.`;
}

async function gitLabApiRequest(url, options, fetchImpl) {
    const response = await fetchImpl(url, options);
    if (!response.ok) {
        const message = await readApiMessage(response);
        if (response.status === 401 || response.status === 403) {
            throw new Error("GitLab 인증 또는 Issue 작성 권한을 확인하세요.");
        }
        throw new Error(`GitLab Issue 요청 실패 (${response.status}): ${message}`);
    }
    return response.json().catch(() => ({}));
}

export async function findGitLabAssetDiscussion(card, config = {}, fetchImpl = globalThis.fetch) {
    const normalized = normalizeGitLabRegistrationConfig(config);
    const configErrors = validateGitLabRegistrationConfig(normalized);
    if (configErrors.length) throw new Error(configErrors.join(" "));
    if (typeof fetchImpl !== "function") throw new Error("GitLab Issue 요청을 실행할 수 없습니다.");

    const issuesUrl = buildGitLabIssuesApiUrl(normalized);
    const query = new URLSearchParams({ scope: "all", state: "opened", search: textValue(card.id), in: "title", per_page: "100" });
    const issues = await gitLabApiRequest(`${issuesUrl}?${query}`, {
        method: "GET",
        headers: { "PRIVATE-TOKEN": normalized.token }
    }, fetchImpl);
    return (Array.isArray(issues) ? issues : []).find((issue) => textValue(issue.title) === discussionTitle(card)) || null;
}

export async function ensureGitLabAssetDiscussion(card, config = {}, fetchImpl = globalThis.fetch) {
    const normalized = normalizeGitLabRegistrationConfig(config);
    const exact = await findGitLabAssetDiscussion(card, normalized, fetchImpl);
    if (exact) return exact;

    return gitLabApiRequest(buildGitLabIssuesApiUrl(normalized), {
        method: "POST",
        headers: { "Content-Type": "application/json", "PRIVATE-TOKEN": normalized.token },
        body: JSON.stringify({ title: discussionTitle(card), description: discussionDescription(card, normalized) })
    }, fetchImpl);
}

export async function loadGitLabAssetDiscussionComments(card, config = {}, fetchImpl = globalThis.fetch) {
    const normalized = normalizeGitLabRegistrationConfig(config);
    const issue = await findGitLabAssetDiscussion(card, normalized, fetchImpl);
    if (!issue) return { issueIid: null, issueUrl: "", comments: [] };
    const notes = await gitLabApiRequest(`${buildGitLabIssuesApiUrl(normalized)}/${encodeURIComponent(issue.iid)}/notes?sort=asc&order_by=created_at&per_page=100`, {
        method: "GET",
        headers: { "PRIVATE-TOKEN": normalized.token }
    }, fetchImpl);
    return {
        issueIid: issue.iid,
        issueUrl: issue.web_url || "",
        comments: (Array.isArray(notes) ? notes : []).filter((note) => note.system !== true).map((note) => ({
            id: note.id,
            author: textValue(note.author?.name || note.author?.username) || "GitLab 사용자",
            message: textValue(note.body),
            createdAt: textValue(note.created_at)
        }))
    };
}

export async function addGitLabAssetDiscussionComment(card, message, config = {}, fetchImpl = globalThis.fetch) {
    const normalized = normalizeGitLabRegistrationConfig(config);
    const issue = await ensureGitLabAssetDiscussion(card, normalized, fetchImpl);
    const note = await gitLabApiRequest(`${buildGitLabIssuesApiUrl(normalized)}/${encodeURIComponent(issue.iid)}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "PRIVATE-TOKEN": normalized.token },
        body: JSON.stringify({ body: textValue(message) })
    }, fetchImpl);
    return {
        issueIid: issue.iid,
        issueUrl: issue.web_url || "",
        id: note.id,
        author: textValue(note.author?.name || note.author?.username) || "GitLab 사용자",
        message: textValue(note.body) || textValue(message),
        createdAt: textValue(note.created_at) || new Date().toISOString()
    };
}

export async function registerCardInGitLabWiki(card, config = {}, fetchImpl = globalThis.fetch) {
    const normalized = normalizeGitLabRegistrationConfig(config);
    const configErrors = validateGitLabRegistrationConfig(normalized);
    if (configErrors.length) throw new Error(configErrors.join(" "));
    if (typeof fetchImpl !== "function") throw new Error("GitLab Wiki 등록 요청을 실행할 수 없습니다.");
    const typeConfig = ASSET_TYPE_CONFIG[card.type];
    if (!typeConfig) throw new Error(`지원하지 않는 자산유형입니다: ${card.type}`);

    const registrationId = textValue(card.registrationId);
    let existingPages = await loadGitLabWikiPages(normalized, fetchImpl, { withContent: Boolean(registrationId) });
    const existingRegistration = findWikiPageByRegistrationId(existingPages, registrationId);
    if (existingRegistration) return existingRegistrationResult(existingRegistration, card, normalized, typeConfig);

    for (let attempt = 1; attempt <= 3; attempt += 1) {
        const existingValues = existingPages.flatMap((item) => [textValue(item?.slug), textValue(item?.title)]).filter(Boolean);
        const assetId = nextAssetId(card.type, existingValues);
        const issuedCard = { ...card, id: assetId };
        const wikiPath = `assets/${typeConfig.path}/${assetId}`;
        const response = await fetchImpl(buildGitLabWikiApiUrl(normalized), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "PRIVATE-TOKEN": normalized.token
            },
            body: JSON.stringify({
                title: wikiPath,
                content: cardToGitLabWikiMarkdown(issuedCard),
                format: "markdown"
            })
        });

        if (response.ok) {
            const result = await response.json().catch(() => ({}));
            const slug = result.slug || wikiPath;
            return {
                ...result,
                assetId,
                issuedCard,
                slug,
                wikiUrl: buildGitLabWikiWebUrl(slug, normalized),
                projectId: normalized.projectId,
                idempotentReplay: false,
                searchIndexStatus: "pending_index_build"
            };
        }

        const message = await readApiMessage(response);
        const collision = response.status === 400 && /(already exists|has already been taken)/i.test(message);
        if (collision && attempt < 3) {
            existingPages = await loadGitLabWikiPages(normalized, fetchImpl, { withContent: Boolean(registrationId) });
            const concurrentRegistration = findWikiPageByRegistrationId(existingPages, registrationId);
            if (concurrentRegistration) return existingRegistrationResult(concurrentRegistration, card, normalized, typeConfig);
            continue;
        }
        if (collision) throw new Error("동시에 같은 자산 ID가 발급되어 3회 충돌했습니다. Wiki 목록을 새로고침한 뒤 다시 등록하세요.");
        if (response.status === 401 || response.status === 403) {
            throw new Error("GitLab 인증 또는 Wiki 작성 권한을 확인하세요. 토큰은 현재 사용자에게 허용된 범위만 사용합니다.");
        }
        throw new Error(`GitLab Wiki 등록 실패 (${response.status}): ${message}`);
    }
    throw new Error("GitLab Wiki 등록을 완료하지 못했습니다.");
}
