import { NextRequest, NextResponse } from 'next/server';
import { generateTokenForComplex } from '@/utilities/generateTokenForComplex';

export async function GET(request: NextRequest) {
  try {
    // Get the repoUrl from the query parameters
    const searchParams = request.nextUrl.searchParams;
    console.log(searchParams,"searchParams")
    const storeId = searchParams.get('storeId');
    console.log(storeId,"storeId")

    if (!storeId) {
      return NextResponse.json(
        { error: 'storeId URL is required' }, 
        { status: 400 }
      );
    }

    
    const token = await generateTokenForComplex(storeId);

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
