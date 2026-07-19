import { AssetWorkflowStatus, Prisma, PublicationStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ApiError } from "@/lib/api";
import type { TechnicalAssetUser } from "@/lib/authz";
import { objectArray, validateAsset, validateCulture } from "@/lib/validation";

const workflowLabel: Record<AssetWorkflowStatus, string> = {
  DRAFT: "초안",
  REVIEW_REQUESTED: "검토 요청",
  CHANGES_REQUESTED: "수정 필요",
  PUBLISHED: "게시",
};

const publicationLabel: Record<PublicationStatus, string> = { DRAFT: "초안", PUBLISHED: "게시" };

function assetInclude() {
  return { links: true, relations: true, frameworkLinks: true } as const;
}

function serializeAsset(asset: Awaited<ReturnType<typeof findAsset>>) {
  const payload = asset.payload as Record<string, unknown>;
  return {
    ...payload,
    id: asset.assetId,
    type: asset.assetType,
    title: asset.title,
    summary: asset.summary,
    workflowStatus: workflowLabel[asset.workflowStatus],
    publicationStatus: publicationLabel[asset.publicationStatus],
    registrant: asset.registrantId,
    reviewer: asset.reviewerId ?? "",
    version: asset.version,
    createdAt: asset.createdAt.toISOString().slice(0, 10),
    updatedAt: asset.updatedAt.toISOString().slice(0, 10),
    links: asset.links.map((link) => ({ label: link.label, href: link.href, type: link.linkType, role: link.linkRole, sourceSystem: link.sourceSystem, accessScope: link.accessScope, status: link.status, verifiedAt: link.verifiedAt?.toISOString().slice(0, 10) ?? "" })),
    relations: asset.relations.map((relation) => ({ type: relation.relationType, targetId: relation.targetAssetId, note: relation.note, source: relation.source })),
    frameworkLinks: asset.frameworkLinks.map((link) => ({ framework: link.framework, targetId: link.targetId, relationType: link.relationType, note: link.note, confirmed: link.confirmed, source: link.source })),
  };
}

async function findAsset(assetId: string) {
  const asset = await prisma.technicalAsset.findUnique({ where: { assetId }, include: assetInclude() });
  if (!asset) throw new ApiError(404, "자산을 찾을 수 없습니다.");
  return asset;
}

function childData(card: Record<string, unknown>) {
  return {
    links: objectArray(card.links).map((link) => ({
      label: String(link.label ?? ""), href: String(link.href ?? ""), linkType: String(link.type ?? link.assetType ?? "원본"),
      linkRole: String(link.role ?? "") || null, sourceSystem: String(link.sourceSystem ?? "") || null,
      accessScope: String(link.accessScope ?? "") || null, status: String(link.status ?? "") || null,
      verifiedAt: link.verifiedAt ? new Date(String(link.verifiedAt)) : null,
    })),
    relations: objectArray(card.relations).map((relation) => ({
      relationType: String(relation.type ?? "REFERENCES"), targetAssetId: String(relation.targetId ?? ""),
      note: String(relation.note ?? "") || null, source: String(relation.source ?? "") || null,
    })).filter((relation) => relation.targetAssetId),
    frameworkLinks: objectArray(card.frameworkLinks).map((link) => ({
      framework: String(link.framework ?? ""), targetId: String(link.targetId ?? ""), relationType: String(link.relationType ?? "RELATED"),
      note: String(link.note ?? "") || null, confirmed: link.confirmed === true, source: String(link.source ?? "") || null,
    })).filter((link) => link.framework && link.targetId),
  };
}

export async function registerAsset(value: unknown, user: TechnicalAssetUser) {
  const card = validateAsset(value);
  const children = childData(card);
  const created = await prisma.$transaction(async (tx) => {
    const asset = await tx.technicalAsset.create({
      data: {
        assetId: String(card.id), assetType: String(card.type), title: String(card.title), summary: String(card.summary),
        payload: card as Prisma.InputJsonValue, workflowStatus: "REVIEW_REQUESTED", publicationStatus: "DRAFT", registrantId: user.id,
        links: { create: children.links }, relations: { create: children.relations }, frameworkLinks: { create: children.frameworkLinks },
        reviews: { create: { action: "submitted", comment: "등록과 동시에 Reviewer 검토 요청", actorId: user.id } },
        auditEvents: { create: { action: "registered", actorId: user.id, detail: { source: "registration-ui" } } },
      },
      include: assetInclude(),
    });
    return asset;
  });
  return serializeAsset(created);
}

export async function listPublishedAssets() {
  const assets = await prisma.technicalAsset.findMany({ where: { publicationStatus: "PUBLISHED" }, orderBy: { updatedAt: "desc" }, include: assetInclude() });
  return assets.map(serializeAsset);
}

export async function listReviewQueue() {
  const assets = await prisma.technicalAsset.findMany({ where: { workflowStatus: "REVIEW_REQUESTED" }, orderBy: { updatedAt: "asc" }, include: assetInclude() });
  return assets.map(serializeAsset);
}

