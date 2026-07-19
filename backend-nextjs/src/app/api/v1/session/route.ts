import { NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { requireUser } from "@/lib/authz";

export async function GET() {
  try {
    return NextResponse.json({ user: await requireUser("registrant", "reviewer") });
  } catch (error) {
    return apiError(error);
  }
}
