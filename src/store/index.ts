import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { authReducer } from 'src/features/Auth';
import { boxPageReducer } from 'src/features/BoxPage';
import { categoryPageReducer } from 'src/features/CategoryPage';
import { invoicePageReducer } from 'src/features/InvoicePage';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categoryPage: categoryPageReducer,
    boxPage: boxPageReducer,
    invoicePage: invoicePageReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
