import React from 'react';
import { ScrollArea } from '@mantine/core';
import { IInvoiceSummary, INewInvoicePayment } from 'types';
import InvoiceFormPaymentListItem from './InvoiceFormPaymentListItem';
import { currencyFormat } from 'utils';

interface Props {
  payments: INewInvoicePayment[];
  removePayment(paymentId: number): void;
  summary: IInvoiceSummary;
}

const InvoiceFormPaymentList = ({ payments, removePayment, summary }: Props) => {
  return (
    <div>
      <ScrollArea className="relative mb-2 h-40 overflow-y-auto bg-gradient-to-br from-dark via-neutral-500 to-header">
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

      {/* Summary */}
      <div className="flex flex-col gap-y-2">
        {summary.cash && (
          <div className="flex items-center justify-end gap-x-4">
            <p className="tracking-wider">Efectivo: </p>
            <p className="w-32 whitespace-nowrap text-right tracking-widest">{currencyFormat(summary.cash)}</p>
          </div>
        )}
        {summary.balance && (
          <div className="flex items-center justify-end gap-x-4">
            <p className="tracking-wider">Crédito: </p>
            <p className="w-32 whitespace-nowrap text-right tracking-widest">{currencyFormat(summary.balance)}</p>
          </div>
        )}
        {summary.cashChange && (
          <div className="flex items-center justify-end gap-x-4">
            <p className="tracking-wider">Cambio: </p>
            <p className="w-32 whitespace-nowrap text-right tracking-widest">{currencyFormat(summary.cashChange)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceFormPaymentList;
