import { NextResponse } from "next/server";
import connect from "@/lib/data";
import Blog from "@/models/blogs";


export const GET = async () => {
  await connect();
  if (!connect) {
    return new NextResponse("Database connection error", { status: 500 });
  }

  try {
    const blogs = await Blog.find({});
    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    return new NextResponse("Error fetching blogs"+error, { status: 500 });
  }
};
