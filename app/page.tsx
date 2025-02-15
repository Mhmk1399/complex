"use client";
import { Main } from "./components/main";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function HomeContent() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const repoUrl = searchParams.get("repoUrl");
        const existingToken = localStorage.getItem("complexToken");

        if (existingToken) {
          setToken(existingToken);
          setIsLoading(false);
          return;
        }

        if (!repoUrl) {
          setError("No repository URL provided");
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `/api/genrateToken?repoUrl=${encodeURIComponent(repoUrl)}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch token");
        }

        const data = await response.json();
        console.log(token)

        if (data.token) {
          setToken(data.token);
          localStorage.setItem("complexToken", data.token);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error generating token";
        setError(errorMessage);
        console.error("Error generating token:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, [searchParams]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return <Main />;
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
