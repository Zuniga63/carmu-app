import { createReducer } from '@reduxjs/toolkit';
import { authenticate, authSuccessIsNotify, logout } from './actions';
import { AuthState } from './types';
import { clearAuthData } from '@/logic/auth-logic';

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
      state.authIsSuccess = true;
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
