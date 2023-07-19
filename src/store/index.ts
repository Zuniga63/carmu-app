import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { authReducer } from 'src/features/Auth';
import { boxPageReducer } from 'src/features/BoxPage';
import { categoryPageReducer } from 'src/features/CategoryPage';
import { invoicePageReducer } from 'src/features/InvoicePage';
import { customerPageReducer } from 'src/features/CustomerPage';
import { configStateReducer } from 'src/features/Config';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    categoryPage: categoryPageReducer,
    boxPage: boxPageReducer,
    invoicePage: invoicePageReducer,
    customerPage: customerPageReducer,
    configState: configStateReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
