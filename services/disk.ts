import axios from "axios";
import { env } from "process";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Add this to your .env file
const GITHUB_OWNER = "Mhmk1399";

/**
 * Fetches the raw content of a file from the GitHub repository.
 * @param filePath - Path of the file in the repository (e.g., "public/template/homesm.json").
 * @returns The raw content of the file as a string.
 */

function getStoreIdFromUrl(url: string | null): string {
  if (!url) return "userwebsite"; // default fallback

  try {
    const decodedUrl = decodeURIComponent(url);
    return decodedUrl.split("/").pop() || "userwebsite";
  } catch {
    return "userwebsite";
  }
}





export async function deleteDiskFile(
  filename: string,
  StoreId: string
): Promise<void> {
  
  const url = `${process.env.VPS_URL}/create-json`;

  try {
    // Get the current file to get its SHA (required for deletion)


    await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${process.env.VPS_TOKEN}`,
        StoreId: StoreId,
        filename: filename
      }
    });
  } catch (error: any) {
    console.error(
      "Error deleting file from GitHub:",
      error.response?.data || error.message
    );
    throw new Error("Failed to delete file from GitHub");
  }
}

//done
export async function listDiskTemplates(DiskUrl?: string): Promise<string[]> {
  const STORE_ID = getStoreIdFromUrl(DiskUrl || null);
  const url = `${process.env.VPS_URL}/list-json`;

try {
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.VPS_TOKEN}`,
      storeId: STORE_ID,
      Accept: "application/json",
    },
  });

  return response.data.json_files ?? []; 

} catch (error: any) {
  console.error(
    "Error listing templates from VPS:",
    error.response?.data || error.message
  );
  throw new Error("Failed to list templates from VPS");
}

}



export async function createNewJson(
  filename: string,
  // storeId: string
): Promise<void> {
  const endpoint = `${process.env.VPS_URL}/create-json` || "";
  const token = process.env.VPS_TOKEN || "your-secret-token";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        storeId: 'storemdbrstve5d4941',
        filename: filename,
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Failed to save file. Status: ${response.status}, Body: ${text}`
      );
    }
  } catch (error) {
    console.log(error)
    console.error("Error saving to store:", error);
  }
}





