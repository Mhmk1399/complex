import connect from "@/lib/data";
import { NextResponse } from "next/server";
import UserInfo from "@/models/userInfo";
import jwt from "jsonwebtoken";

export async function GET(request: Request) {
  try {
    await connect();

    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Token not provided" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & {
      storeId: string;
    };
    const storeId = decoded.storeId;
    console.log(storeId,'userinfo store id')
    const userInfo = await UserInfo.findOne({ storeId:storeId });

    if (!userInfo) {
      return NextResponse.json(
        { error: "User info not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(userInfo, { status: 200 });
  } catch (error: unknown) {
    console.error("Error fetching user info:", error);
    
    // Handle token expiration specifically
    if (error instanceof Error && error.name === "TokenExpiredError") {
      return NextResponse.json(
        { error: "Token expired", expired: true },
        { status: 401 }
      );
    }
    
    // Handle other JWT errors
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      return NextResponse.json(
        { error: "Invalid token", expired: true },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { message: "Error fetching user info" },
      { status: 500 }
    );
  }
}
