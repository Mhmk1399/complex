import { NextRequest, NextResponse } from "next/server";
import {
  deleteMongoDBFile,
  listMongoDBTemplates,
  createNewMongoJSON,
} from "@/services/mongodb";
import connect from "@/lib/data";
import { getStoreIdFromRequest } from "@/utilities/getStoreId";

export async function GET(request: NextRequest) {
  await connect();
  const storeId = getStoreIdFromRequest(request);
  try {
    const templates = await listMongoDBTemplates(storeId);
    return NextResponse.json(templates, { status: 200 });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch template directory contents" },
      { status: 500 }
    );
  }
}

// create new route
export async function POST(request: NextRequest) {
  await connect();
  const routeName = request.headers.get("filename");
  const storeId = getStoreIdFromRequest(request);

  if (!routeName) {
    return NextResponse.json(
      { error: "New route name is required" },
      { status: 400 }
    );
  }

  try {
    await createNewMongoJSON(routeName, storeId);

    return NextResponse.json(
      { message: "Route files created successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating route files:", error);
    return NextResponse.json(
      { error: "Failed to create route files" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  await connect();
  const routeName = request.headers.get("filename");
  const storeId = getStoreIdFromRequest(request);

  if (!routeName) {
    return NextResponse.json(
      { error: "Route name is required" },
      { status: 400 }
    );
  }

  try {
    await deleteMongoDBFile(routeName, storeId);

    return NextResponse.json(
      { message: "Route files deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting route files:", error);
    return NextResponse.json(
      { error: "Failed to delete route files" },
      { status: 500 }
    );
  }
}
