import React from 'react';
import { IInvoiceBaseFull } from 'src/types';
import CustomerInfoInvoiceCard from './CustomerInfoInvoiceCard';

interface Props {
  invoices: IInvoiceBaseFull[];
}

const CustomerInfoInvoices = ({ invoices }: Props) => {
  return (
    <div className="relative grid min-h-[20rem] grid-cols-3 items-start gap-4">
      {invoices.map(invoice => (
        <CustomerInfoInvoiceCard key={invoice.id} invoice={invoice} />
      ))}
    </div>
  );
  return <div>CustomerInfoInvoices</div>;
};

export default CustomerInfoInvoices;
