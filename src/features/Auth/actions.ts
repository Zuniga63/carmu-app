import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import { validateToken } from '@/services/auth-service';
import { getTokenFromCookies } from '@/logic/auth-logic';

export const authenticate = createAsyncThunk('auth/authenticate', async () => {
  const token = getTokenFromCookies();
  const result = await validateToken(token);
  return result;
});

export const logout = createAction('auth/logout');
export const authSuccessIsNotify = createAction('auth/authSuccessIsNotify');
