import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  let isAuthenticated = false;
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  if (token) {
    const baseUrl = process.env.NEXT_PUBLIC_URL_API;
    const url = `${baseUrl}/auth/local/is-authenticated`;
    const headers = { Authorization: `Bearer ${token}` };
    try {
      const res = await fetch(url, { headers });
      const data = await res.json();
      isAuthenticated = !!data.ok;
    } catch (error) {
      console.log(error);
    }
  }

  if (isLoginPage && isAuthenticated) return NextResponse.redirect(new URL('/', request.url));
  if ((isLoginPage && !isAuthenticated) || isAuthenticated) return NextResponse.next();
  else return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: ['/', '/login', '/admin/:path*'],
};
