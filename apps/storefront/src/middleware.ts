import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/dashboard', '/my-courses', '/my-downloads', '/subscription', '/profile'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('_medusa_jwt')?.value;
  const pathname = request.nextUrl.pathname;

  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/my-courses/:path*',
    '/my-downloads/:path*',
    '/subscription/:path*',
    '/profile/:path*',
  ],
};
