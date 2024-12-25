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
        { error: 'Invalid token' },
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
        { error: 'Failed to read template directory' },
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