import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(public status: number, message: string, public errors: string[] = []) {
    super(message);
  }
}

export function apiError(error: unknown) {
  if (error instanceof ApiError) {
    return NextResponse.json({ message: error.message, errors: error.errors }, { status: error.status });
  }
  console.error(error);
  return NextResponse.json({ message: "서버 오류가 발생했습니다.", errors: [] }, { status: 500 });
}

export async function readJson(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 2_000_000) throw new ApiError(413, "요청 데이터가 허용 크기를 초과했습니다.");
  try {
    return await request.json();
  } catch {
    throw new ApiError(400, "올바른 JSON 요청이 아닙니다.");
  }
}
