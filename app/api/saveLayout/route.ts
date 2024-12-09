import { NextRequest, NextResponse } from "next/server";
import { Layout } from "@/lib/types";
import { writeFile } from "fs/promises";
import Head from "next/head";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { layout } = body as { layout: Layout };


    if (!layout) {
      return NextResponse.json({ message: 'Layout data is required' }, { status: 400 });
    }

    // Using the exact file path
    const filePath = process.env.LAYOUT_FILE_PATH || 'C:\\Users\\msi\\Documents\\GitHub\\userwebsite\\src\\app\\layout.tsx';

    // Convert layout to JSON string with proper formatting
    const layoutJson = JSON.stringify(layout, null, 2);

    // Write the file
    await writeFile(filePath, layoutJson, 'utf-8');
    
    return NextResponse.json({ 
      message: 'Layout saved successfully',
      layout,
      filePath
    }, { status: 200 });

  } catch (error) {
    console.error('Error saving layout:', error);
    return NextResponse.json({ 
      message: 'Error saving layout', 
      error: (error as Error).message 
    }, { status: 500 });
  }
}
