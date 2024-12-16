import connect from "@/lib/data";
import { Layout } from '@/models/layout';
import { NextResponse } from 'next/server';

export async function GET() {
    await connect();
    if (!connect) {
        console.log("POST_ERROR", "Database connection failed");
        return new NextResponse("Database connection error", { status: 500 });
      }
  try {
    const layout = await Layout.findOne();
    
    if (!layout) {
      // If no layout exists, you could return the default null.json data
      const defaultLayout = await import('@/public/template/null.json');
      return NextResponse.json(defaultLayout.default);
    }

    return NextResponse.json(layout);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch layout data' },
      { status: 500 }
    );
  }
}
 
export async function POST(request: Request) {
    await connect();
    if (!connect) {
        console.log("POST_ERROR", "Database connection failed");
        return new NextResponse("Database connection error", { status: 500 });
    }
    
    try {
        const body = await request.json();
        const { mode, layout } = body;

        // Find existing layout or create new one
        const existingLayout = await Layout.findOne();
        
        if (existingLayout) {
            // Update existing layout
            const updatedLayout = await Layout.findOneAndUpdate(
                {},
                { ...layout },
                { new: true }
            );
            return NextResponse.json(updatedLayout);
        } else {
            // Create new layout
            const newLayout = new Layout(layout);
            await newLayout.save();
            return NextResponse.json(newLayout);
        }
        
    } catch (error) {
        console.error("Error saving layout:", error);
        return NextResponse.json(
            { error: 'Failed to save layout' },
            { status: 500 }
        );
    }
}
