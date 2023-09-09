import axios from 'axios';
import { AuthResponse, LoginData } from '@/types';

export const authApi = axios.create({ baseURL: `${process.env.NEXT_PUBLIC_URL_API}/auth/local` });
export const AUTHENTICATE_PATH = `/auth/local/is-authenticated`;

export async function authenticateUser(data: LoginData) {
  const res = await authApi.post<AuthResponse>('/signin', data);
  return res.data;
}

export async function validateToken(token: string) {
  authApi.defaults.headers.common.Authorization = `Bearer ${token}`;
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  const res = await authApi.get<AuthResponse>('/is-authenticated');
  return res.data;
}
