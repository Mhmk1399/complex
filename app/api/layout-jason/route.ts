import connect from "@/lib/data";
import { NextResponse } from "next/server";
import { fetchGitHubFile, saveGitHubFile } from '@/utilities/github';


export async function GET(request: Request) {
  await connect();
  
  try {
    const routeName = request.headers.get("selectedRoute");
    const activeMode = request.headers.get("activeMode") || "lg";
    const repoUrl = request.headers.get("repoUrl");
    if (!routeName || !activeMode || !repoUrl) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }


    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    // Handle home route
    if (routeName === "home") {
      const homeFilePath = `public/template/home${activeMode}.json`;
      const homeContent = JSON.parse(await fetchGitHubFile(homeFilePath, repoUrl));
      return NextResponse.json(homeContent, { status: 200, headers });
    }

    // Handle other routes
    try {
      // Fetch route-specific content
      const routeFilePath = `public/template/${routeName}${activeMode}.json`;
      const routeContent = JSON.parse(await fetchGitHubFile(routeFilePath, repoUrl));

      // Fetch home content for header and footer
      const homeFilePath = `public/template/home${activeMode}.json`;
      const homeContent = JSON.parse(await fetchGitHubFile(homeFilePath, repoUrl));

      // Construct layout
      const layout = {
        sections: {
          sectionHeader: homeContent.sections.sectionHeader,
          children: routeContent.children,
          sectionFooter: homeContent.sections.sectionFooter,
        },
      };

      return NextResponse.json(layout, { status: 200 });
    } catch (error) {
      console.log("Error fetching route content:", error);
      return NextResponse.json({ error: "Failed to fetch route content" }, { status: 404 });
    }

  } catch (error) {
    console.log("Error processing request:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  await connect();
  console.log("POST request received");

  try {
    const routeName = request.headers.get("selectedRoute");
    const activeMode = request.headers.get("activeMode") || "lg";
    const repoUrl = request.headers.get("repoUrl");
    if (!routeName || !activeMode || !repoUrl) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }




    const newLayout = await request.json();


    if (routeName === "home") {
      const filePath = `public/template/${routeName}${activeMode}.json`;
      await saveGitHubFile(filePath, JSON.stringify(newLayout, null, 2), repoUrl);
      return NextResponse.json({ message: "Layout saved successfully" }, { status: 200 });
    } 
    
    const children = newLayout.sections.children;
    const filePath = `public/template/${routeName}${activeMode}.json`;
    await saveGitHubFile(filePath, JSON.stringify({ children }, null, 2),repoUrl);
    return NextResponse.json({ message: "Children section saved successfully" }, { status: 200 });

  } catch (error) {
    console.log("Error in POST request:", error);
    return NextResponse.json({ error: "Failed to save layout: " + error }, { status: 500 });
  }
}


