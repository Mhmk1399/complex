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

    const userInfo = await UserInfo.findOne({ storeId });

    if (!userInfo) {
      return NextResponse.json(
        { error: "User info not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(userInfo, { status: 200 });
  } catch (error) {
    console.error("Error fetching user info:", error);
    return NextResponse.json(
      { message: "Error fetching user info" },
      { status: 500 }
    );
  }
}
