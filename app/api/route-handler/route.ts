import { NextRequest, NextResponse } from "next/server";
import { saveGitHubFile, deleteGitHubFile, listGitHubTemplates, createRoutePage, deleteRoutePage } from "@/utilities/github";



export async function GET() {
  try {
    const templates = await listGitHubTemplates();
    return NextResponse.json(templates, { status: 200 });
  } catch (error) {
    console.log("Error fetching template directory contents:", error);
    console.error("Error fetching template directory contents:", error);
    return NextResponse.json(
      { error: 'Failed to fetch template directory contents' },
      { status: 500 }
    );
  }
}


// post method for route
export async function POST(request: NextRequest) {
  const newRoute = request.headers.get('new-route');

  if (!newRoute) {
    return NextResponse.json(
      { error: 'New route name is required' },
      { status: 400 }
    );
  }

  try {
    // Create the JSON content template for new routes
    const jsonContent = {
      children: {
        type: newRoute,
        sections: [],
        order: []
      }
    };

    // Create both lg and sm versions
    const lgFilePath = `public/template/${newRoute}lg.json`;
    const smFilePath = `public/template/${newRoute}sm.json`;

    // Save files to GitHub using the saveGitHubFile function
    await saveGitHubFile(lgFilePath, JSON.stringify(jsonContent, null, 2));
    await saveGitHubFile(smFilePath, JSON.stringify(jsonContent, null, 2));
    await createRoutePage(newRoute);

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
  const route = request.headers.get('route');

  if (!route) {
    return NextResponse.json(
      { error: 'Route name is required' },
      { status: 400 }
    );
  }

  try {
    // Delete both lg and sm versions
    const lgFilePath = `public/template/${route}lg.json`;
    const smFilePath = `public/template/${route}sm.json`;

    await deleteGitHubFile(lgFilePath);
    await deleteGitHubFile(smFilePath);
    await deleteRoutePage(route);


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



