import { NextRequest, NextResponse } from 'next/server';
import { generateTokenForComplex } from '@/utilities/generateTokenForComplex';

export async function GET(request: NextRequest) {
  try {
    // Get the repoUrl from the query parameters
    const searchParams = request.nextUrl.searchParams;
    
    const repoUrl = searchParams.get('repoUrl');

    if (!repoUrl) {
      return NextResponse.json(
        { error: 'Repository URL is required' }, 
        { status: 400 }
      );
    }

    // Generate token using the repository URL
    const token = await generateTokenForComplex(repoUrl);

    return NextResponse.json({ 
      token,
      message: 'Token generated successfully' 
    });

  } catch (error) {
    console.error('First request error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    );
  }
}
