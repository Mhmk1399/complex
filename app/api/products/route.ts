import connect from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import Products from "@/models/products";
import { GetStoreId } from "@/utilities/getStoreId";
export async function GET(request: NextRequest) {
  await connect();
  if (!connect) {
    return NextResponse.json(
      { message: "Database connection error" },
      { status: 500 }
    );
  }

  try {
 
    const storeId = await GetStoreId(request);
    if (!storeId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const products = await Products.find().populate("category");

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
}
