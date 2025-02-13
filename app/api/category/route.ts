import connect from "@/lib/data";
import Category from "@/models/category";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
export async function GET(req: NextRequest) {
  try {
    await connect();
    console.log("Connected to MongoDB");
    if (!connect) {
      return NextResponse.json({ error: "Failed to connect to database" });
    }
    console.log(req);

    const token = req.headers.get("Authorization");
    if (!token) {
      return NextResponse.json({ error: "Token not provided" }, { status: 401 });
    }
    const secret = process.env.JWT_SECRET;
    const decodedToken = jwt.verify(token, secret || "sdsdsdsd") as JwtPayload;
    const storeId = decodedToken.storeId

    if (!storeId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const categories = await Category.find({ storeId: storeId }).populate("children");

    return NextResponse.json(categories);
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Error fetching categories" },
      { status: 500 }
    );
  }
}