import { NextRequest,NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { saveGitHubFile,deleteGitHubFile } from "@/utilities/github";


import { Octokit } from "@octokit/rest";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = "Mhmk1399";
const GITHUB_REPO = "userwebsite";

export async function GET(request: NextRequest) {
  try {
    const octokit = new Octokit({
      auth: GITHUB_TOKEN
    });

    const response = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: 'public/template'
    });

    if (Array.isArray(response.data)) {
      const fileNames = response.data
        .filter(item => item.type === 'file')
        .map(file => file.name.replace(/\.json$/, ''))
        .map(name => name.replace(/(lg|sm|Lg|Sm)$/, ''))
        .filter((name, index, array) => array.indexOf(name) === index);
    
      return NextResponse.json(fileNames, { status: 200 });
    }
    

    return NextResponse.json([], { status: 200 });

  } catch (error) {
    console.log("Error fetching template directory contents:", error);
    return NextResponse.json(
      { error: 'Failed to fetch template directory contents' },
      { status: 500 }
    );
  }
}

// post method for route
export async function POST(request: NextRequest) {
  const newRoute = request.headers.get('new-route');
  
  try {
    // Create the JSON content template for new routes
    const jsonContent = {
      children: {
        type: newRoute,
        sections: [],
        order: []
      }
    };

    // Create both lg and sm versions
    const lgFilePath = `public/template/${newRoute}lg.json`;
    const smFilePath = `public/template/${newRoute}sm.json`;

    // Save files to GitHub using the saveGitHubFile function
    await saveGitHubFile(lgFilePath, JSON.stringify(jsonContent, null, 2));
    await saveGitHubFile(smFilePath, JSON.stringify(jsonContent, null, 2));

    return NextResponse.json(
      { message: 'Route files created successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.log('Error creating route files:', error);
    console.error('Error creating route files:', error);
    return NextResponse.json(
      { error: 'Failed to create route files' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const route = request.headers.get('route');

  if (!route) {
    return NextResponse.json(
      { error: 'Route name is required' },
      { status: 400 }
    );
  }

  try {
    // Delete both lg and sm versions
    const lgFilePath = `public/template/${route}lg.json`;
    const smFilePath = `public/template/${route}sm.json`;

    await deleteGitHubFile(lgFilePath);
    await deleteGitHubFile(smFilePath);

    return NextResponse.json(
      { message: 'Route files deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting route files:', error);
    return NextResponse.json(
      { error: 'Failed to delete route files' },
      { status: 500 }
    );
  }
}

async function deleteRouteFiles(route: string, payload: jwt.JwtPayload) {
  const templateDir = payload.templatesDirectory;
  if (!templateDir) {
    throw new Error('Template directory not found in token');
  }

  // Define file paths
  const smFilePath = path.join(templateDir, `${route}sm.json`);
  const lgFilePath = path.join(templateDir, `${route}lg.json`);

  // Delete the files
  try {
    fs.unlinkSync(smFilePath);
    fs.unlinkSync(lgFilePath);
    console.log('Files deleted successfully');
  } catch (error) {
    console.error('Error deleting files:', error);
    throw new Error('Failed to delete files');
  }
}

async function createRouteFiles(newRoute: string, payload: jwt.JwtPayload) {
  const templateDir = payload.templatesDirectory;
  if (!templateDir) {
    throw new Error('Template directory not found in token');
  }

  // Create the JSON content
  const jsonContent = {
    children: {
      type: newRoute,
      sections: [],
      order: []
    }
  };

  // Define file paths
  const smFilePath = path.join(templateDir, `${newRoute}sm.json`);
  const lgFilePath = path.join(templateDir, `${newRoute}lg.json`);

  // Write the JSON content to the files
  try {
    fs.writeFileSync(smFilePath, JSON.stringify(jsonContent, null, 2));
    fs.writeFileSync(lgFilePath, JSON.stringify(jsonContent, null, 2));
    console.log('Files created successfully');
  } catch (error) {
    console.error('Error writing files:', error);
    throw new Error('Failed to create files');
  }
}
