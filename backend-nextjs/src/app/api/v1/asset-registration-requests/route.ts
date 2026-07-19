import { NextResponse } from "next/server";
import { apiError, readJson } from "@/lib/api";
import { requireUser } from "@/lib/authz";
import { registerAsset } from "@/lib/technicalAssets";

export async function POST(request: Request) {
  try {
    const user = await requireUser("registrant");
    return NextResponse.json(await registerAsset(await readJson(request), user), { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
