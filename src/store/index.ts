import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { boxPageReducer } from '@/features/BoxPage';
import { categoryPageReducer } from '@/features/CategoryPage';
import { invoicePageReducer } from '@/features/InvoicePage';
import { customerPageReducer } from '@/features/CustomerPage';
import { configStateReducer } from '@/features/Config';

export const store = configureStore({
  reducer: {
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
