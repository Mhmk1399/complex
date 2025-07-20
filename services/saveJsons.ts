export async function saveToStore(
  filename: string,
  storeId: string,
  data: object
): Promise<void> {
  const endpoint = "  http://91.216.104.8:5002/json";
  const token = process.env.STORE_API_TOKEN || "your-secret-token";

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        storeId: storeId,
        filename: filename,
      },
      body: JSON.stringify(data),
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
