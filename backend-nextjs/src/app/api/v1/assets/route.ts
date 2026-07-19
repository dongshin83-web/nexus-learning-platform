import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { requireUser } from "@/lib/authz";
import { listPublishedAssets } from "@/lib/technicalAssets";

export async function GET() {
  try {
    await requireUser("registrant", "reviewer");
    return NextResponse.json(await listPublishedAssets());
  } catch (error) {
    return apiError(error);
  }
}
