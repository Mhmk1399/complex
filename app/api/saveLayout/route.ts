import { NextRequest, NextResponse } from "next/server";
import { Layout } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { layout } = body as { layout: Layout };

    if (!layout) {
      return NextResponse.json({ message: 'Layout data is required' }, { status: 400 });
    }

    // Here you would implement your database save logic
    // Example with a hypothetical database service:
    // await db.layouts.save(layout);
    
    // For now, we'll just return success
    return NextResponse.json({ 
      message: 'Layout saved successfully',
      layout 
    }, { status: 200 });

  } catch (error) {
    console.error('Error saving layout:', error);
    return NextResponse.json({ 
      message: 'Error saving layout', 
      error: (error as Error).message 
    }, { status: 500 });
  }
}
