import connect from "@/lib/data";
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { log } from "console";

export async function GET(request: Request) {
  await connect();
  if (!connect) {
    console.log("GET_ERROR", "Database connection failed");
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
        { error: 'Template directory or route not found in token' },
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
      const filePath = path.join(templateDir, routeName + activeMode + '.json');
      if (!fs.existsSync(filePath)) {
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }
      const fileContent = await new Promise<Buffer>((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
          if (err) {
            reject( console.log('error in fs function',err));
          } else {
            resolve(data);
            
          }
        });
      });
    console.log('fileContent',fileContent);
  if (!fileContent) {
    console.log('error fileContent',fileContent);
    
    return NextResponse.json(
      { error: 'Failed to read file' },
      { status: 500 }
    );
  }
  const containerRoute = path.join(templateDir,'home'+activeMode+'.json');
  const container = await new Promise<Buffer>((resolve, reject) => {
    fs.readFile(containerRoute, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
  })
  })


  
      const routeEntry = JSON.parse(container.toString());
      const childernEntry = JSON.parse(fileContent.toString());
    
      const sectionHeader = routeEntry.sections.sectionHeader
      const sectionFooter = routeEntry.sections.sectionFooter;
      if (!sectionHeader || !sectionFooter||!routeEntry.sections.children) {
        return NextResponse.json(
          { error: 'Section header or footer not found' },
          { status: 404 }
        );
      }
      
      const children = childernEntry.children;
     
      const layout = {
        sections: {
          sectionHeader,
          children,
          sectionFooter
        }
      };
      if (!layout) {
        return NextResponse.json(
          { error: 'Layout not found' },
          { status: 404 }
        );
      }
  
      return new NextResponse(JSON.stringify(layout), {
        status: 200,
        headers: {
          'Content-Type': 'application/json', // Adjust the content type as needed
        }
      });
    } catch (error) {
      console.log('catch error',error);
      
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

    const newLayout = await request.json();
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
        { error: 'Template directory or route not found in token' },
        { status: 400 }
      );
    }
    // Write the layout to the file in the template directory
    if (routeName == "home") {
      const filePath = path.join(templateDir, routeName+activeMode+'.json'); // Replace 'your-file-name.ext' with the actual file name
      await new Promise<void>((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(newLayout), (err) => { // Convert newLayout to JSON string
          if (err) {
            reject(err);
          } else {
            resolve( console.log('Layout saved successfully')
             );
          }
        });
      });
    }else if(routeName != "home"){
    try{ 
      const sectionHeader = newLayout.sections.sectionHeader;
      const children = newLayout.sections.children;
      const sectionFooter = newLayout.sections.sectionFooter;

      
      const childrenDir = path.join(templateDir, routeName+activeMode+'.json');
      if (!fs.existsSync(childrenDir)) {
        fs.mkdirSync(childrenDir, { recursive: true });
      }
      const childrenFilePath = path.join(childrenDir);
      await new Promise<void>((resolve, reject) => {
        fs.writeFile(childrenFilePath, JSON.stringify({ children }, null, 2), (err) => {
          if (err) {
            reject(err);
          } else {
            resolve(console.log('Children section saved successfully'));
          }
        });
      });
      return NextResponse.json(
        { message: 'Children section saved successfully' },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to process request: ' + error },
        { status: 500 }
      );
    }    
  }
  return NextResponse.json({ message: 'Layout saved successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save layout: ' + error },
      { status: 500 }
    );
  }
}