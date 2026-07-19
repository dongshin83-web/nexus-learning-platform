import { auth } from "@/auth";
import { ApiError } from "@/lib/api";

export type TechnicalAssetRole = "registrant" | "reviewer" | "admin";
export type TechnicalAssetUser = { id: string; displayName: string; email: string; roles: TechnicalAssetRole[] };

function emailSet(name: string) {
  return new Set(String(process.env[name] ?? "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean));
}

export async function requireUser(...required: TechnicalAssetRole[]): Promise<TechnicalAssetUser> {
  let email = "";
  let displayName = "";
  if (process.env.NODE_ENV !== "production" && process.env.TECH_ASSET_DEV_USER_EMAIL) {
    email = process.env.TECH_ASSET_DEV_USER_EMAIL.toLowerCase();
    displayName = "개발 등록자";
  } else {
    const session = await auth();
    email = String(session?.user?.email ?? "").toLowerCase();
    displayName = String(session?.user?.name ?? email);
  }
  if (!email) throw new ApiError(401, "로그인이 필요합니다.");
  const allowed = emailSet("TECH_ASSET_ALLOWED_EMAILS");
  if (allowed.size && !allowed.has(email)) throw new ApiError(403, "기술자산 사이트 사용 권한이 없습니다.");
  const roles: TechnicalAssetRole[] = ["registrant"];
  if (emailSet("TECH_ASSET_REVIEWER_EMAILS").has(email)) roles.push("reviewer");
  if (emailSet("TECH_ASSET_ADMIN_EMAILS").has(email)) roles.push("admin", "reviewer");
  if (required.length && !required.some((role) => roles.includes(role)) && !roles.includes("admin")) {
    throw new ApiError(403, "이 작업을 수행할 권한이 없습니다.");
  }
  return { id: email, displayName, email, roles: [...new Set(roles)] };
}
