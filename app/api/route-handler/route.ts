import { NextRequest, NextResponse } from "next/server";
import { deleteDiskFile, listDiskTemplates, createNewJson } from "@/services/disk";



export async function GET(request: NextRequest) {
  const DiskUrl = request.headers.get("DiskUrl"); // the url of the disk like https://mamad.com/storeid
  if (!DiskUrl) {
    return NextResponse.json({ error: "Missing StoreId" }, { status: 400 });
  }
  try {
    const templates = await listDiskTemplates(DiskUrl);
    return NextResponse.json(templates, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch template directory contents' },
      { status: 500 }
    );
  }
}


// post method for route
export async function POST(request: NextRequest) {
  const filename = request.headers.get('filename');

  if (!filename) {
    return NextResponse.json(
      { error: 'New route name is required' },
      { status: 400 }
    );
  }

  try {
    // Create the JSON content template for new routes


    // Save files to GitHub using the saveGitHubFile function
    await createNewJson(filename);

    return NextResponse.json(
      { message: 'Route files created successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.log('Error creating route files:', error);
    console.error('Error creating route files:', error);
    return NextResponse.json(
      { error: 'Failed to create route files' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const filename = request.headers.get('filename');
  const StoreId = request.headers.get('StoreId');


  if (!filename) {
    return NextResponse.json(
      { error: 'Route name is required' },
      { status: 400 }
    );
  }

    if (!StoreId) {
    return NextResponse.json(
      { error: 'Route name is required' },
      { status: 400 }
    );
  }

  try {
    // Delete both lg and sm versions

    await deleteDiskFile(filename, StoreId);


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



