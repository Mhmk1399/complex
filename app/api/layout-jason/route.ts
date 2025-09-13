import connect from "@/lib/data";
import { NextResponse } from "next/server";
import { fetchFromMongoDB, saveToMongoDB } from "@/services/mongodb";

export async function GET(request: Request) {
  await connect();

  try {
    const routeName = request.headers.get("selectedRoute");
    const activeMode = request.headers.get("activeMode") || "lg";
    const storeId = request.headers.get("storeId") || "default-store";

    if (!routeName || !activeMode) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }


    const getFilename = (routeName: string) => `${routeName}${activeMode}`;

    console.log(routeName, "routename")
    console.log(activeMode, "activeMode");

    console.log(getFilename("home")," filename")

    
    

    if (routeName === "home") {
      const homeContent = JSON.parse(
        await fetchFromMongoDB("home", activeMode, storeId)
      );
      return NextResponse.json(homeContent, { status: 200 });
    }

    try {
      const routeContent = JSON.parse(
        await fetchFromMongoDB(routeName, activeMode, storeId)
      );
      const homeContent = JSON.parse(
        await fetchFromMongoDB("home", activeMode, storeId)
      );

      const layout = {
        sections: {
          sectionHeader: homeContent.sections.sectionHeader,
          children: routeContent.children,
          sectionFooter: homeContent.sections.sectionFooter,
        },
      };

      return NextResponse.json(layout, { status: 200 });
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

  try {
    const routeName = request.headers.get("selectedRoute");
    const activeMode = request.headers.get("activeMode") || "lg";
    const storeId = request.headers.get("storeId") || "default-store";

    if (!routeName || !activeMode) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const newLayout = await request.json();

    console.log(newLayout, "json body")
    const filename = `${routeName}${activeMode}`;
    console.log(filename);

    if (routeName === "home") {
      await saveToMongoDB(routeName, activeMode, storeId, newLayout);
      return NextResponse.json(
        { message: "Layout saved successfully" },
        { status: 200 }
      );
    }

    const children = newLayout.sections?.children || {};
    await saveToMongoDB(routeName, activeMode, storeId, { children });
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
