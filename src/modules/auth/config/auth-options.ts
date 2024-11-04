import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { AuthProvidersEnum } from './auth-providers.enum';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from './constants';
import { authenticateUserService, googleAuthService } from '../services';
import { getClientDataFromReq, isApiTokenValid } from '../utils';

export const authOptions = (req?: Request): NextAuthOptions => ({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'your-email',
        },
        password: {
          label: 'Password:',
          type: 'password',
          placeholder: 'your-awesome-password',
        },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // ? Se recupera la informacion del usuario, el token
        const { email, password } = credentials;
        const { ip: clientIp, userAgent } = getClientDataFromReq(req);

        console.log('clientIp', clientIp, 'userAgent', userAgent);

        const auth = await authenticateUserService({ email, password }, { clientIp, userAgent });
        if (!auth) return null;

        // ? Se retorna el usuario con los datos necesarios para la sesion
        return { ...auth.user, accessToken: auth.accessToken, oldAccessToken: auth.oldAccessToken };
      },
    }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'select_account',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // ? Cuando se inicia sesion por primera vez se ejecuta esta funcion y los datos llegan con user
      // ? Cuando se refresca la pagina se ejecuta esta funcion y los datos llegan con token
      if (typeof user === 'undefined') {
        const isValid = isApiTokenValid(token?.accessToken as string);
        return isValid ? token : {};
      }

      if (account?.provider === AuthProvidersEnum.GOOGLE) {
        const { id_token } = account;
        if (!id_token) return {};

        const { ip: clientIp, userAgent } = getClientDataFromReq(req);
        const authData = await googleAuthService({ clientIp, userAgent, tokenId: id_token as string });

        return { ...authData.user, accessToken: authData.accessToken, oldAccessToken: authData.oldAccessToken };
      }

      return { ...user };
    },
    async session({ session, token }) {
      // ? Se verifica si el token es valido
      const { accessToken, oldAccessToken } = token;
      const tokenIsValid = isApiTokenValid(accessToken as string | undefined);
      if (!tokenIsValid) return { user: undefined, expires: new Date(0).toISOString() };

      // ? Se retiran los campos innecesarios del token y que se retorna el usuario
      // ? con los datos necesarios para la sesion
      const sanitizedUser = Object.keys(token).reduce((p, c) => {
        if (c !== 'iat' && c !== 'exp' && c !== 'jti' && c !== 'accessToken' && c !== 'refreshToken' && c !== 'oldAccessToken') {
          return { ...p, [c]: token[c] };
        } else {
          return p;
        }
      }, {});

      return { ...session, user: sanitizedUser, accessToken, oldAccessToken };
    },
  },
  pages: {
    signIn: '/auth/signin',
    newUser: '/auth/signup',
  },
});
