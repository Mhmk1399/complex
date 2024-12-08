import { NextRequest, NextResponse } from "next/server";
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const logs: string[] = [];

  try {
    const { projectName } = await req.json();
    logs.push('[START] Website generation process initiated');

    // Define source directories
    const EMPTY_DIR = path.normalize(process.env.EMPTY_DIR || "C:\\Users\\msi\\Desktop\\newuser");
    const SOURCE_JSON = process.env.SOURCE_DIR || "C:\\Users\\msi\\Documents\\GitHub\\complex\\public\\template\\null.json";
    const TARGET_BASE_DIR = "C:\\Users\\msi\\Desktop"

   
    logs.push(`Target Base Directory: ${TARGET_BASE_DIR}`);
    logs.push(`Empty Directory: ${EMPTY_DIR}`);

    try {
      await fs.access(EMPTY_DIR);
    } catch {
      logs.push('[ERROR] Empty directory template not found');
      return NextResponse.json({
        success: false,
        error: `Template directory not found: ${EMPTY_DIR}`,
        logs
      }, { status: 404 });
    }
    
    // Create target project directory
    const targetProjectDir = path.join(TARGET_BASE_DIR, projectName);
    await fs.mkdir(targetProjectDir, { recursive: true });
    logs.push(`[SUCCESS] Created project directory: ${targetProjectDir}`);

    // Copy all files from EMPTY_DIR to target directory
    logs.push('[PROCESS] Copying template files...');
    await fs.cp(EMPTY_DIR, targetProjectDir, {
      recursive: true,

      filter: (src) => {
        // Skip node_modules and other unnecessary files
        const skipPaths = [
          'node_modules',
          '.git',
          '.next',
          '.env',
          '.env.local'
        ];
        return !skipPaths.some(skip => src.includes(skip));
      }
    });
    logs.push('[SUCCESS] Template files copied');

    // Ensure template directory exists
    const targetTemplateDir = path.join(targetProjectDir, 'public', 'template');
    await fs.mkdir(targetTemplateDir, { recursive: true });
    logs.push('[SUCCESS] Created template directory');

    // Copy null.json to target template directory
    await fs.cp(
      SOURCE_JSON, 
      path.join(targetTemplateDir, 'null.json')
    );
    logs.push('[SUCCESS] Added null.json template');

    return NextResponse.json({
      success: true,
      projectPath: targetProjectDir,
      logs
    });

  } catch (error) {
    logs.push(`[ERROR] Generation failed: ${(error as Error).message}`);
    return NextResponse.json({
      success: false,
      error: (error as Error).message,
      logs
    }, { status: 500 });
  }
}
