import { IAction, IAuthState, IUser } from 'src/types';
import {
  SET_ERROR,
  USER_IS_AUTH,
  LOADING,
  LOGIN_IS_SUCCESS,
  SET_USER,
  LOGOUT,
} from './actions';

const initialState: IAuthState = {
  isAuth: false,
  user: undefined,
  error: null,
  isAdmin: false,
  loading: false,
  loginIsSuccess: false,
};

export default function AuthReducer(
  state = initialState,
  action: IAction
): IAuthState {
  switch (action.type) {
    case LOADING: {
      return {
        ...state,
        loading: action.payload as boolean,
      };
    }
    case USER_IS_AUTH: {
      return {
        ...state,
        isAuth: action.payload as boolean,
      };
    }
    case SET_USER: {
      const user = action.payload as IUser;
      return {
        ...state,
        user: user,
        isAdmin: user.role === 'admin',
      };
    }
    case LOGIN_IS_SUCCESS: {
      return {
        ...state,
        loginIsSuccess: action.payload as boolean,
      };
    }
    case SET_ERROR: {
      return {
        ...state,
        error: action.payload as string,
      };
    }
    case LOGOUT: {
      return {
        ...initialState,
      };
    }
    default: {
      return state;
    }
  }
}
