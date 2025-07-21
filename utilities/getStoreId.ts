import { fetchGitHubFile } from "@/services/disk";
import { NextRequest } from "next/server";

export async function GetStoreId(request:NextRequest) {
    const repoUrl = request.headers.get("repoUrl");
  if (!repoUrl) {
    return new Response("Repository URL not provided", { status: 400 });
  }
  const fileContent = await fetchGitHubFile("storeId.txt", repoUrl);
  if (!fileContent) {
    return new Response("File not found", { status: 404 });
  }
  // Wrap fileContent in a Response so the type is Response.
  return new Response(fileContent, { status: 200 });
}