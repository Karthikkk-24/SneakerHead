import { UserRole } from "@sneakerhead/types";
import { NextRequest, NextResponse } from "next/server";
import { loginRequest } from "@/lib/api";
import { setAuthCookies } from "@/lib/auth-cookies";

const ADMIN_ROLES: UserRole[] = [UserRole.ADMIN, UserRole.SUPER_ADMIN];

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { email: string; password: string };
    const result = await loginRequest(body);

    if (!ADMIN_ROLES.includes(result.user.role)) {
      return NextResponse.json(
        { message: "Admin access required" },
        { status: 403 },
      );
    }

    await setAuthCookies(result.tokens.accessToken, result.tokens.refreshToken);
    return NextResponse.json({ user: result.user });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Login failed" },
      { status: 401 },
    );
  }
}
