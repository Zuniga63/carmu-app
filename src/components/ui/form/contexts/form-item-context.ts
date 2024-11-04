import { createContext } from 'react';
// ----------------------------------------------------------------------------
// FORM ITEM CONTEXT
// ----------------------------------------------------------------------------
type FormItemContextValue = {
  id: string;
};

export const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);
