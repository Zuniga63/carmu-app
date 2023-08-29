import { createAsyncThunk, createAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { LoginData } from './types';
import { authenticateUser, validateToken } from 'src/services/auth-service';
import { getTokenFromCookies } from 'src/logic/auth-logic';

export const signin = createAsyncThunk('auth/signin', async (data: LoginData, { rejectWithValue }) => {
  try {
    const res = await authenticateUser(data);
    return res;
  } catch (error) {
    if (!axios.isAxiosError(error) || !error.response) throw error;
    return rejectWithValue(error.response.data);
  }
});

export const authenticate = createAsyncThunk('auth/authenticate', async () => {
  const token = getTokenFromCookies();
  const result = await validateToken(token);
  return result;
});

export const logout = createAction('auth/logout');
export const authSuccessIsNotify = createAction('auth/authSuccessIsNotify');
