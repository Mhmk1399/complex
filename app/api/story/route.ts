import Story from "../../../models/story";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import jwt, { JwtPayload } from "jsonwebtoken";
export async function GET(request: NextRequest) {
  try {
    await connect();
    if (!connect) {
      return NextResponse.json({ error: "Failed to connect to database" });
    }

    const token = request.headers.get("Authorization");
    if (!token) {
      return NextResponse.json({ error: "Token not provided" }, { status: 401 });
    }
    const secret=process.env.JWT_SECRET;
    const decodedToken = jwt.verify(token, secret||"sdsdsdsd" ) as JwtPayload;
    const storeId = decodedToken.storeId;
    if (!storeId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const stories = await Story.find({ storeId: storeId });
    return NextResponse.json(stories);
  } catch (error) {
    console.log("Error fetching stories:", error);
    return NextResponse.json({ error: "Failed to fetch stories" });
  }
}

