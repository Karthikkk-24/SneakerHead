import { NextRequest, NextResponse } from "next/server";
import { forgotPasswordRequest } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email: string };
    const result = await forgotPasswordRequest(body.email);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Request failed" },
      { status: 400 },
    );
  }
}
