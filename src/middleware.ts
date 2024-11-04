import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

import { isApiTokenValid } from './modules/auth/utils';

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname, origin } = req.nextUrl;

    const isAuthenticated = !!token;
    const isAuthPage = ['/auth/signin', '/auth/signup'].includes(pathname);

    // Redirigir usuarios autenticados fuera de páginas de auth
    if (isAuthPage && isAuthenticated) {
      return NextResponse.redirect(`${origin}/`);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        const isAuthenticated = !!token;
        const isAuthPage = ['/auth/signin', '/auth/signup'].includes(pathname);

        // Lógica simplificada para páginas de autenticación
        if (isAuthPage) return !isAuthenticated;

        // Para todas las demás rutas, verificar autenticación y token
        return isAuthenticated && isApiTokenValid(token.accessToken as string);
      },
    },
    pages: {
      signIn: '/auth/signin',
      newUser: '/auth/signup',
    },
  },
);

export const config = {
  matcher: [
    '/auth/signin',
    '/auth/signup',
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
