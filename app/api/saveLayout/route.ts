import { NextRequest, NextResponse } from "next/server";
import { Layout } from "@/lib/types";
import { writeFile } from "fs/promises";
import { headers } from "next/headers";
import path from "path";


export async function POST(req: NextRequest) {
  try {

    const body = await req.json();
    const { layout } = body as { layout: Layout };
    const headersList = headers();
    const userAgent = (await headersList).get("user-agent") || "";
    console.log("User Agent:", userAgent);
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);
    console.log("Is Mobile:", isMobile);

    // Choose path based on device type
    const jsonPath = path.join(
      process.cwd(),
      "public",
      "template",
      isMobile ? "nullSm.json" : "null.json"
    );

    if (!layout) {
      return NextResponse.json({ message: 'Layout data is required' }, { status: 400 });
    }

    // Using the exact file path


    // Convert layout to JSON string with proper formatting
    const layoutJson = JSON.stringify(layout, null, 2);

    // Write the file
    await writeFile(jsonPath, layoutJson, 'utf-8');

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
