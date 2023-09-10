import { IImage } from '@/types';

export interface IUser {
  id: string;
  name: string;
  email: string;
  profilePhoto?: IImage;
  role: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  ok: boolean;
  message?: string;
  warnings?: string[];
  token?: string;
  user?: IUser;
}

export type AuthErrorResponse = {
  ok: boolean;
  message: string;
};

export type AuthState = {
  isAuth: boolean;
  user?: IUser;
  error: null | string;
  isAdmin: boolean;
  loading: boolean;
  authIsSuccess: boolean;
};

// ----------------------------------------------------------------------------
// AUTH STORE
// ----------------------------------------------------------------------------
export interface IAuthState {
  isAuth: boolean;
  user?: IUser;
  isAdmin: boolean;
}

export interface IAuthActions {
  saveCredentials: ({ user, token }: CredentialProps) => void;
  clearCredentials: () => void;
  updateUser: (user: User) => void;
}

export type CredentialProps = {
  user: IUser;
  token: string;
};
