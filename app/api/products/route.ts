import connect from "@/lib/data";
import { NextResponse } from "next/server";
import Products from "@/models/products";
import { GetStoreId } from "../test/route";

export async function POST(request: Request) {
    const productData = await request.json();

    try {
        await connect();
        const newProduct = new Products(productData);
        await newProduct.save();
        return NextResponse.json({ message: "Product created successfully", product: newProduct }, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json({ message: "Error creating product" }, { status: 500 });
    }
}

export async function GET() {
    await connect();
    if (!connect) {
        return NextResponse.json({ message: "Database connection error" }, { status: 500 });
    }
  
    try {
        const storeIdConfig =await GetStoreId()
        console.log(storeIdConfig);
        
        const products = await Products.find().populate('category');
        
        return NextResponse.json({ products }, { status: 200 });
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
    }
}