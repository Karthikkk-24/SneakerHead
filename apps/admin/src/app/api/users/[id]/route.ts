import { AdminUpdateUserPayload } from "@sneakerhead/types";
import { NextRequest, NextResponse } from "next/server";
import { forceLogoutUser, getUser, updateUser } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const user = await getUser(accessToken, id);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to load user" },
      { status: 400 },
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = (await request.json()) as AdminUpdateUserPayload;
    const user = await updateUser(accessToken, id, body);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Failed to update user",
      },
      { status: 400 },
    );
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = (await request.json()) as { action?: string };

    if (body.action !== "force-logout") {
      return NextResponse.json({ message: "Unsupported action" }, { status: 400 });
    }

    const result = await forceLogoutUser(accessToken, id);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          error instanceof Error ? error.message : "Failed to force logout",
      },
      { status: 400 },
    );
  }
}
