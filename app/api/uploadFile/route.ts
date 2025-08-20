import { NextResponse , NextRequest} from "next/server";
import connect from "@/lib/data";
import Files from "@/models/uploads";
import jwt, { JwtPayload } from "jsonwebtoken";
interface CustomJwtPayload extends JwtPayload {
  storeId: string;
}
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    let decodedToken: CustomJwtPayload;
    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET || "your-jwt-secret") as CustomJwtPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return NextResponse.json({ message: "JWT token expired" }, { status: 401 });
      }
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    if (!decodedToken?.storeId) {
      return NextResponse.json({ message: "Invalid token payload" }, { status: 401 });
    }

    const flaskUrl = `${process.env.VPS_URL}/image/images/${decodedToken.storeId}`;
    
    const flaskRes = await fetch(flaskUrl, {
      headers: {
        Authorization: `Bearer ${process.env.VPS_TOKEN || "your-secret-token"}`
      }
    });

    if (!flaskRes.ok) {
      return NextResponse.json({ message: "Failed to fetch images from Flask" }, { status: flaskRes.status });
    }

    const data = await flaskRes.json();

    return NextResponse.json({ 
      images: data,
      // storeId: decodedToken.storeId 
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching images from Flask:", error);
    return NextResponse.json({ message: "Internal server error", error: String(error) }, { status: 500 });
  }
}
