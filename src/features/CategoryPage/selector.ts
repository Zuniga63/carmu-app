import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';

export const categoryPage = (state: RootState) => state.categoryPage;

export const categoryPageSelector = createSelector(categoryPage, state => state);
