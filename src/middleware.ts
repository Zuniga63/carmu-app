import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTHENTICATE_PATH } from './services/auth-service';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token');
  let isAuthenticated = false;
  const isLoginPage = request.nextUrl.pathname.startsWith('/login');

  if (token) {
    const apiUrl = process.env.NEXT_PUBLIC_URL_API;
    const url = `${apiUrl}${AUTHENTICATE_PATH}`;
    const headers = { Authorization: `Bearer ${token.value}` };

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
