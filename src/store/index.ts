import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { boxPageReducer } from '@/features/BoxPage';
import { invoicePageReducer } from '@/features/InvoicePage';

export const store = configureStore({
  reducer: {
    boxPage: boxPageReducer,
    invoicePage: invoicePageReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
