import Enamad from "@/models/enamad";
import { NextRequest, NextResponse } from "next/server";
import connect from "@/lib/data";
// Import GET as GetStoreId from the test route:
import { GET as GetStoreId } from "../test/route";

export async function GET(req: NextRequest) {
  try {
    await connect();
    console.log("Connected to MongoDB");
    if (!connect) {
      return NextResponse.json({ error: "Failed to connect to database" });
    }
    console.log(req);
    
    // Call GetStoreId as a normal async function.
    const storeIdResult = await GetStoreId();
    
    // If GetStoreId returns a Response (indicating an error) handle it:
    if (storeIdResult instanceof Response) {
      return storeIdResult;
    }
    
    // Otherwise, we assume storeIdResult is the file's content (storeId)
    const storeId = storeIdResult;
    console.log("storeId", storeId);
    const enamads = await Enamad.find({ storeId: storeId });
    return NextResponse.json(enamads);
  } catch (error) {
    console.error("Error fetching enamads:", error);
    return NextResponse.json({ error: "Failed to fetch enamads" });
  }
}
