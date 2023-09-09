import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';

export const boxPage = (state: RootState) => state.boxPage;

export const boxPageSelector = createSelector(boxPage, state => state);
