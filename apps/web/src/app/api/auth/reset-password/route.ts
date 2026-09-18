import { NextRequest, NextResponse } from "next/server";
import { resetPasswordRequest } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { token: string; password: string };
    const result = await resetPasswordRequest(body.token, body.password);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Reset failed" },
      { status: 400 },
    );
  }
}
