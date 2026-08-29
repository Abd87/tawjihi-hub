import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  
  // Define route types
  const isParentRoute = pathname.includes('/parent/dashboard');
  const isDashboardRoute = pathname.includes('/dashboard') && !isParentRoute;
  const isAdminRoute = pathname.includes('/admin');
  const isStudioRoute = pathname.includes('/studio');
  const isAuthRoute = pathname.includes('/login') || pathname.includes('/register');
  
  const requiresAuth = isDashboardRoute || isParentRoute || isAdminRoute || isStudioRoute;

  // Skip middleware for API routes and static files
  if (pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  let isValid = false;
  let userRole = '';
  
  if (token) {
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is missing');
      }
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      const { payload } = await jwtVerify(token, secret);
      isValid = true;
      userRole = (payload.role as string) || '';
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

  if (requiresAuth && !isValid) {
    const locale = getLocale(pathname);
    const response = NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    if (token) {
      response.cookies.delete('token'); // Clear invalid token
    }
    return response;
  }
  
  // Role-based protection
  if (isValid) {
    if (isAdminRoute && userRole !== 'ADMIN') {
      const locale = getLocale(pathname);
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
    
    if (isStudioRoute && userRole !== 'ADMIN' && userRole !== 'TEACHER') {
      const locale = getLocale(pathname);
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }

    if (isParentRoute && userRole !== 'PARENT') {
      const locale = getLocale(pathname);
      return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
    }
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
