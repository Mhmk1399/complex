import connect from "@/lib/data";
import { NextResponse } from "next/server";
import Products from "@/models/products";
import { GET as GetStoreId } from "../test/route";

export async function GET() {
  await connect();
  if (!connect) {
    return NextResponse.json(
      { message: "Database connection error" },
      { status: 500 }
    );
  }

  try {
    // Call GetStoreId as a normal async function.
    const storeIdResult = await GetStoreId();

    // If GetStoreId returns a Response (indicating an error) handle it:
    if (storeIdResult instanceof Response) {
      return storeIdResult;
    }

    const storeId = storeIdResult;
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
