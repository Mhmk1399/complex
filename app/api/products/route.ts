import connect from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import Products from "@/models/products";
import jwt, { JwtPayload } from "jsonwebtoken";
export async function GET(request: NextRequest) {
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
      console.error("No token provided");
      return NextResponse.json({ error: "Token not provided" }, { status: 401 });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is not defined");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }
    let decodedToken;
    try {
      // More robust token extraction
      const cleanToken = token.startsWith('Bearer ')
        ? token.split(' ')[1]
        : token;

      decodedToken = jwt.verify(cleanToken, secret) as JwtPayload;

      if (!decodedToken.storeId) {
        console.error("Token missing storeId");
        return NextResponse.json({ error: "Invalid token structure" }, { status: 401 });
      }

      const storeId = decodedToken.storeId;

      const products = await Products.find({ storeId: storeId }).populate("category");
      console.log("products data", products);

      if (!products || products.length === 0) {
        return NextResponse.json(
          { message: "No products found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ products }, { status: 200 });

    } catch (verifyError) {
      if (verifyError instanceof Error) {
        console.error("Detailed Token Verification Error:", {
          name: verifyError.name,
          message: verifyError.message,
          stack: verifyError.stack
        });
        return NextResponse.json({
          error: "Invalid token",
          details: verifyError.message
        }, { status: 401 });
      } else {
        console.error("Unknown error during token verification");
        return NextResponse.json({
          error: "Invalid token",
          details: "Unknown error"
        }, { status: 401 });
      }
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}
