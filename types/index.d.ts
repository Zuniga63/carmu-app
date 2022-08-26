import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

//-----------------------------------------------------------------------------
// GENERAL TYPES
//-----------------------------------------------------------------------------
export interface IImage {
  publicId: string;
  width: number;
  height: number;
  format: string;
  type: string;
  url: string;
}
//-----------------------------------------------------------------------------
// TYPES OF REDUX AND REDUX THUNK
//-----------------------------------------------------------------------------
export interface IAction {
  type: string;
  payload: unknown;
}

export type AppDispatch = ThunkDispatch<unknown, unknown, AnyAction>;
export type AppThunkAction = ThunkAction<void, unknown, unknown, AnyAction>;

//-----------------------------------------------------------------------------
// AUTH
//-----------------------------------------------------------------------------

export interface IUser {
  name: string;
  email: string;
  profilePhoto?: IImage;
  role: string;
}

export interface IAuthState {
  isAuth: boolean;
  user?: IUser;
  error: null | string;
  isAdmin: boolean;
  loading: boolean;
  loginIsSuccess: boolean;
}

interface AuthResponse {
  ok: boolean;
  message?: string;
  warnings?: string[];
  token?: string;
  user?: IUser;
}

export interface LoginData {
  email: string;
  password: string;
}
