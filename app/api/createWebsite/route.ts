import { NextRequest, NextResponse } from "next/server";
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  const logs: string[] = [];

  try {
    const { projectName } = await req.json();

    logs.push('[START] Website generation process initiated');

    const sourceDir = "C:\\Users\\msi\\Desktop\\complex-main";
    const targetBaseDir = "C:\\Users\\msi\\Desktop\\testgenrator";
    const targetProjectDir = path.join(targetBaseDir, projectName);

    await fs.mkdir(targetProjectDir, { recursive: true });
    logs.push(`[SUCCESS] Created new project directory: ${projectName}`);

    logs.push('[PROCESS] Copying repository files...');
    await fs.cp(sourceDir, targetProjectDir, {
      recursive: true,
      filter: (src) => {
        const skipPaths = [
          'node_modules',
          '.git',
          '.next',
          'form',
          '.env',
          '.env.local'
        ];
        return !skipPaths.some(skip => src.includes(skip)) &&
          !path.basename(src).startsWith('.');
      }
    });
    logs.push('[SUCCESS] Repository files copied');

    // Write new page.tsx
    logs.push('[PROCESS] Creating custom page.tsx');
    const newPageContent = `'use client'
import data from '../public/template/null.json'
import { Layout } from '../lib/types'
import { Preview } from "./components/preview";
import { useState } from 'react';

const Data = data as unknown as Layout;

const Home = () => {
  const [layout, setLayout] = useState<Layout>(Data);
  const [selectedComponent, setSelectedComponent] = useState<string>('sectionHeader');

  return (
    <div>
       <Preview
            layout={layout}
            setSelectedComponent={setSelectedComponent}
          />
    </div>
  );
}

export default Home`;

    await fs.writeFile(path.join(targetProjectDir, '/app/page.tsx'), newPageContent);
    logs.push('[SUCCESS] Custom page.tsx created');

    // Write new preview.tsx
    logs.push('[PROCESS] Creating custom preview component');
    const newPreviewContent = `import React from "react";
import Header from "./sections/header";
import RichText from "./sections/richText";
import Banner from "./sections/banner";
import ImageText from "./sections/imageText";
import Video from "./sections/video";
import ContactForm from "./sections/contactForm";
import NewsLetter from "./sections/newsLetter";
import CollapseFaq from "./sections/collapseFaq";
import MultiColumn from "./sections/multiColumn";
import SlideShow from "./sections/slideShow";
import MultiRow from "./sections/multiRow";

interface PreviewProps {
  layout: {};
  setSelectedComponent: React.Dispatch<React.SetStateAction<string>>;
}

export const Preview: React.FC<PreviewProps> = ({
  layout,
  setSelectedComponent,
}) => {
  return (
    <div className="w-full md:w-full lg:w-[100%] h-[95vh] relative border border-gray-200 rounded-lg overflow-y-auto scrollbar-hide   ">
      <Header setSelectedComponent={setSelectedComponent} layout={layout} />
      <RichText setSelectedComponent={setSelectedComponent} layout={layout} />
      <Banner setSelectedComponent={setSelectedComponent} layout={layout} />
      <ImageText setSelectedComponent={setSelectedComponent} layout={layout} />
      <Video setSelectedComponent={setSelectedComponent} layout={layout} />
      <ContactForm setSelectedComponent={setSelectedComponent} layout={layout} />
      <NewsLetter setSelectedComponent={setSelectedComponent} layout={layout} />
      <CollapseFaq setSelectedComponent={setSelectedComponent} layout={layout} />
      <MultiColumn setSelectedComponent={setSelectedComponent} layout={layout} />
      <SlideShow setSelectedComponent={setSelectedComponent} layout={layout} />
      <MultiRow setSelectedComponent={setSelectedComponent} layout={layout} />
    </div>
  );
};`;

    await fs.writeFile(path.join(targetProjectDir, '/app/components/preview.tsx'), newPreviewContent);
    logs.push('[SUCCESS] Custom preview component created');

    logs.push('[COMPLETE] Website generation completed');
    logs.push(`[INFO] Project location: ${targetProjectDir}`);

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
