import { NextResponse, NextRequest } from "next/server";
import connect from "@/lib/data";
import Files from "../../../models/uploads";

export async function GET(request: NextRequest) {
  await connect();
  if (!connect) {
    return NextResponse.json(
      { message: "Database connection error" },
      { status: 500 }
    );
  }
  try {
    const files = await Files.find({ });
    return NextResponse.json(files, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
