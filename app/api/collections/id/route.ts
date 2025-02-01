import connect from "@/lib/data";
import { NextRequest, NextResponse } from 'next/server';
import Collections from "@/models/collections";

export async function GET(request: NextRequest ) {
    try {
        await connect();
        const collectionId = request.headers.get('collectionId');
        const collections = await Collections.find({ _id: collectionId });
        return NextResponse.json({ collections }, { status: 200 });
    } catch (error) {
        console.error("Error fetching collections:", error);
        return NextResponse.json({ message: "Error fetching collections" }, { status: 500 });
    }
}