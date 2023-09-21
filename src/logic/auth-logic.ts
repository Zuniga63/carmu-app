import { authApi } from '@/services/auth-service';
import { boxesApi } from '@/services/boxes.service';
import { customerApi } from '@/services/customers.service';
import { premiseStoreApi } from '@/services/premise-store.service';
import { productApi } from '@/services/product.service';
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
  setAccesToken(token);
};

export const clearAuthToken = () => {
  setCookie('access_token', '', createCookieOptions(0));
  setAccesToken();
};

/**
 * Se encarga de agregar el header de authorizacion a las entidades axios de la app
 * @param token Token for acces to end points
 */
export const setAccesToken = (token?: string) => {
  const authorization = token ? `Bearer ${token}` : token;

  const axiosInstances = [axios, authApi, premiseStoreApi, boxesApi, customerApi, productApi];

  axiosInstances.forEach(instance => {
    instance.defaults.headers.common.Authorization = authorization;
  });
};
