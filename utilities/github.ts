import axios from "axios";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Add this to your .env file
const GITHUB_OWNER = "Mhmk1399";
const GITHUB_REPO = "userwebsite";

/**
 * Fetches the raw content of a file from the GitHub repository.
 * @param filePath - Path of the file in the repository (e.g., "public/template/homesm.json").
 * @returns The raw content of the file as a string.
 */
export async function fetchGitHubFile(filePath: string): Promise<string> {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;
    console.log("Fetching URL:", url);

    try {
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`, // Provide your GitHub token here
                Accept: "application/vnd.github.v3+json", // Fetch metadata (including content)
            },
            
        });

        // Extract Base64-encoded content and decode it
        const fileContent = response.data.content;
        const decodedContent = Buffer.from(fileContent, "base64").toString("utf-8");
        return decodedContent; // Return the decoded raw content of the file

    } catch (error: any) {
        console.error("Error fetching file from GitHub:", error.response?.data || error.message);

        if (error.response?.status === 404) {
            throw new Error(`File not found: ${filePath}`);
        }
        throw new Error("Failed to fetch file from GitHub");
    }
}

export async function saveGitHubFile(filePath: string, content: string): Promise<void> {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;

    try {
        // First get the current file to get its SHA (needed for updating)
        const currentFile = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3+json",
            },
        }).catch(() => null); // File might not exist yet

        const encodedContent = Buffer.from(content).toString('base64');
        
        const payload = {
            message: `Update ${filePath}`,
            content: encodedContent,
            ...(currentFile?.data?.sha && { sha: currentFile.data.sha }), // Include SHA if file exists
        };

        await axios.put(url, payload, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

    } catch (error: any) {
        console.error("Error saving file to GitHub:", error.response?.data || error.message);
        throw new Error("Failed to save file to GitHub");
    }
}

export async function deleteGitHubFile(filePath: string): Promise<void> {
    const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;

    try {
        // Get the current file to get its SHA (required for deletion)
        const currentFile = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        const payload = {
            message: `Delete ${filePath}`,
            sha: currentFile.data.sha
        };

        await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                Accept: "application/vnd.github.v3+json",
            },
            data: payload
        });

    } catch (error: any) {
        console.error("Error deleting file from GitHub:", error.response?.data || error.message);
        throw new Error("Failed to delete file from GitHub");
    }
}
