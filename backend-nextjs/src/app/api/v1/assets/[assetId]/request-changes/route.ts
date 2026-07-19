import { NextResponse } from "next/server";
import { apiError, readJson } from "@/lib/api";
import { requireUser } from "@/lib/authz";
import { requestAssetChanges } from "@/lib/technicalAssets";

export async function POST(request: Request, context: { params: Promise<{ assetId: string }> }) {
  try {
    const user = await requireUser("reviewer");
    const { assetId } = await context.params;
    const body = await readJson(request) as { comment?: string };
    return NextResponse.json(await requestAssetChanges(assetId, String(body.comment ?? ""), user));
  } catch (error) {
    return apiError(error);
  }
}
