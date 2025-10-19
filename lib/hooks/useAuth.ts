'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export function useAuth(redirectTo: string = '/login') {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    const userToken = localStorage.getItem('token');
    
    if (!userData || !userToken) {
      router.push(redirectTo);
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      
      // Validate token expiration
      const tokenParts = userToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        const expiresAt = payload.exp;
        const now = Date.now() / 1000;
        
        if (now >= expiresAt) {
          // Token expired
          logout();
          return;
        }
      }
      
      setUser(parsedUser);
      setToken(userToken);
    } catch (error) {
      console.error('Auth error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [router, redirectTo]);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    router.push('/login');
  };

  const login = (userData: User, userToken: string) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    setUser(userData);
    setToken(userToken);
  };

  return { user, loading, token, logout, login, isAuthenticated: !!user };
}

