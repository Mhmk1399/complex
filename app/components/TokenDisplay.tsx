"use client";
import { useState, useEffect } from "react";
import { AITokenService } from "@/lib/aiTokenService";

interface TokenUsage {
  totalTokens: number;
  usedTokens: number;
  remainingTokens: number;
  lastUsed: Date;
}

export const TokenDisplay = () => {
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTokenUsage();
    
    // Refresh token usage every 30 seconds
    const interval = setInterval(fetchTokenUsage, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchTokenUsage = async () => {
    // Get storeId from token
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("No token found in localStorage");
      setLoading(false);
      return;
    }

    let storeId;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      storeId = payload.storeId;
      if (!storeId) {
        console.log("No storeId found in token");
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log("Invalid token format");
      setLoading(false);
      return;
    }

    try {
      setError(null);
      console.log("Fetching token usage for storeId:", storeId);
      const usage = await AITokenService.getTokenUsage(storeId);
      console.log("Token usage response:", usage);
      
      if (usage) {
        setTokenUsage(usage);
      } else {
        setError("No token data received");
      }
    } catch (error) {
      console.error("Error fetching token usage:", error);
      setError("Failed to load token data");
    } finally {
      setLoading(false);
    }
  };

  // Expose refresh function for external use
  useEffect(() => {
    (window as any).refreshTokenDisplay = fetchTokenUsage;
    return () => {
      delete (window as any).refreshTokenDisplay;
    };
  }, []);

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 animate-pulse">
        <div className="h-4 bg-blue-200 rounded w-24 mb-2"></div>
        <div className="h-3 bg-blue-100 rounded w-16"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <div className="text-sm text-red-600 text-center">
          خطا: {error}
        </div>
        <button 
          onClick={fetchTokenUsage}
          className="mt-2 text-xs text-red-500 hover:text-red-700 w-full"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (!tokenUsage) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="text-sm text-gray-500 text-center">
          توکن یافت نشد
        </div>
      </div>
    );
  }

  const percentage = (tokenUsage.remainingTokens / tokenUsage.totalTokens) * 100;
  const isLow = percentage < 20;

  return (
    <div className={`border rounded-lg p-3 ${
      isLow ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">توکن های AI</span>
        <span className={`text-xs px-2 py-1 rounded-full ${
          isLow ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
        }`}>
          {tokenUsage.remainingTokens} باقیمانده
        </span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            isLow ? 'bg-red-500' : 'bg-blue-500'
          }`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="text-xs text-gray-600">
        {tokenUsage.usedTokens} از {tokenUsage.totalTokens} استفاده شده
      </div>
    </div>
  );
};