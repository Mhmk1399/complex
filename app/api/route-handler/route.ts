import { NextRequest, NextResponse } from "next/server";
import { deleteDiskFile, listDiskTemplates, createNewJson } from "@/services/disk";




export async function GET(request: NextRequest) {
  const DiskUrl = request.headers.get("DiskUrl");
  if (!DiskUrl) {
    return NextResponse.json({ error: "Missing DiskUrl" }, { status: 400 });
  }
  try {
    const templates = await listDiskTemplates(DiskUrl);
    return NextResponse.json(templates, { status: 200 });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template directory contents' },
      { status: 500 }
    );
  }
}


// create new route
export async function POST(request: NextRequest) {
  const filename = request.headers.get('filename');
  const DiskUrl = request.headers.get('DiskUrl');

  if (!filename) {
    return NextResponse.json(
      { error: 'New route name is required' },
      { status: 400 }
    );
  }

  try {
    // Create the JSON content template for new routes
    await createNewJson(filename, DiskUrl || "");

    return NextResponse.json(
      { message: 'Route files created successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error creating route files:', error);
    return NextResponse.json(
      { error: 'Failed to create route files' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const filename = request.headers.get('filename');
  const DiskUrl = request.headers.get('DiskUrl');


  if (!filename) {
    return NextResponse.json(
      { error: 'Route name is required' },
      { status: 400 }
    );
  }

    if (!DiskUrl) {
    return NextResponse.json(
      { error: 'Route name is required' },
      { status: 400 }
    );
  }

  try {
    // Delete both lg and sm versions

    await deleteDiskFile(filename, DiskUrl);


    return NextResponse.json(
      { message: 'Route files deleted successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting route files:', error);
    return NextResponse.json(
      { error: 'Failed to delete route files' },
      { status: 500 }
    );
  }
}



