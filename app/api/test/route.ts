import { fetchGitHubFile } from "@/utilities/github";

export async function GET() {
    const repoUrl = "https://github.com/Mhmk1399/userwebsite";
    const fileContent = await fetchGitHubFile("storeId.txt", repoUrl);


  return new Response(fileContent);
}
