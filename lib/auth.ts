// Authentication utility functions
import { NextRequest } from 'next/server';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

// Token validation
export function validateToken(token: string | null): boolean {
  if (!token) return false;
  
  try {
    // Simple validation - in production, use JWT with secret
    const decoded = JSON.parse(atob(token.split('.')[1] || ''));
    const expiresAt = decoded.exp;
    
    if (!expiresAt) return false;
    
    // Check if token is expired
    const now = Date.now() / 1000;
    return now < expiresAt;
  } catch {
    return false;
  }
}

// Get user from token
export function getUserFromToken(token: string): User | null {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1] || ''));
    return {
      id: decoded.id,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role || 'user'
    };
  } catch {
    return null;
  }
}

// Create simple token (in production, use proper JWT library)
export function createToken(user: User): string {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    ...user,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
    iat: Math.floor(Date.now() / 1000)
  }));
  return `${header}.${payload}.signature`;
}

// Get auth from request headers
export function getAuthFromRequest(request: NextRequest): { user: User | null; token: string | null } {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '') || null;
  
  if (!token || !validateToken(token)) {
    return { user: null, token: null };
  }
  
  const user = getUserFromToken(token);
  return { user, token };
}

// Check if user is authenticated (for API routes)
export function requireAuth(request: NextRequest): { user: User; token: string } | null {
  const { user, token } = getAuthFromRequest(request);
  
  if (!user || !token) {
    return null;
  }
  
  return { user, token };
}

