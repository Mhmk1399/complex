import { fetchGitHubFile } from "@/utilities/github";

async function GetStoreId() {
  const repoUrl = "https://github.com/Mhmk1399/userwebsite";
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

export const GET = GetStoreId;
