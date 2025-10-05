import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import users from "@/models/users";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get("storeId");

    if (!storeId) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    await connect();

    const user = await users.findOne({ storeId });

    if (!user) {
      return NextResponse.json({ valid: false }, { status: 404 });
    }

    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json({ valid: false }, { status: 500 });
  }
}
