import axios from "axios";

function getStoreIdFromUrl(url: string | null): string {
  if (!url) return "userwebsite"; // default fallback

  try {
    const decodedUrl = decodeURIComponent(url);
    return decodedUrl.split("/").pop() || "userwebsite";
  } catch {
    return "userwebsite";
  }
}


function getVpsFromUrl(url: string | null): string {
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
  const url = `${vpsUrl}/create-json`;

  try {
    // Get the current file to get its SHA (required for deletion)


    await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${process.env.VPS_TOKEN}`,
        storeId: storeId,
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
  const storeId = getStoreIdFromUrl(DiskUrl || null);
  const vpsUrl = getVpsFromUrl(DiskUrl || null);
  const url = `${vpsUrl}/list-json`;

try {
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${process.env.VPS_TOKEN}`,
      storeId: storeId,
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
  DiskUrl?: string
  // storeId: string
): Promise<void> {

  const storeId = getStoreIdFromUrl(DiskUrl || null);
  const vpsUrl = getVpsFromUrl(DiskUrl || null);

  const endpoint = `${vpsUrl}/create-json` || "";
  const token = process.env.VPS_TOKEN || "your-secret-token";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        storeId: storeId,
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



export async function fetchFromStore(filename: string, DiskUrl: string): Promise<string> {



  const storeId = getStoreIdFromUrl(DiskUrl || null)
  const VPS_URL =  getVpsFromUrl(DiskUrl || null)

  const endpoint = `${VPS_URL}/json`;
  const token = process.env.VPS_TOKEN || 'your-secret-token'; // Use ENV for security

  console.log(token)

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      storeId: storeId,
      'filename': filename,
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch file: ${filename} — Status ${response.status}`);
  }

  return await response.text(); // or .json() if you're sure all responses are valid JSON
}



export async function saveToStore(
  filename: string,
  DiskUrl: string,
  newLayout: object
): Promise<void> {

  const storeId = getStoreIdFromUrl(DiskUrl)
  const VPS_URL =  getVpsFromUrl(DiskUrl)
  const token = process.env.STORE_API_TOKEN || "your-secret-token";

  const endpoint = `${VPS_URL}/json` || "";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        storeId: storeId,
        filename: filename,
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



