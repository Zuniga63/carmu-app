import React from 'react';
import { ScrollArea } from '@mantine/core';
import { INewInvoicePayment } from 'types';
import InvoiceFormPaymentListItem from './InvoiceFormPaymentListItem';

interface Props {
  payments: INewInvoicePayment[];
  removePayment(paymentId: number): void;
}

const InvoiceFormPaymentList = ({ payments, removePayment }: Props) => {
  return (
    <ScrollArea className="relative h-40 overflow-y-auto bg-gradient-to-br from-dark via-neutral-500 to-header">
      <table className="w-full table-auto">
        <thead className="sticky top-0 z-fixed bg-gray-dark">
          <tr className="whitespace-nowrap text-gray-100">
            <th scope="col" className="px-2 py-1 text-center text-xs uppercase tracking-wide">
              Descripción
            </th>
            <th scope="col" className="px-2 py-1 text-center text-xs uppercase tracking-wide">
              Importe
            </th>
            <th scope="col" className="relative px-2 py-1 text-center text-xs uppercase tracking-wide">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {payments.map(item => (
            <InvoiceFormPaymentListItem key={item.id} payment={item} onRemove={removePayment} />
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
};

export default InvoiceFormPaymentList;
