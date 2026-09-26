import { NextRequest, NextResponse } from "next/server";
import { deleteProduct, getAdminProduct, updateProduct } from "@/lib/api";
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
    return NextResponse.json(await getAdminProduct(accessToken, id));
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed" },
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
    const body = await request.json();
    return NextResponse.json(await updateProduct(accessToken, id, body));
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed" },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await context.params;
    return NextResponse.json(await deleteProduct(accessToken, id));
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed" },
      { status: 400 },
    );
  }
}
