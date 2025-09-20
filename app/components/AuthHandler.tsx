'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyTokenServer, setAuthToken, getAuthToken } from '@/lib/auth';

interface AuthHandlerProps {
  children: React.ReactNode;
}

export default function AuthHandler({ children }: AuthHandlerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const tokenFromUrl = searchParams.get('token');
      const existingToken = getAuthToken();
      
      // If no token at all, redirect to dashboard
      if (!existingToken && !tokenFromUrl) {
        const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://dashboard.example.com';
        window.location.href = dashboardUrl;
        return;
      }
      
      if (tokenFromUrl) {
        // Verify token from URL
        const decoded = await verifyTokenServer(tokenFromUrl);
        if (decoded) {
          setAuthToken(tokenFromUrl);
          // Remove token from URL and refresh
          const url = new URL(window.location.href);
          url.searchParams.delete('token');
          window.location.href = url.toString();
          return;
        } else {
          setError('Invalid token');
          setIsLoading(false);
          return;
        }
      }

      // Check existing token in localStorage
      if (existingToken) {
        const decoded = await verifyTokenServer(existingToken);
        if (decoded) {
          setIsAuthenticated(true);
        } else {
          setError('Session expired');
        }
      } else {
        // Redirect to dashboard for authentication
        const dashboardUrl = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://dashboard.example.com';
        window.location.href = dashboardUrl;
        return;
      }
      
      setIsLoading(false);
    };

    handleAuth();
  }, [searchParams, router]);


  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Please authenticate to access this application.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}