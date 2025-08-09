import axios from "axios";
import { json } from "stream/consumers";

export function getStoreIdFromUrl(url: string | null): string {
  if (!url) return "userwebsite"; // default fallback

  try {
    const decodedUrl = decodeURIComponent(url);
    return decodedUrl.split("/").pop() || "userwebsite";
  } catch {
    return "userwebsite";
  }
}


export function getVpsFromUrl(url: string | null): string {
  if (!url) return "http://default.com"; // fallback

  try {
    const decodedUrl = decodeURIComponent(url);
    const firstSlashIndex = decodedUrl.indexOf("/", decodedUrl.indexOf("//") + 2);
    return firstSlashIndex !== -1
      ? decodedUrl.slice(0, firstSlashIndex)
      : decodedUrl;
  } catch {
    return "http://default.com";
  }
}



export async function deleteDiskFile(
  filename: string,
  DiskUrl: string
): Promise<void> {
  

  const storeId = getStoreIdFromUrl(DiskUrl);
  const vpsUrl = getVpsFromUrl(DiskUrl);
  const url = `${vpsUrl}/json/${storeId}/${filename}`;

  try {
    // Get the current file to get its SHA (required for deletion)


    await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${process.env.VPS_TOKEN}`,
      }
    });
  } catch (error: any) {
    console.error(
      "Error deleting file from disk:",
      error.response?.data || error.message
    );
    throw new Error("Failed to delete file from disk");
  }
}

//done
export async function listDiskTemplates(DiskUrl: string) {
  if (!DiskUrl) {
    throw new Error("Missing DiskUrl");
  }

  const storeId = getStoreIdFromUrl(DiskUrl);
  const vpsUrl = getVpsFromUrl(DiskUrl);
  const url = `${vpsUrl}/json/${storeId}/`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.VPS_TOKEN}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData?.detail || "Failed to list templates");
  }

  const data = await response.json();
  return data;
}




export async function createNewJson(
  filename: string,
  DiskUrl?: string
): Promise<void> {
  const storeId = getStoreIdFromUrl(DiskUrl || null);
  const vpsUrl = getVpsFromUrl(DiskUrl || null);
  const endpoint = `${vpsUrl}/json/${storeId}/${filename}`;
  const token = process.env.VPS_TOKEN || "your-secret-token";

  try {
    const defaultData = {
  "children": {
    "type": "about",
     "metaData":{
      "title":"juju",
      "description":"juju page"
    },
    "sections": [

    ],
    "order": []
  }
}

    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(defaultData),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(
        `Failed to save file. Status: ${response.status}, Body: ${text}`
      );
    }
  } catch (error) {
    console.error("Error saving to store:", error);
  }
}



//get json file content
export async function fetchFromStore(filename: string, DiskUrl: string): Promise<string> {



  const storeId = getStoreIdFromUrl(DiskUrl || null)
  const VPS_URL =  getVpsFromUrl(DiskUrl || null)

  const endpoint = `${VPS_URL}/json/${storeId}/${filename}`;
  const token = process.env.VPS_TOKEN || 'your-secret-token'; // Use ENV for security

  console.log(filename, "filenameaaaaaa")


  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${filename} — Status ${response.status}`);
  }

  return await response.text(); // or .json() if you're sure all responses are valid JSON
}


//update json 
export async function saveToStore(
  filename: string,
  DiskUrl: string,
  newLayout: object
): Promise<void> {

  const storeId = getStoreIdFromUrl(DiskUrl)
  const VPS_URL =  getVpsFromUrl(DiskUrl)
  const token = process.env.VPS_TOKEN || "your-secret-token";

  const endpoint = `${VPS_URL}/json/${storeId}/${filename}` || "";

  console.log(newLayout,"body on disk utils")

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newLayout),
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



