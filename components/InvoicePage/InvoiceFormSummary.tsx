import React from 'react';
import { IInvoiceSummary } from 'types';
import InvoiceFormSummaryItem from './InvoiceFormSummaryItem';

interface Props {
  summary: IInvoiceSummary;
  full?: boolean;
}

const InvoiceFormSummary: React.FC<Props> = ({ summary, full = false }) => {
  return (
    <div className="flex flex-col gap-y-4 rounded-lg border border-gray-300 bg-gray-200 p-4 shadow-lg dark:border-gray-dark dark:bg-header">
      <InvoiceFormSummaryItem title="Subtotal" value={summary.subtotal} />
      {Boolean(summary.discount) ? <InvoiceFormSummaryItem title="Descuento" value={summary.discount} small /> : null}
      <InvoiceFormSummaryItem title="Total" value={summary.amount} bold />
      {full && (
        <>
          {summary.cash ? <InvoiceFormSummaryItem title="Efectivo" value={summary.cash} /> : null}
          {summary.balance ? <InvoiceFormSummaryItem title="Saldo" value={summary.balance} /> : null}
          {summary.cashChange ? <InvoiceFormSummaryItem title="Cambio" value={summary.cashChange} /> : null}
        </>
      )}
    </div>
  );
};

export default InvoiceFormSummary;
