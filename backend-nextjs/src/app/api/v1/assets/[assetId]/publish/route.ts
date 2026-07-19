import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { requireUser } from "@/lib/authz";
import { publishAsset } from "@/lib/technicalAssets";

export async function POST(_: Request, context: { params: Promise<{ assetId: string }> }) {
  try {
    const user = await requireUser("reviewer");
    const { assetId } = await context.params;
    return NextResponse.json(await publishAsset(assetId, user));
  } catch (error) {
    return apiError(error);
  }
}
