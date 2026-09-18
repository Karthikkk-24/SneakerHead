import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/auth-cookies";
import { loginRequest } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email: string; password: string };
    const result = await loginRequest(body);
    await setAuthCookies(result.tokens.accessToken, result.tokens.refreshToken);
    return NextResponse.json({ user: result.user });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Login failed" },
      { status: 401 },
    );
  }
}
