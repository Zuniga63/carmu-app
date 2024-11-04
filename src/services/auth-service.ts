import axios from 'axios';
import { AuthResponse } from '@/types';
import { setAccesToken } from '@/logic/auth-logic';

export const authApi = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_URL_API}/auth/local` });
export const AUTHENTICATE_PATH = `/auth/local/is-authenticated`;


export async function validateToken(token: string) {
  setAccesToken(token);
  const res = await authApi.get<AuthResponse>('/is-authenticated');
  return res.data;
}
