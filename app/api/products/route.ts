import connect from "@/lib/data";
import { NextResponse } from "next/server";
import Products from "@/models/products";
import jwt from "jsonwebtoken";

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

export async function GET(request: Request) {
    await connect();
    if (!connect) {
        return NextResponse.json({ message: "Database connection error" }, { status: 500 });
    }
    const token = request.headers.get('token')
    if (!token) {
      return NextResponse.json(
        { error: 'Missing token' },
        { status: 401 }
      );
    }
    let decodedToken;
    try {
      decodedToken = jwt.decode(token);
      if (!decodedToken) {
        throw new Error('Failed to decode token');
      }
      const storeIdConfig = (decodedToken as jwt.JwtPayload).storeId;
      try {
        await connect();
        
        const products = await Products.find({ storeId: storeIdConfig}); // Filter products by storeId
        console.log(products);
        
        return NextResponse.json({ products }, { status: 200 });
      } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json({ message: "Error fetching products" }, { status: 500 });
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
}