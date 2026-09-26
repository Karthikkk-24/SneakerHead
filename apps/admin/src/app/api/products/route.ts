import { NextRequest, NextResponse } from "next/server";
import { createProduct, listAdminProducts } from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";

export async function GET(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = request.nextUrl;
    const result = await listAdminProducts(accessToken, {
      page: Number(searchParams.get("page") ?? "1"),
      search: searchParams.get("search") ?? undefined,
      status: searchParams.get("status") ?? undefined,
      categoryId: searchParams.get("categoryId") ?? undefined,
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed" },
      { status: 400 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    return NextResponse.json(await createProduct(accessToken, body));
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed" },
      { status: 400 },
    );
  }
}
