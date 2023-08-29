import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store';

export const invoicePage = (state: RootState) => state.invoicePage;

export const invoicePageSelector = createSelector(invoicePage, state => state);
