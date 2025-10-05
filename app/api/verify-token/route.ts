import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    // 1️⃣ Check token
    if (!token) {
      return NextResponse.json(
        { valid: false, message: "Token not provided" },
        { status: 400 }
      );
    }

    // 2️⃣ Check secret
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("❌ JWT_SECRET not found in environment variables");
      return NextResponse.json(
        { valid: false, message: "Server misconfiguration" },
        { status: 500 }
      );
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, jwtSecret);

    return NextResponse.json({
      valid: true,
      user: decoded,
      message: "Token verified successfully",
    });
  } catch {
    console.error("JWT verification failed:");
    return NextResponse.json(
      { valid: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
