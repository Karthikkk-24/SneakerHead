import { NextRequest, NextResponse } from "next/server";
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory,
} from "@/lib/api";
import { getAccessToken } from "@/lib/auth-cookies";

export async function GET() {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(await listCategories(accessToken));
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
    return NextResponse.json(await createCategory(accessToken, body));
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed" },
      { status: 400 },
    );
  }
}
