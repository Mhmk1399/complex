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
    if (!token) {
      return NextResponse.json(
        { error: 'Token not found in request headers' },
        { status: 400 }
      );
    }

    // Decode the JWT token without verifying it
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
    if (!templateDir) {
      return NextResponse.json(
        { error: 'Template directory not found in token' },
        { status: 400 }
      );
    }

    // Read the file in the template directory
    const filePath = path.join(templateDir, 'detail.json'); // Replace 'your-file-name.ext' with the actual file name
    const fileContent = await new Promise<Buffer>((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });

    // Respond with the file content
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream', // Adjust the content type as needed
        'Content-Disposition': `attachment; filename="${path.basename(filePath)}"`,
      },
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch file: ' + error },
      { status: 500 }
    );
  }
}