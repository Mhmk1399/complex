import { NextRequest, NextResponse } from "next/server";
import { roleMiddleware } from "@/middlewares/decodeToken";
import images from "@/models/uploads";
import connect from "@/lib/data";

interface ImageData {
  id: string;
  filename: string;
  url: string;
  uploadedAt: Date;
  size: number;
}

interface UploadResponse {
  success: boolean;
  url?: string;
  message?: string;
  error?: string;
  status?: number;
  images?: ImageData[];
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<UploadResponse>> {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Authentication token required" },
        { status: 401 }
      );
    }

    const storeId = await roleMiddleware(token);
    if (typeof storeId !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    await connect();

    const imagesList = await images.find({ storeId }).sort({ uploadDate: -1 });

    const formattedImages = imagesList.map((img) => ({
      id: img._id.toString(),
      filename: img.imagesName,
      url: img.imagesUrl,
      uploadedAt: img.uploadDate,
      size: img.imagesize,
    }));

    return NextResponse.json({
      success: true,
      images: formattedImages,
    });
  } catch (error) {
    console.error("Fetch images error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// export async function DELETE(
//   request: NextRequest
// ): Promise<NextResponse<UploadResponse>> {
//   try {
//     const token = request.headers.get("authorization")?.replace("Bearer ", "");

//     if (!token) {
//       return NextResponse.json(
//         { success: false, error: "Authentication token required" },
//         { status: 401 }
//       );
//     }

//     const storeId = await roleMiddleware(token);
//     if (typeof storeId !== "string") {
//       return NextResponse.json(
//         { success: false, error: "Invalid token" },
//         { status: 401 }
//       );
//     }

//     const { fileId } = await request.json();

//     if (!fileId) {
//       return NextResponse.json(
//         { success: false, error: "File ID required" },
//         { status: 400 }
//       );
//     }

//     await connect();

//     // Find the file record
//     const fileRecord = await images.findOne({ _id: fileId, storeId });

//     if (!fileRecord) {
//       return NextResponse.json(
//         { success: false, error: "File not found" },
//         { status: 404 }
//       );
//     }

//     // Extract object name from URL for bucket deletion
//     const url = fileRecord.imagesUrl;
//     const objectName = url.split('/').slice(-2).join('/'); // gets "uploads/filename"

//     const accessKey = process.env.ARVAN_ACCESS_KEY;
//     const secretKey = process.env.ARVAN_SECRET_KEY;
//     const bucketName = process.env.ARVAN_BUCKET_NAME || "mamad";

//     if (!accessKey || !secretKey) {
//       return NextResponse.json(
//         { success: false, error: "Missing ArvanCloud credentials" },
//         { status: 500 }
//       );
//     }

//     // Delete from bucket
//     const dateValue = new Date().toUTCString();
//     const resource = `/${bucketName}/${objectName}`;
//     const stringToSign = `DELETE\n\n\n${dateValue}\n${resource}`;

//     const signature = crypto
//       .createHmac("sha1", secretKey)
//       .update(stringToSign)
//       .digest("base64");

//     const deleteUrl = `https://${bucketName}.s3.ir-thr-at1.arvanstorage.ir/${objectName}`;

//     const response = await fetch(deleteUrl, {
//       method: "DELETE",
//       headers: {
//         Host: `${bucketName}.s3.ir-thr-at1.arvanstorage.ir`,
//         Date: dateValue,
//         Authorization: `AWS ${accessKey}:${signature}`,
//       },
//     });

//     // Delete from database regardless of bucket response
//     await images.findByIdAndDelete(fileId);

//     return NextResponse.json({
//       success: true,
//       message: "File deleted successfully",
//     });
//   } catch (error) {
//     console.error("Delete error:", error);
//     return NextResponse.json(
//       { success: false, error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
