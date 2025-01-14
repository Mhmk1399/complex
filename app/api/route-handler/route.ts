import { NextRequest,NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';


export  async function GET (request: NextRequest)  {
    const token = request.headers.get('Authorization')?.split(' ')[1];
  
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
    if (!templateDir) {
      return NextResponse.json(
        { error: 'Template directory or route not found in token' },
        { status: 400 }
      );
    }

    // Read the file names in the template directory
    let fileNames;
    try {
      fileNames = fs.readdirSync(templateDir);
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to read template directory'+error },
        { status: 500 }
      );
    }

    // Filter and process file names
    const filteredNames = Array.from(new Set(
      fileNames
        .filter(name => name !== '.DS_Store') // Exclude .DS_Store
        .map(name => name.replace(/lg\.json$|sm\.json$|\.json$/, ''))
    ));

    return NextResponse.json(filteredNames);
}
// post method for route
export async function POST(request: NextRequest) {
  const token = request.headers.get('Authorization')
  const newRoute = request.headers.get('new-route');
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
  if (!templateDir || !newRoute) {
    return NextResponse.json(
      { error: 'Template directory or route not found in token' },
      { status: 400 }
    );
  }
  await createRouteFiles(newRoute, decodedToken as jwt.JwtPayload);
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
