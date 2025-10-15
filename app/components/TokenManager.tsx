"use client";
import { useEffect, useState } from "react";
import { TokenDisplay } from "./TokenDisplay";
import { TokenTest } from "./TokenTest";

export const TokenManager = () => {
  const [storeId, setStoreId] = useState<string>("");

  useEffect(() => {
    // Get storeId from token
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentStoreId = payload.storeId;
      
      if (currentStoreId) {
        setStoreId(currentStoreId);
        // Initialize tokens for this store
        initializeTokens(currentStoreId);
      }
    } catch (error) {
      console.log("Invalid token format");
    }
  }, []);

  const initializeTokens = async (storeId: string) => {
    try {
      await fetch('/api/ai-usage/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId })
      });
    } catch (error) {
      console.error("Error initializing tokens:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600">
        Store ID: {storeId}
      </div>
      
      <TokenDisplay />
      
      {process.env.NODE_ENV === 'development' && (
        <TokenTest />
      )}
    </div>
  );
};