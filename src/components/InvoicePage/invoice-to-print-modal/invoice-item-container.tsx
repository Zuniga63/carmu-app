import { ReactNode } from 'react';

export default function InvoiceItemContainer({ children }: { children: ReactNode }) {
  return <div className="mb-2 border-b-4 border-double border-dark pb-2"> {children} </div>;
}
