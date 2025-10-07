import connect from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";
import collections from "@/models/collections";
import products from "@/models/products";
import category from "@/models/category";
import { ProductCardData } from "@/lib/types";

export async function GET(request: NextRequest) {
  // Establish database connection
  try {
    await connect();
  } catch (connectionError) {
    console.log("Database Connection Error:", connectionError);
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
    console.log("Authorization Header Missing");
    return NextResponse.json(
      { 
        error: "No authorization token provided", 
        details: "Authorization header is required" 
      }, 
      { status: 401 }
    );
  }

  // Extract token and validate
  const token = authHeader.startsWith('Bearer') 
    ? authHeader.split('')[1] 
    : authHeader;

  // Validate JWT secret
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.log("JWT Secret Not Configured");
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
    console.log("storeId Missing in Token");
    return NextResponse.json(
      { 
        error: "Invalid token structure", 
        details: "storeId is required" 
      }, 
      { status: 401 }
    );
  }

  // Fetch collections and populate products from Products collection
  try {
    const collectionsData = await collections.find({ storeId });
    
    if (!collectionsData || collectionsData.length === 0) {
      return NextResponse.json(
        { message: "No collections found" },
        { status: 404 }
      );
    }

    // For each collection, get the actual product data from Products collection
    const collectionsWithProducts = await Promise.all(
      collectionsData.map(async (collection) => {
        const productIds = collection.products.map((p: ProductCardData) => p._id).filter(Boolean);
        
        if (productIds.length > 0) {
          const actualProducts = await products.find({
            _id: { $in: productIds },
            storeId: storeId
          }).populate({
            path: "category",
            model: category
          });
          
          return {
            ...collection.toObject(),
            products: actualProducts
          };
        }
        
        return {
          ...collection.toObject(),
          products: []
        };
      })
    );

    return NextResponse.json(
      { product: collectionsWithProducts },
      { status: 200 }
    );
  } catch (fetchError) {
    console.log("Product Fetch Error:", {
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
