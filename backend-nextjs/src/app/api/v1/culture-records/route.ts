import { NextResponse } from "next/server";
import { apiError, readJson } from "@/lib/api";
import { requireUser } from "@/lib/authz";
import { createCultureRecord, listCultureRecords } from "@/lib/technicalAssets";

export async function GET() {
  try {
    await requireUser("registrant", "reviewer");
    return NextResponse.json(await listCultureRecords());
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser("registrant");
    return NextResponse.json(await createCultureRecord(await readJson(request), user), { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
