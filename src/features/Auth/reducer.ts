import { createReducer } from '@reduxjs/toolkit';
import { authenticate, authSuccessIsNotify, logout, signin } from './actions';
import { AuthState, AuthErrorResponse } from './types';
import { clearAuthData, saveAuthData } from 'src/logic/auth-logic';

const initialState: AuthState = {
  isAuth: false,
  user: undefined,
  error: null,
  isAdmin: false,
  loading: false,
  authIsSuccess: false,
};

export const authReducer = createReducer(initialState, builder => {
  builder
    //-------------------------------------------------------------------------
    // SIGNIN
    //-------------------------------------------------------------------------
    .addCase(signin.pending, state => {
      state.loading = true;
      state.error = null;
      state.isAuth = false;
    })
    .addCase(signin.fulfilled, (state, { payload }) => {
      const { token, user } = payload;
      state.loading = false;
      if (token && user) {
        state.isAuth = true;
        state.user = user;
        state.isAdmin = user?.role === 'admin';
        state.authIsSuccess = true;
        saveAuthData(token);
      }
    })
    .addCase(signin.rejected, (state, { payload }) => {
      state.loading = false;
      state.error = (payload as AuthErrorResponse).message;
    })
    .addCase(authSuccessIsNotify, state => {
      state.authIsSuccess = false;
    });
  // ------------------------------------------------------------------------
  // APP AUTHENTICATE
  // ------------------------------------------------------------------------
  builder
    .addCase(authenticate.fulfilled, (state, { payload }) => {
      state.isAuth = true;
      state.user = payload.user;
      state.isAdmin = payload.user?.role === 'admin';
    })
    .addCase(authenticate.rejected, state => {
      state = initialState;
      clearAuthData();
    });
  // ------------------------------------------------------------------------
  // APP LOGOUT
  // ------------------------------------------------------------------------
  builder.addCase(logout, state => {
    state = initialState;
    clearAuthData();
  });
});

export default authReducer;
