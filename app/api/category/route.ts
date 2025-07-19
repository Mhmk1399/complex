import connect from "@/lib/data";
import Category from "@/models/category";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
export async function GET(req: NextRequest) {
  try {
    await connect();
    if (!connect) {
      return NextResponse.json({ error: "Failed to connect to database" });
    }

    const token = req.headers.get("Authorization");
  
    if (!token) {
      return NextResponse.json({ error: "Token not provided" }, { status: 401 });
    }
    const secret = process.env.JWT_SECRET;

    let storeId: string;

    try {
      const decodedToken = jwt.verify(token.replace('Bearer ', ''), secret || "");
      storeId = (decodedToken as JwtPayload).storeId;
    } catch (error) {
      console.error("Token Verification Error:", error);
      return NextResponse.json({ 
        error: "Invalid token", 
        details: (error as Error).message 
      }, { status: 401 });
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