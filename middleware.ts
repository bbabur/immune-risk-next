import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Protected routes that require authentication
const protectedRoutes = [
  '/patients',
  '/training-data',
  '/profile',
  '/settings',
  '/model-info',
  '/anti-hbs',
  '/search',
  '/users',
];

// Routes that need exact match
const exactProtectedRoutes = ['/'];

// Protected API routes
const protectedApiRoutes = [
  '/api/patients',
  '/api/training-data',
  '/api/evaluate',
  '/api/stats',
  '/api/notifications',
  '/api/search',
];

// Public routes that don't need auth
const publicRoutes = [
  '/login',
  '/register',
  '/about',
  '/api/auth',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if it's a public route
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  // Check if it's a protected route (page or API)
  const isProtectedPage = protectedRoutes.some(route => pathname.startsWith(route)) ||
                          exactProtectedRoutes.includes(pathname);
  const isProtectedApi = protectedApiRoutes.some(route => pathname.startsWith(route));
  
  if (!isProtectedPage && !isProtectedApi) {
    // Allow _next and static files
    if (pathname.startsWith('/_next') || pathname.startsWith('/static')) {
      return NextResponse.next();
    }
  }
  
  // For protected routes, check authentication
  if (isProtectedPage || isProtectedApi) {
    // Get token from cookie or header
    const cookieToken = request.cookies.get('token')?.value;
    const headerToken = request.headers.get('authorization')?.replace('Bearer ', '');
    const token = cookieToken || headerToken;
    
    // Debug log (production'da console.log çalışır, Render logs'ta görünür)
    console.log(`[Middleware] Path: ${pathname}, Cookie token: ${cookieToken ? 'exists' : 'missing'}, Header token: ${headerToken ? 'exists' : 'missing'}`);
    
    if (!token) {
      if (isProtectedApi) {
        return NextResponse.json(
          { error: 'Unauthorized', message: 'Giriş yapmalısınız' },
          { status: 401 }
        );
      }
      
      // Redirect to login for page routes
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
    
    // Validate token
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        const expiresAt = payload.exp;
        const now = Date.now() / 1000;
        
        if (now >= expiresAt) {
          // Token expired
          if (isProtectedApi) {
            return NextResponse.json(
              { error: 'Token expired', message: 'Oturumunuz sona erdi' },
              { status: 401 }
            );
          }
          
          const url = request.nextUrl.clone();
          url.pathname = '/login';
          url.searchParams.set('redirect', pathname);
          url.searchParams.set('expired', 'true');
          return NextResponse.redirect(url);
        }
      }
    } catch (error) {
      // Invalid token
      if (isProtectedApi) {
        return NextResponse.json(
          { error: 'Invalid token' },
          { status: 401 }
        );
      }
      
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

