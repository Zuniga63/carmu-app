import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'src/store';

export const customerPage = (state: RootState) => state.customerPage;
export const customerPageSelector = createSelector(customerPage, state => state);
