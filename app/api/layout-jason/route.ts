import connect from "@/lib/data";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { fetchGitHubFile } from '@/utilities/github';


export async function GET(request: Request) {
  await connect();
  
  try {
    const routeName = request.headers.get("selectedRoute");
    const activeMode = request.headers.get("activeMode") || "lg";

    // Handle home route
    if (routeName === "home") {
      const homeFilePath = `public/template/home${activeMode}.json`;
      const homeContent = JSON.parse(await fetchGitHubFile(homeFilePath));
      return NextResponse.json(homeContent, { status: 200 });
    }

    // Handle other routes
    try {
      // Fetch route-specific content
      const routeFilePath = `public/template/${routeName}${activeMode}.json`;
      const routeContent = JSON.parse(await fetchGitHubFile(routeFilePath));

      // Fetch home content for header and footer
      const homeFilePath = `public/template/home${activeMode}.json`;
      const homeContent = JSON.parse(await fetchGitHubFile(homeFilePath));

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
  if (!connect) {
    console.log("POST_ERROR", "Database connection failed");
    return new NextResponse("Database connection error", { status: 500 });
  }
  try {
    // Get the token from the request headers
    const token = request.headers.get("Authorization")?.split(" ")[1];
    const routeName = request.headers.get("selectedRoute");
    const activeMode = request.headers.get("activeMode") || "lg";

    if (!token) {
      return NextResponse.json(
        { error: "Token not found in request headers" },
        { status: 400 }
      );
    }

    const newLayout = await request.json();
    let decodedToken;
    try {
      decodedToken = jwt.decode(token);
      if (!decodedToken) {
        throw new Error("Failed to decode token");
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid token"+error }, { status: 401 });
    }
    // Get the template directory from the decoded token
    const templateDir = (decodedToken as jwt.JwtPayload).templatesDirectory;
    if (!templateDir || !routeName) {
      return NextResponse.json(
        { error: "Template directory or route not found in token" },
        { status: 400 }
      );
    }
    // Write the layout to the file in the template directory
    if (routeName == "home") {
      const filePath = path.join(templateDir, routeName + activeMode + ".json"); // Replace 'your-file-name.ext' with the actual file name
      await new Promise<void>((resolve, reject) => {
        fs.writeFile(filePath, JSON.stringify(newLayout), (err) => {
          // Convert newLayout to JSON string
          if (err) {
            reject(err);
          } else {
            resolve(console.log("Layout saved successfully"));
          }
        });
      });
    } else if (routeName != "home") {
      try {
        const children = newLayout.sections.children;
        const childrenDir = path.join(
          templateDir,
          routeName + activeMode + ".json"
        );
        if (!fs.existsSync(childrenDir)) {
          fs.mkdirSync(childrenDir, { recursive: true });
        }
        const childrenFilePath = path.join(childrenDir);
        await new Promise<void>((resolve, reject) => {
          fs.writeFile(
            childrenFilePath,
            JSON.stringify({ children }, null, 2),
            (err) => {
              if (err) {
                reject(err);
              } else {
                resolve(console.log("Children section saved successfully"));
              }
            }
          );
        });
        return NextResponse.json(
          { message: "Children section saved successfully" },
          { status: 200 }
        );
      } catch (error) {
        return NextResponse.json(
          { error: "Failed to process request: " + error },
          { status: 500 }
        );
      }
    }
    return NextResponse.json(
      { message: "Layout saved successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save layout: " + error },
      { status: 500 }
    );
  }
}

