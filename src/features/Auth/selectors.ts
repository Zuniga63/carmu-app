import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/store';

export const auth = (state: RootState) => state.auth;
export const user = (state: RootState) => state.auth.user;

export const authSelector = createSelector(auth, state => state);
export const userSelector = createSelector(user, state => state);
