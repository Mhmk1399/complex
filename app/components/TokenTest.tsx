"use client";
import { useState } from "react";
import { AITokenService } from "@/lib/aiTokenService";

export const TokenTest = () => {
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testTokens = async () => {
    setLoading(true);
    const storeId = localStorage.getItem("storeId") || "test-store-123";
    
    try {
      // Test getting token usage
      const usage = await AITokenService.getTokenUsage(storeId);
      setResult(JSON.stringify(usage, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const initializeTokens = async () => {
    setLoading(true);
    const storeId = localStorage.getItem("storeId") || "test-store-123";
    localStorage.setItem("storeId", storeId);
    
    try {
      // Initialize tokens by calling the API
      const response = await fetch('/api/ai-usage/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId })
      });
      
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white">
      <h3 className="font-bold mb-4">Token System Test</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={initializeTokens}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Initialize Tokens
        </button>
        
        <button
          onClick={testTokens}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Get Tokens
        </button>
      </div>

      <div className="text-sm">
        <strong>Store ID:</strong> {localStorage.getItem("storeId") || "Not set"}
      </div>

      {result && (
        <pre className="mt-4 p-2 bg-gray-100 rounded text-xs overflow-auto">
          {result}
        </pre>
      )}
    </div>
  );
};