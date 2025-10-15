"use client";
import { useState, useEffect } from 'react';
import { AITokenService } from '@/lib/aiTokenService';

interface TokenUsage {
  totalTokens: number;
  usedTokens: number;
  remainingTokens: number;
  lastUsed: Date;
}

export const useTokens = () => {
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenUsage = async () => {
    // Get storeId from token
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Token not found");
      setLoading(false);
      return;
    }

    let storeId;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      storeId = payload.storeId;
      if (!storeId) {
        setError("Store ID not found in token");
        setLoading(false);
        return;
      }
    } catch (error) {
      setError("Invalid token format");
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const usage = await AITokenService.getTokenUsage(storeId);
      setTokenUsage(usage);
    } catch (err) {
      setError("Failed to fetch token usage");
      console.error("Error fetching token usage:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkTokens = async (requiredTokens?: number): Promise<boolean> => {
    // Get storeId from token
    const token = localStorage.getItem("token");
    if (!token) return false;

    let storeId;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      storeId = payload.storeId;
      if (!storeId) return false;
    } catch (error) {
      return false;
    }

    try {
      return await AITokenService.hasEnoughTokens(storeId, requiredTokens);
    } catch (error) {
      console.error("Error checking tokens:", error);
      return false;
    }
  };

  const refreshTokens = () => {
    fetchTokenUsage();
  };

  useEffect(() => {
    fetchTokenUsage();
  }, []);

  return {
    tokenUsage,
    loading,
    error,
    checkTokens,
    refreshTokens,
    hasTokens: tokenUsage ? tokenUsage.remainingTokens > 0 : false,
    isLowOnTokens: tokenUsage ? (tokenUsage.remainingTokens / tokenUsage.totalTokens) < 0.2 : false,
  };
};