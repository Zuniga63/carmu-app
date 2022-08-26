import axios, { AxiosError } from 'axios';
import { AppThunkAction, AuthResponse, LoginData } from 'types';
import { actionBody, buildCookieOption } from 'utils';
import { SET_ERROR, USER_IS_AUTH, LOADING, LOGIN_IS_SUCCESS, SET_USER, LOGOUT } from './actions';
import { setCookie } from 'cookies-next';

const baseUrl = '/auth/local/signin';

export const authUser = (loginData: LoginData): AppThunkAction => {
  return async dispatch => {
    try {
      dispatch(actionBody(LOADING, true));
      dispatch(actionBody(SET_ERROR, ''));

      const res = await axios.post(baseUrl, loginData);
      const { ok, token, user } = res.data as AuthResponse;

      if (ok && user && token) {
        dispatch(actionBody(USER_IS_AUTH, true));
        dispatch(actionBody(SET_USER, user));
        dispatch(actionBody(LOGIN_IS_SUCCESS, true));

        // Save the information in local storage and cookies
        if (typeof window !== undefined) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          setCookie('token', token, buildCookieOption());
        }
      }
    } catch (error) {
      let message = '¡Ops, algo salio mal!';

      if (error instanceof AxiosError) {
        const { response } = error;
        if (response && response.data) {
          message = response.data.message;
        } else {
          console.error(error.message);
        }
      } else {
        console.log(error);
      }

      dispatch(actionBody(SET_ERROR, message));
    } finally {
      dispatch(actionBody(LOADING, false));
      setTimeout(() => {
        dispatch(actionBody(LOGIN_IS_SUCCESS, false));
      }, 2000);
    }
  };
};

export const logout = (): AppThunkAction => {
  return dispatch => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setCookie('token', '', buildCookieOption(0));
    }
    dispatch(actionBody(LOGOUT));
  };
};
