import axios from 'axios';
import { getCookie, setCookie } from 'cookies-next';

export function getTokenFromCookies() {
  const cookieValue = getCookie('access_token');
  if (typeof cookieValue !== 'string') return '';
  return cookieValue;
}

/**
 * Build a option for next-cookie
 * @param duration Time in day of duration of cookie in the browser, default 1 day
 * @returns
 */
export function createCookieOptions(duration = 1) {
  return {
    path: '/',
    sameSite: true,
    maxAge: 60 * 60 * 24 * duration,
  };
}

export const saveAuthToken = (token: string) => {
  setCookie('access_token', token, createCookieOptions(30));
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  setCookie('access_token', '', createCookieOptions(0));
  axios.defaults.headers.common.Authorization = '';
};
