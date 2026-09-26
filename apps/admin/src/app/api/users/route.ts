import { NextRequest, NextResponse } from "next/server";
import { listUsers } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";
import { UserRole, UserStatus } from "@sneakerhead/types";

export async function GET(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = request.nextUrl;
    const role = searchParams.get("role") ?? "";
    const status = searchParams.get("status") ?? "";

    const result = await listUsers(accessToken, {
      page: Number(searchParams.get("page") ?? "1"),
      limit: Number(searchParams.get("limit") ?? "20"),
      search: searchParams.get("search") ?? undefined,
      role: Object.values(UserRole).includes(role as UserRole)
        ? (role as UserRole)
        : "",
      status: Object.values(UserStatus).includes(status as UserStatus)
        ? (status as UserStatus)
        : "",
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to list users" },
      { status: 400 },
    );
  }
}
