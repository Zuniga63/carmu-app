import axios from 'axios';
import { AuthResponse, LoginData } from 'src/types';

export const AUTH_PATH = '/auth/local';
export const LOGIN_PATH = `${AUTH_PATH}/signin`;
export const AUTHENTICATE_PATH = `${AUTH_PATH}/is-authenticated`;

export async function authenticateUser(data: LoginData) {
  const res = await axios.post<AuthResponse>(LOGIN_PATH, data);
  return res.data;
}

export async function validateToken(token: string) {
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  return (await axios.get<AuthResponse>(AUTHENTICATE_PATH)).data;
}