export async function publishAsset(assetId: string, user: TechnicalAssetUser) {
  const current = await findAsset(assetId);
  if (current.workflowStatus !== "REVIEW_REQUESTED") throw new ApiError(409, "검토 요청 상태의 자산만 게시할 수 있습니다.");
  const updated = await prisma.technicalAsset.update({
    where: { assetId },
    data: {
      workflowStatus: "PUBLISHED", publicationStatus: "PUBLISHED", reviewerId: user.id, publishedAt: new Date(), version: { increment: 1 },
      reviews: { create: { action: "published", comment: "Reviewer 승인 및 게시", actorId: user.id } },
      auditEvents: { create: { action: "published", actorId: user.id } },
    }, include: assetInclude(),
  });
  return serializeAsset(updated);
}

export async function requestAssetChanges(assetId: string, comment: string, user: TechnicalAssetUser) {
  if (!comment.trim()) throw new ApiError(422, "수정 요청 사유를 입력하세요.");
  const current = await findAsset(assetId);
  if (current.workflowStatus !== "REVIEW_REQUESTED") throw new ApiError(409, "검토 요청 상태의 자산만 수정 요청할 수 있습니다.");
  const updated = await prisma.technicalAsset.update({
    where: { assetId },
    data: {
      workflowStatus: "CHANGES_REQUESTED", publicationStatus: "DRAFT", reviewerId: user.id, version: { increment: 1 },
      reviews: { create: { action: "changes_requested", comment, actorId: user.id } },
      auditEvents: { create: { action: "changes_requested", actorId: user.id, detail: { comment } } },
    }, include: assetInclude(),
  });
  return serializeAsset(updated);
}

function serializeCulture(record: Awaited<ReturnType<typeof findCulture>>) {
  const payload = record.payload as Record<string, unknown>;
  return { ...payload, id: record.recordId, type: record.recordType, title: record.title, series: record.series ?? "", summary: record.summary, date: record.recordDate ?? "", tags: record.tags, status: record.status, images: record.media.map((item) => ({ src: item.src, alt: item.alt })), links: record.links.map((item) => ({ label: item.label, href: item.href, kind: item.kind })) };
}

async function findCulture(recordId: string) {
  const record = await prisma.cultureRecord.findUnique({ where: { recordId }, include: { media: { orderBy: { sortOrder: "asc" } }, links: true } });
  if (!record) throw new ApiError(404, "Culture 기록을 찾을 수 없습니다.");
  return record;
}

export async function listCultureRecords() {
  const records = await prisma.cultureRecord.findMany({ orderBy: { updatedAt: "desc" }, include: { media: { orderBy: { sortOrder: "asc" } }, links: true } });
  return records.map(serializeCulture);
}

export async function createCultureRecord(value: unknown, user: TechnicalAssetUser) {
  const record = validateCulture(value);
  const images = objectArray(record.images);
  const links = objectArray(record.links);
  const created = await prisma.cultureRecord.create({
    data: {
      recordId: String(record.id), recordType: String(record.type), title: String(record.title), series: String(record.series ?? "") || null,
      summary: String(record.summary), recordDate: String(record.date ?? "") || null, tags: Array.isArray(record.tags) ? record.tags.map(String) : [],
      status: "초안", registrantId: user.id, payload: record as Prisma.InputJsonValue,
      media: { create: images.map((image, sortOrder) => ({ src: String(image.src), alt: String(image.alt), sortOrder })) },
      links: { create: links.map((link) => ({ label: String(link.label), href: String(link.href), kind: String(link.kind) })) },
    }, include: { media: { orderBy: { sortOrder: "asc" } }, links: true },
  });
  return serializeCulture(created);
}

export async function updateCultureRecord(recordId: string, value: unknown, user: TechnicalAssetUser) {
  const current = await findCulture(recordId);
  if (current.registrantId !== user.id && !user.roles.includes("reviewer") && !user.roles.includes("admin")) {
    throw new ApiError(403, "등록자 또는 Reviewer만 Culture 기록을 수정할 수 있습니다.");
  }
  const record = validateCulture({ ...(current.payload as Record<string, unknown>), ...asRecord(value), id: recordId });
  const images = objectArray(record.images);
  const links = objectArray(record.links);
  const updated = await prisma.$transaction(async (tx) => {
    await tx.cultureMedia.deleteMany({ where: { recordDbId: current.id } });
    await tx.cultureLink.deleteMany({ where: { recordDbId: current.id } });
    return tx.cultureRecord.update({
      where: { recordId },
      data: {
        recordType: String(record.type), title: String(record.title), series: String(record.series ?? "") || null,
        summary: String(record.summary), recordDate: String(record.date ?? "") || null, tags: Array.isArray(record.tags) ? record.tags.map(String) : [],
        payload: record as Prisma.InputJsonValue,
        media: { create: images.map((image, sortOrder) => ({ src: String(image.src), alt: String(image.alt), sortOrder })) },
        links: { create: links.map((link) => ({ label: String(link.label), href: String(link.href), kind: String(link.kind) })) },
      }, include: { media: { orderBy: { sortOrder: "asc" } }, links: true },
    });
  });
  return serializeCulture(updated);
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}
