import { NextRequest, NextResponse } from "next/server";
import { bulkUpdateProductStatus } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";

export async function PATCH(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    return NextResponse.json(await bulkUpdateProductStatus(accessToken, body));
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed" },
      { status: 400 },
    );
  }
}
