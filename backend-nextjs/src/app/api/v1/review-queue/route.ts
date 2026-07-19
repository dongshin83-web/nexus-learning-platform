import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { requireUser } from "@/lib/authz";
import { listReviewQueue } from "@/lib/technicalAssets";

export async function GET() {
  try {
    await requireUser("reviewer");
    return NextResponse.json(await listReviewQueue());
  } catch (error) {
    return apiError(error);
  }
}
