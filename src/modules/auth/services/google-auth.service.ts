import type { ApiAuthResponse, AuthResponse } from '../interfaces';

import { API_URL } from '@/config';
import { createUserAdapter } from '../adapters';

interface Options {
  tokenId: string;
  clientIp?: string;
  userAgent?: string;
}

export async function googleAuthService({ tokenId, clientIp, userAgent }: Options): Promise<AuthResponse> {
  const url = `${API_URL}/auth/google/callback?id_token=${tokenId}`;
  const headers = new Headers();
  if (clientIp) headers.append('x-forwarded-for', clientIp);
  if (userAgent) headers.append('user-agent', userAgent);

  const res = await fetch(url, { headers });

  if (!res.ok) throw new Error('The google auth service is not responding correctly');

  const data: ApiAuthResponse = await res.json();
  if (!data.user || !data.access_token) throw new Error('The server returns ok but there is no data');

  return {
    user: createUserAdapter(data.user),
    accessToken: data.access_token,
    oldAccessToken: data.old_access_token,
  };
}
