import { NextResponse } from "next/server";
import { apiError, readJson } from "@/lib/api";
import { requireUser } from "@/lib/authz";
import { updateCultureRecord } from "@/lib/technicalAssets";

export async function PATCH(request: Request, context: { params: Promise<{ recordId: string }> }) {
  try {
    const user = await requireUser("registrant", "reviewer");
    const { recordId } = await context.params;
    return NextResponse.json(await updateCultureRecord(recordId, await readJson(request), user));
  } catch (error) {
    return apiError(error);
  }
}
