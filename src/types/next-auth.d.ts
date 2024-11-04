import NextAuth from 'next-auth';
import { User } from '@/modules/auth/interfaces';

declare module 'next-auth' {
  interface Session {
    user: User;
    accessToken?: string;
    refreshToken?: string;
    oldAccessToken?: string;
  }
}