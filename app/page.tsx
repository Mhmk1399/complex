"use client";
import { Main } from "./components/main";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function HomeContent() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const repoUrl = searchParams.get('repoUrl');
        
        if (!repoUrl) {
          console.error('No repository URL provided');
          setIsLoading(false);
          return;
        }

        const response = await fetch(`/api/genrateToken?repoUrl=${encodeURIComponent(repoUrl)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch token');
        }

        const data = await response.json();
        
        if (data.token) {
          setToken(data.token);
          localStorage.setItem('complexToken', data.token);
        }
      } catch (error) {
        console.error('Error generating token:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchToken();
  }, [searchParams]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return token ? <Main /> : <div>Token generation failed</div>;
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
