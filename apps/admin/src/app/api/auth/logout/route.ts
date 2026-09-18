import { NextResponse } from "next/server";
import { clearAuthCookies, getRefreshToken } from "@/lib/auth-cookies";
import { logoutRequest } from "@/lib/api";

export async function POST() {
  const refreshToken = await getRefreshToken();
  if (refreshToken) {
    try {
      await logoutRequest(refreshToken);
    } catch {
      // Clear cookies even if API logout fails.
    }
  }
  await clearAuthCookies();
  return NextResponse.json({ message: "Logged out" });
}
