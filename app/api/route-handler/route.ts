import { NextRequest,NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';


import { Octokit } from "@octokit/rest";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = "Mhmk1399";
const GITHUB_REPO = "userwebsite";

export async function GET(request: Request) {
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
    return NextResponse.json(
      { error: 'Failed to fetch template directory contents' },
      { status: 500 }
    );
  }
}

// post method for route
export async function POST(request: NextRequest) {
  const newRoute = request.headers.get('new-route');
 
 
    const octokit = new Octokit({
      auth: GITHUB_TOKEN
    });

    const response = await octokit.repos.getContent({
      owner: GITHUB_OWNER,
      repo: GITHUB_REPO,
      path: 'public/template'
    });

  // Get the template directory from the decoded token

  await createRouteFiles(newRoute,response);
  // Create the JSON content
  const jsonContent = {
    children: {
      type: newRoute,
      sections: [],
      order: []
    }
  };

  // Define file paths
  const smFilePath = path.join(response, `${newRoute}sm.json`);
  const lgFilePath = path.join(response, `${newRoute}lg.json`);

  // Write the JSON content to the files
  try {
    fs.writeFileSync(smFilePath, JSON.stringify(jsonContent, null, 2));
    fs.writeFileSync(lgFilePath, JSON.stringify(jsonContent, null, 2));
    console.log('Files created successfully');
  } catch (error) {
    console.error('Error writing files:', error);
    return NextResponse.json(
      { error: 'Failed to create files' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: 'Files created successfully' },
    { status: 200 }
  );
}
 export async function DELETE(request: NextRequest) {
  const token = request.headers.get('Authorization')
  const route = request.headers.get('route');
  if (!token) {
    return NextResponse.json(
      { error: 'Missing token' },
      { status: 401 }
    );
  }
  let decodedToken;
  try {
    decodedToken = jwt.decode(token);
    if (!decodedToken) {
      throw new Error('Failed to decode token');
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token'+error },
      { status: 401 }
    );
  }

  // Get the template directory from the decoded token
  const templateDir = (decodedToken as jwt.JwtPayload).templatesDirectory;
  if (!templateDir || !route) {
    return NextResponse.json(
      { error: 'Template directory or route not found in token' },
      { status: 400 }
    );
  }
  await deleteRouteFiles(route, decodedToken as jwt.JwtPayload);

  // Define file paths
  const smFilePath = path.join(templateDir, `${route}sm.json`);
  const lgFilePath = path.join(templateDir, `${route}lg.json`);
console.log(smFilePath);
console.log(lgFilePath);


  // Delete the files
  try {
    fs.unlinkSync(smFilePath);
    fs.unlinkSync(lgFilePath);
    console.log('Files deleted successfully');
  } catch (error) {
    console.error('Error deleting files:', error);
    return NextResponse.json(
      { error: 'Failed to delete files' },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: 'Files deleted successfully' },
    { status: 200 }
  );
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
