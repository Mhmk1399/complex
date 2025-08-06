import connect from "@/lib/data";
import { fetchFromStore } from "@/services/disk";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await connect();
  console.log("asdfasdfasdf hit  asdfasdfasdf")

  try {
    const routeName = request.headers.get("selectedRoute");
    const activeMode = request.headers.get("activeMode") || "lg";
    const DiskUrl = request.headers.get("DiskUrl") || ""; // You can add this header client-side

    if (!routeName || !activeMode || !DiskUrl) {
      return NextResponse.json({ error: "Missing required headers" }, { status: 400 });
    }

    const headers = {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    const getFilename = (selectedRoute: string, activeMode: string) => `${selectedRoute}${activeMode}`;
    console.log(getFilename('about' , 'sm'),"asdfasdfasdfasdfasdfdasfasdfasdafasdfa")

    console.log("Fetching data with params:", {
      DiskUrl,
      routeName,
      activeMode,
    })


    // Home route
    if (routeName === "home") {
      const homeContent = JSON.parse(await fetchFromStore(getFilename("home" ,activeMode), DiskUrl));
      return NextResponse.json(homeContent, { status: 200, headers });
    }

    try {
      const routeContent = JSON.parse(await fetchFromStore(getFilename(routeName, activeMode), DiskUrl));
      const homeContent = JSON.parse(await fetchFromStore(getFilename("home" , activeMode), DiskUrl));

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
      return NextResponse.json({ error: "Failed to fetch route content" }, { status: 404 });
    }

  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
