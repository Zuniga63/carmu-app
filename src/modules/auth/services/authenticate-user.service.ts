import type { ApiAuthResponse, AuthCredentials, AuthResponse } from '../interfaces';

import { API_URL } from '@/config';
import { createUserAdapter } from '../adapters';

interface Options {
  clientIp?: string;
  userAgent?: string;
}

export async function authenticateUserService(
  credentials: AuthCredentials,
  { clientIp, userAgent }: Options = {},
): Promise<AuthResponse> {
  const url = `${API_URL}/auth/local/signin`;
  console.log('url', url);

  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  if (clientIp) headers.append('x-forwarded-for', clientIp);
  if (userAgent) headers.append('user-agent', userAgent);

  const res = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(credentials),
    headers,
  });

  if (!res.ok) {
    let message = 'El servidor no responde correctamente';

    try {
      const data = await res.json();
      if (data.errorMessage) message = data.errorMessage;
    } catch (error) {
      console.log('Error al parsear el mensaje de error:', error);
    }

    throw new Error(message);
  }

  const data: ApiAuthResponse = await res.json();
  if (!data.user || !data.access_token) throw new Error('El servidor retorna ok pero no hay datos');

  return {
    user: createUserAdapter(data.user),
    accessToken: data.access_token,
    oldAccessToken: data.old_access_token,
  };
}
