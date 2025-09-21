import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    
    if (!token) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return NextResponse.json({ valid: false }, { status: 500 });
    }

    const decoded = jwt.verify(token, jwtSecret);
    return NextResponse.json({ valid: true, user: decoded });
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}