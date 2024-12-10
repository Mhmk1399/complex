import { NextRequest, NextResponse } from "next/server";
import { Layout } from "@/lib/types";
import { writeFile } from "fs/promises";
import path from "path";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { layout, mode } = body as { layout: Layout; mode: string };

    console.log("Received layout:", layout);
    console.log("Received mode:", mode);

    if (!layout || !mode) {
      return NextResponse.json({ 
        message: 'Layout and mode are required' 
      }, { status: 400 });
    }

     if (!['sm', 'lg'].includes(mode)) {
      return NextResponse.json({ 
        message: 'Invalid mode specified' 
      }, { status: 400 });
    }

    // Choose path based on device type
    const jsonPath = path.join(
      process.cwd(),
      "public",
      "template",
     mode === "sm" ? "nullSm.json" : "null.json"
    );
    console.log('Writing to path:', jsonPath); // Debug log


    if (!layout) {
      return NextResponse.json({ message: 'Layout data is required' }, { status: 400 });
    }

    // Using the exact file path

    // Convert layout to JSON string with proper formatting
    const layoutJson = JSON.stringify(layout, null, 2);
    

    // Write the file
    try {
    await writeFile(jsonPath, layoutJson, 'utf-8');
    console.log('File write completed'); 
  } catch (writeError) {
    console.error('File write error:', writeError);
    return NextResponse.json({ 
      message: 'Error writing file',
      error: writeError 
    }, { status: 500 });
  }

    return NextResponse.json({
      message: 'Layout saved successfully',
      layout,
      jsonPath
    }, { status: 200 });

  } catch (error) {
    console.error('Error saving layout:', error);
    return NextResponse.json({
      message: 'Error saving layout',
      error: (error as Error).message
    }, { status: 500 });
  }
}