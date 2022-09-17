import { Dayjs } from 'dayjs';
import { AnyAction } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Socket } from 'socket.io-client';

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

export interface IValidationErrors {
  [key?: string]: {
    name: string;
    message: string;
    kind: string;
    path: string;
    value: unknown;
  };
}

export interface IValidationErrorResponse {
  ok: boolean;
  message: string;
  validationErrors: IValidationErrors;
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

//-----------------------------------------------------------------------------
// CATEGORY PAGE
//-----------------------------------------------------------------------------
export interface Category {
  id: string;
  mainCategory?: string;
  name: string;
  slug: string;
  description?: string;
  image?: IImage;
  level: number;
  order: number;
  isEnabled: boolean;
  products: string[];
  subcategories: string[];
  urlSlug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategoryDeleteResponse {
  category: Category;
}

export interface ICategoryPageState {
  socket: undefined | Socket;
  categories: Category[];
  categoryToUpdate: Category | undefined;
  formOpened: boolean;
  storeIsSuccess: boolean;
  updateIsSuccess: boolean;
  storeNewOrderIsSuccess: boolean;
  storeError: unknown;
  storeNewOrderError: unknown;
  updateError: unknown;
  formIsLoading: boolean;
}
//-----------------------------------------------------------------------------
// BOXES PAGE
//-----------------------------------------------------------------------------
export interface ICashier {
  id: string;
  name: string;
}

export interface IBox {
  id: string;
  cashier?: ICashier;
  users: string[];
  name: string;
  cashierName?: string;
  base: number;
  balance?: number;
  openBox?: string; // string Date
  closed?: string; // string Date
  transactions?: string[];
  closingRecords?: string[];
  createdAt: strig; // string Date
  updatedAt: string; // string Date
}

export interface IBoxWithDayjs extends IBox {
  openBox?: Dayjs;
  closed?: Dayjs;
  neverUsed: boolean;
  createdAt: Dayjs;
  updatedAt: Dayjs;
  createIsSameUpdate: boolean;
  dateRefreshRate?: number;
}

export interface IMainBox {
  name: string;
  balance: number;
}

export interface IBoxPageState {
  boxes: IBoxWithDayjs[];
  maiBox: IMainBox | null;
  // Add box
  createFormOpened: boolean;
  storeBoxLoading: boolean;
  storeBoxIsSuccess: boolean;
  storeBoxError: unknown;
  // Open box
  boxToOpen: IBoxWithDayjs | null;
  openBoxLoading: boolean;
  openBoxIsSuccess: boolean;
  openBoxError: unknown;
}
