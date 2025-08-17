// import Enamad from "@/models/enamad";
// import { NextRequest, NextResponse } from "next/server";
// import connect from "@/lib/data";
// // Import GET as GetstoreId from the test route:
// import { GetstoreId } from "@/utilities/getstoreId";
// export async function GET(request: NextRequest) {
//   try {
//     await connect();
//     console.log("Connected to MongoDB");
//     if (!connect) {
//       return NextResponse.json({ error: "Failed to connect to database" });
//     }
    
    
    
//     const storeId = await GetstoreId(request);
//     console.log("storeId", storeId);
//     const enamads = await Enamad.find({ storeId: storeId });
//     return NextResponse.json(enamads);
//   } catch (error) {
//     console.error("Error fetching enamads:", error);
//     return NextResponse.json({ error: "Failed to fetch enamads" });
//   }
// }
