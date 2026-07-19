import { ApiError } from "@/lib/api";

type JsonObject = Record<string, unknown>;

export function asObject(value: unknown): JsonObject {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ApiError(422, "등록 데이터는 JSON 객체여야 합니다.");
  return value as JsonObject;
}

export function objectArray(value: unknown): JsonObject[] {
  return Array.isArray(value) ? value.filter((item): item is JsonObject => Boolean(item) && typeof item === "object" && !Array.isArray(item)) : [];
}

export function validateAsset(value: unknown) {
  const card = asObject(value);
  const errors: string[] = [];
  for (const [key, label] of [["id", "자산 ID"], ["type", "Asset type"], ["title", "제목"], ["summary", "요약"]] as const) {
    if (!String(card[key] ?? "").trim()) errors.push(`${label}이 필요합니다.`);
  }
  if (String(card.id ?? "") && !/^[A-Za-z0-9][A-Za-z0-9._-]*$/.test(String(card.id))) errors.push("자산 ID에는 영문, 숫자, 점, 밑줄, 하이픈만 사용할 수 있습니다.");
  objectArray(card.links).forEach((link) => {
    if (!String(link.label ?? "").trim() || !String(link.href ?? "").trim()) errors.push("모든 회사 내부 자산 링크에는 이름과 URL이 필요합니다.");
    if (String(link.href ?? "") && !/^https:\/\//i.test(String(link.href))) errors.push("회사 내부 자산 링크는 https:// 주소여야 합니다.");
  });
  if (errors.length) throw new ApiError(422, "등록 데이터 검증에 실패했습니다.", errors);
  return card;
}

export function validateCulture(value: unknown) {
  const record = asObject(value);
  const errors: string[] = [];
  for (const [key, label] of [["id", "기록 ID"], ["type", "기록 유형"], ["title", "제목"], ["summary", "요약"]] as const) {
    if (!String(record[key] ?? "").trim()) errors.push(`${label}이 필요합니다.`);
  }
  const images = objectArray(record.images);
  const links = objectArray(record.links);
  if (!images.length && !links.length) errors.push("이미지 또는 연결 자료가 하나 이상 필요합니다.");
  images.forEach((image) => { if (!String(image.src ?? "").trim() || !String(image.alt ?? "").trim()) errors.push("모든 이미지에는 경로와 대체 설명이 필요합니다."); });
  links.forEach((link) => { if (!String(link.label ?? "").trim() || !String(link.href ?? "").trim() || !String(link.kind ?? "").trim()) errors.push("모든 연결 자료에는 이름, URL과 자료 구분이 필요합니다."); });
  if (errors.length) throw new ApiError(422, "Culture 기록 검증에 실패했습니다.", errors);
  return record;
}
