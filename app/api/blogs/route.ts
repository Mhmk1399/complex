import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
import Blog from "@/models/blogs";
import jwt, { JwtPayload } from "jsonwebtoken";

export const GET = async (request: NextRequest) => {
  await connect();
  if (!connect) {
    return NextResponse.json(
      { message: "Database connection error" },
      { status: 500 }
    );
  }

  try {
    const token = request.headers.get("Authorization");

    if (!token) {
      console.log("No token provided");
      return NextResponse.json({ error: "Token not provided" }, { status: 401 });
    }
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.log("JWT_SECRET is not defined");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }
    
    let decodedToken;
    try {
      const cleanToken = token.startsWith('Bearer ')
        ? token.split(' ')[1]
        : token;

      decodedToken = jwt.verify(cleanToken, secret) as JwtPayload;

      if (!decodedToken.storeId) {
        console.log("Token missing storeId");
        return NextResponse.json({ error: "Invalid token structure" }, { status: 401 });
      }

      const storeId = decodedToken.storeId;

      const blogs = await Blog.find({ storeId: storeId });
      console.log("blogs data", blogs);

      if (!blogs || blogs.length === 0) {
        return NextResponse.json(
          { message: "No blogs found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ blogs }, { status: 200 });

    } catch (verifyError) {
      if (verifyError instanceof Error) {
        console.log("Detailed Token Verification Error:", {
          name: verifyError.name,
          message: verifyError.message,
          stack: verifyError.stack
        });
        return NextResponse.json({
          error: "Invalid token",
          details: verifyError.message
        }, { status: 401 });
      } else {
        console.log("Unknown error during token verification");
        return NextResponse.json({
          error: "Invalid token",
          details: "Unknown error"
        }, { status: 401 });
      }
    }
  } catch (error) {
    console.log("Error fetching blogs:", error);
    return NextResponse.json(
      { message: "Error fetching blogs" },
      { status: 500 }
    );
  }
};
