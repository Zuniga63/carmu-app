import React from 'react';
import { IInvoiceBaseFull } from 'src/types';
import CustomerInfoInvoiceCard from './CustomerInfoInvoiceCard';
import { IconTools } from '@tabler/icons-react';

interface Props {
  invoices: IInvoiceBaseFull[];
}

const CustomerInfoInvoices = ({ invoices }: Props) => {
  return (
    <div className="relative grid grid-cols-3 items-start gap-x-2">
      <div className="col-span-2">
        <div className="flex flex-col gap-y-2">
          {invoices.map(invoice => (
            <CustomerInfoInvoiceCard key={invoice.id} invoice={invoice} />
          ))}
        </div>
      </div>
      <div className="sticky top-0 w-full">
        <div className="flex flex-col items-center gap-y-2">
          <IconTools size={40} className="text-zinc-400" />
          <span>Estadisticas en construcción</span>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfoInvoices;
