import products from "@/models/products";
import connect from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";
import { CollectionSection, ProductCardData } from "@/lib/types";

  
  interface CollectionResponse {
    collection: CollectionSection;
    message?: string;
  }
  const logOperation = (
    operation: 'DELETE_ATTEMPT' | 'DELETE_SUCCESS' | 'DELETE_ERROR' | 'GET_ATTEMPT' | 'GET_SUCCESS' | 'GET_ERROR' | 'PATCH_ATTEMPT' | 'PATCH_SUCCESS' | 'PATCH_ERROR',
    productId: string,
    details?: ProductCardData | Error
  ) => {
      console.log(`[${new Date().toISOString()}] ${operation} - Product ID: ${productId}`);
      if (details) {
          console.log('Details:', JSON.stringify(details, null, 2));
      }
  }
  

export const DELETE = async ( { params }: { params: { id: string } }) => {
    const productId = params.id;
    logOperation('DELETE_ATTEMPT', productId);

    await connect();
    if(!connect) {
        logOperation('DELETE_ERROR', productId, new Error('Database connection failed'));
        return new NextResponse('Database connection error', { status: 500 });
    }

    if (!productId) {
        logOperation('DELETE_ERROR', productId, new Error('Missing product ID'));
        return new NextResponse('Product ID is required', { status: 400 });
    }

    try {
        await products.findByIdAndDelete(productId);
        logOperation('DELETE_SUCCESS', productId);
        return new NextResponse(JSON.stringify({ message: 'Product deleted successfully' }), { status: 200 });
    } catch (error) {
        logOperation('DELETE_ERROR', productId, error instanceof Error ? error : new Error('Unknown error'));
        return new NextResponse('Error deleting product', { status: 500 });
    }
}

export const GET = async (
    
    { params }: { params: { id: string } }
  ): Promise<NextResponse<CollectionResponse>> => {    const productId = params.id;
    logOperation('GET_ATTEMPT', productId);

    await connect();
    if(!connect) {
        logOperation('GET_ERROR', productId, new Error('Database connection failed'));
        return new NextResponse('Database connection error', { status: 500 });
    }

    if (!productId) {
        logOperation('GET_ERROR', productId, new Error('Missing product ID'));
        return new NextResponse('Product ID is required', { status: 400 });
    }

    try {
        const product = await products.findById(productId);
        if (!product) {
            logOperation('GET_ERROR', productId, new Error('Product not found'));
            return new NextResponse('Product not found', { status: 404 });
        }
        logOperation('GET_SUCCESS', productId, product);
        return new NextResponse(JSON.stringify(product), { status: 200 });
    } catch (error) {
        logOperation('GET_ERROR', productId, error instanceof Error ? error : new Error('Unknown error'));
        return new NextResponse('Error fetching product', { status: 500 });
    }
}   

export const PATCH = async (
    req: NextRequest, 
    { params }: { params: { id: string } }
  ): Promise<NextResponse<CollectionResponse>> => {
        const productId = params.id;
    logOperation('PATCH_ATTEMPT', productId);

    await connect();
    if(!connect) {
        logOperation('PATCH_ERROR', productId, new Error('Database connection failed'));
        return new NextResponse('Database connection error', { status: 500 });
    }

    if (!productId) {
        logOperation('PATCH_ERROR', productId, new Error('Missing product ID'));
        return new NextResponse('Product ID is required', { status: 400 });
    }

    try {
        const body = await req.json();
        const updateData = {
            images: {
                imageSrc: body.images.imageSrc,
                imageAlt: body.images.imageAlt,
            },
            name: body.name,
            description: body.description,
            category: body.category,
            price: body.price,
            status: body.status,
            discount: body.discount,
            id: body.id,
            innventory: body.innventory,
            setting: {
                cardBorderRadius: body.setting.cardBorderRadius,
                cardBackground: body.setting.cardBackground,
                imageWidth: body.setting.imageWidth,
                imageheight: body.setting.imageheight,
                imageRadius: body.setting.imageRadius,
                nameFontSize: body.setting.nameFontSize,
                nameFontWeight: body.setting.nameFontWeight,
                nameColor: body.setting.nameColor,
                descriptionFontSize: body.setting.descriptionFontSize,
                descriptionFontWeight: body.setting.descriptionFontWeight,
                descriptionColor: body.setting.descriptionColor,
                priceFontSize: body.setting.priceFontSize,
                pricecolor: body.setting.pricecolor,
                btnBackgroundColor: body.setting.btnBackgroundColor,
                btnTextColor: body.setting.btnTextColor
            }
        };

        const updatedProduct = await products.findByIdAndUpdate(
            productId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            logOperation('PATCH_ERROR', productId, new Error('Product not found'));
            return new NextResponse('Product not found', { status: 404 });
        }

        logOperation('PATCH_SUCCESS', productId, updatedProduct);
        return new NextResponse(JSON.stringify({ 
            message: 'Product updated successfully',
            product: updatedProduct 
        }), { status: 200 });
    } catch (error) {
        logOperation('PATCH_ERROR', productId, error instanceof Error ? error : new Error('Unknown error'));
        return new NextResponse('Error updating product', { status: 500 });
    }
}
