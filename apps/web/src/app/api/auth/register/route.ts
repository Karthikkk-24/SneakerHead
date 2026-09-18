import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies } from "@/lib/auth-cookies";
import { registerRequest } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email: string;
      password: string;
      name: string;
      phone?: string;
    };
    const result = await registerRequest(body);
    await setAuthCookies(result.tokens.accessToken, result.tokens.refreshToken);
    return NextResponse.json({ user: result.user });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Registration failed" },
      { status: 400 },
    );
  }
}
