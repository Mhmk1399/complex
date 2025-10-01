import { getAuthToken, verifyTokenServer } from "@/lib/auth";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

export async function getStoreIdFromToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  // First try to get token from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const urlToken = urlParams.get("token");

  if (urlToken) {
    try {
      const decoded = jwt.decode(urlToken) as any;
      return decoded?.storeId || null;
    } catch (error) {
      console.error("Error decoding URL token:", error);
    }
  }

  // Fallback to stored token
  const token = getAuthToken();
  if (!token) return null;

  const decoded = await verifyTokenServer(token);
  return decoded?.storeId || null;
}

export function getStoreIdFromRequest(request: NextRequest): string {
  console.log(request , "rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr")
  const authHeader = request.headers.get("token");
  console.log(authHeader, "authHeader");
  if (authHeader) {
    try {
      const decoded = jwt.decode(authHeader) as any;
      console.log(decoded, "ddddddddddddddddddddddddddddddddddddd");
      return decoded?.storeId;
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  return "default-store";
}
