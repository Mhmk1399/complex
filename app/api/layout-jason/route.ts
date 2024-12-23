import connect from "@/lib/data";
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  await connect();
  if (!connect) {
    console.log("POST_ERROR", "Database connection failed");
    return new NextResponse("Database connection error", { status: 500 });
  }

  try {
    // Get the token from the request headers
    const token = request.headers.get('Authorization')?.split(' ')[1];
    const routeName=request.headers.get('selectedRoute') 
    const activeMode=request.headers.get('activeMode')||'lg'


   

    
    if (!token) {
      return NextResponse.json(
        { error: 'Token not found in request headers' },
        { status: 400 }
      );
    }

    // Decode the JWT token 
    let decodedToken;
    try {
      decodedToken = jwt.decode(token);
      if (!decodedToken) {
        throw new Error('Failed to decode token');
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get the template directory from the decoded token
    const templateDir = (decodedToken as jwt.JwtPayload).templatesDirectory;
    if (!templateDir|| !routeName) {
      return NextResponse.json(
        { error: 'Template directory not found in token' },
        { status: 400 }
      );
    }
   
    // Read the file in the template directory
    const filePath = path.join(templateDir,routeName+activeMode+'.json'); // Replace 'your-file-name.ext' with the actual file name
    
    let fileContent;
    if (routeName == "home") {
     fileContent = await new Promise<Buffer>((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {    
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
    if (routeName != "home") {
      try {
        const routeEntry = JSON.parse(fs.readFileSync(path.join(templateDir,'home'+activeMode+'.json'), 'utf-8'));
        const sectionHeader = routeEntry.sections.sectionHeader;
        const sectionFooter = routeEntry.sections.sectionFooter;
        if (!fileContent) {
          throw new Error('File content is undefined');
        }
        const children = JSON.parse(fileContent.toString());
        const layout = {
          sections: { 
            sectionHeader,
            children,
            sectionFooter
          }
        }
        return new NextResponse(JSON.stringify(layout), {
          status: 200,
          headers: {
            'Content-Type': 'application/json', // Adjust the content type as needed
          }
    });
    // Respond with the file content
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch file: ' + error },
        { status: 500 }
      );
    }
  }

  // Respond with the file content
  return new NextResponse(fileContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/json', // Adjust the content type as needed
    }
  });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch file: ' + error },
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
    // Get the token from the request headers

    const token = request.headers.get('Authorization')?.split(' ')[1];
    const routeName=request.headers.get('selectedRoute') 
    const activeMode=request.headers.get('activeMode')||'lg'

    if (!token) {
      return NextResponse.json(
        { error: 'Token not found in request headers' },
        { status: 400 }
      );
    }

    const newLayout = await request.text();
    let decodedToken;
    try {
      decodedToken = jwt.decode(token);
      if (!decodedToken) {
        throw new Error('Failed to decode token');
      }
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Get the template directory from the decoded token
    const templateDir = (decodedToken as jwt.JwtPayload).templatesDirectory;
    if (!templateDir || !routeName) {
      return NextResponse.json(
        { error: 'Template directory not found in token' },
        { status: 400 }
      );
    }

    // Write the layout to the file in the template directory
    const filePath = path.join(templateDir, routeName+activeMode+'.json'); // Replace 'your-file-name.ext' with the actual file name
    await new Promise<void>((resolve, reject) => {
      fs.writeFile(filePath, newLayout, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve( console.log('Layout saved successfully')
           );
        }
      });
    });

    return NextResponse.json({ message: 'Layout saved successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save layout: ' + error },
      { status: 500 }
    );
  }
}