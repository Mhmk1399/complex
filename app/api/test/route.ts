import { NextRequest, NextResponse } from 'next/server';
import { fetchFromStore } from "@/services/disk";

export async function POST(req: NextRequest) {
  try {
    const { filename, storeId } = await req.json();

    if (!filename || !storeId) {
      return NextResponse.json({ error: 'Missing filename or storeId' }, { status: 400 });
    }

    const result = await fetchFromStore(filename, "http://localhost:8000/salam");

    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
