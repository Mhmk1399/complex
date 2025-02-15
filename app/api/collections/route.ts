import connect from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import collections from "@/models/collections";

export async function GET(request: NextRequest) {
  // Establish database connection
  try {
    await connect();
  } catch (connectionError) {
    console.error("Database Connection Error:", connectionError);
    return NextResponse.json(
      { 
        message: "Database connection failed", 
        error: connectionError instanceof Error ? connectionError.message : String(connectionError)
      }, 
      { status: 500 }
    );
  }

  // Retrieve and validate authorization token
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader) {
    console.error("Authorization Header Missing");
    return NextResponse.json(
      { 
        error: "No authorization token provided", 
        details: "Authorization header is required" 
      }, 
      { status: 401 }
    );
  }

  // Extract token and validate
  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : authHeader;

  // Validate JWT secret
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT Secret Not Configured");
    return NextResponse.json(
      { 
        error: "Server configuration error", 
        details: "JWT secret is not set" 
      }, 
      { status: 500 }
    );
  }

  // Verify token
  let decodedToken: JwtPayload;
  try {
    decodedToken = jwt.verify(token, secret) as JwtPayload;
  } catch (verificationError) {
    console.log("Token Verification Failed:", {
      name: (verificationError as Error).name,
      message: (verificationError as Error).message
    });

    return NextResponse.json(
      { 
        error: "Invalid token", 
        details: (verificationError as Error).message 
      }, 
      { status: 401 }
    );
  }

  // Validate storeId in token
  const storeId = decodedToken.storeId;
  if (!storeId) {
    console.error("StoreId Missing in Token");
    return NextResponse.json(
      { 
        error: "Invalid token structure", 
        details: "StoreId is required" 
      }, 
      { status: 401 }
    );
  }

  // Fetch products
  try {
    const products = await collections.find({ storeId }).populate("products");

    if (!products || products.length === 0) {
      console.warn(`No products found for storeId: ${storeId}`);
      return NextResponse.json(
        { 
          message: "No products found", 
          storeId: storeId 
        }, 
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        products, 
        count: products.length 
      }, 
      { status: 200 }
    );
  } catch (fetchError) {
    console.error("Product Fetch Error:", {
      storeId,
      error: fetchError instanceof Error ? fetchError.message : String(fetchError)
    });

    return NextResponse.json(
      { 
        message: "Error fetching products", 
        details: fetchError instanceof Error ? fetchError.message : String(fetchError)
      }, 
      { status: 500 }
    );
  }
}
