import connect from "@/lib/data";
import { NextResponse } from "next/server";
// import { fetchGitHubFile, saveGitHubFile } from "@/services/disk";
import { fetchFromStore } from "@/services/disk";
import { saveToStore } from "@/services/disk";

export async function GET(request: Request) {
  await connect();

  
  try {
    const routeName = request.headers.get("selectedRoute");
    const activeMode = request.headers.get("activeMode") || "lg";
    const DiskUrl = request.headers.get("DiskUrl") || "test2"; 

    if (!routeName || !activeMode || !DiskUrl) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const headers = {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    };

    console.log(request.body)


    const getFilename = (routeName: string) => `${routeName}${activeMode}.json`;

    console.log(routeName, "routename")
    console.log(activeMode, "activeMode");

    
    

    if (routeName === "home" || routeName === "home") {
      const homeContent = JSON.parse(
        await fetchFromStore(getFilename(`home`), DiskUrl)
      );
      return NextResponse.json(homeContent, { status: 200, headers });
    }

    try {
      console.log("Fetching route content");
      const routeContent = JSON.parse(
        await fetchFromStore(getFilename(routeName), DiskUrl)
      );
      const homeContent = JSON.parse(
        await fetchFromStore(getFilename(`home`), DiskUrl)
      );

      const layout = {
        sections: {
          sectionHeader: homeContent.sections.sectionHeader,
          children: routeContent.children,
          sectionFooter: homeContent.sections.sectionFooter,
        },
      };

      return NextResponse.json(layout, { status: 200, headers });
    } catch (error) {
      console.error("Error fetching content:", error);
      return NextResponse.json(
        { error: "Failed to fetch route content" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  await connect();
  console.log("POST request received");

  try {
    const routeName = request.headers.get("selectedRoute");
    const activeMode = request.headers.get("activeMode") || "lg";
    const DiskUrl = request.headers.get("DiskUrl") || "default-store";

    if (!routeName || !activeMode || !DiskUrl) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const newLayout = await request.json();
    const filename = `${routeName}${activeMode}.json`;
    console.log(filename);

    if (routeName === "home") {
      await saveToStore(filename, DiskUrl, newLayout);
      return NextResponse.json(
        { message: "Layout saved successfully" },
        { status: 200 }
      );
    }

    const children = newLayout.sections?.children || [];
    await saveToStore(filename, DiskUrl, { children });
    return NextResponse.json(
      { message: "Children section saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "Failed to save layout: " + error },
      { status: 500 }
    );
  }
}
