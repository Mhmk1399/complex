import { useState, useEffect } from 'react';
import { getAuthToken, verifyTokenServer, removeAuthToken } from '@/lib/auth';
import type { DecodedToken } from '@/lib/auth';

export const useAuth = () => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      if (token) {
        const decoded = await verifyTokenServer(token);
        if (decoded) {
          setUser(decoded);
        } else {
          removeAuthToken();
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const logout = () => {
    removeAuthToken();
    setUser(null);
    window.location.reload();
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    logout
  };
};