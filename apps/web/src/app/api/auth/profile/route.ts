import { NextRequest, NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth-cookies";
import { updateProfile } from "@/lib/api";
import { getSession } from "@/lib/session";

export async function PATCH(request: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
    };
    const token = await getAccessToken();
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = await updateProfile(token, body);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Update failed" },
      { status: 400 },
    );
  }
}
