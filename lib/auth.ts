export interface DecodedToken {
  id: string;
  storeId?: string;
  exp: number;
}

export const verifyTokenServer = async (
  token: string
): Promise<DecodedToken | null> => {
  try {
    const response = await fetch("/api/verify-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const result = await response.json();
    return result.valid ? result.user : null;
  } catch {
    return null;
  }
};

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", token);
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
  }
};
