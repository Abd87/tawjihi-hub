import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  
  // Protect /dashboard and /admin routes
  const isProtectedRoute = pathname.includes('/dashboard') || pathname.includes('/admin');
  const isAuthRoute = pathname.includes('/login') || pathname.includes('/register');

  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  let isValid = false;
  if (token) {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is missing');
      }
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      isValid = true;
    } catch (error) {
      console.error('Middleware JWT Verification failed:', error);
      isValid = false;
    }
  }

  // Helper to safely get the locale from pathname
  const getLocale = (path: string) => {
    const segment = path.split('/')[1];
    return ['ar', 'en'].includes(segment) ? segment : 'ar';
  };

  if (isProtectedRoute && !isValid) {
    const locale = getLocale(pathname);
    const response = NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    if (token) {
      response.cookies.delete('token'); // Clear invalid token
    }
    return response;
  }

  if (isAuthRoute && isValid) {
    const locale = getLocale(pathname);
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  const intlResponse = intlMiddleware(request);
  // Pass current URL to server components (Next.js specific pattern)
  intlResponse.headers.set('x-middleware-request-x-url', request.url);
  return intlResponse;
}

export const config = {
  // Match all pathnames except for static files, API routes, or _next assets
  matcher: ['/', '/(ar|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
