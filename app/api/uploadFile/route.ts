import { NextResponse } from "next/server";
import connect from "@/lib/data";
import Files from "../../../models/uploads";

export async function GET() {
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
    console.log("Error fetching files:", error);
    
    return NextResponse.json({ message: "Invalid token",error }, { status: 401 });
  }
}
