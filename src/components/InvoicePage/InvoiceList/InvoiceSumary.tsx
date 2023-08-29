import React, { useMemo } from 'react';
import { IInvoiceBase } from '@/types';
import { currencyFormat } from '@/utils';

type Props = {
  subtotal: IInvoiceBase['subtotal'];
  discount: IInvoiceBase['discount'];
  amount: IInvoiceBase['amount'];
  cash: IInvoiceBase['cash'];
  cashChange: IInvoiceBase['cashChange'];
  balance: IInvoiceBase['balance'];
};

export default function InvoiceSumary({ subtotal, discount, amount, cash, cashChange, balance }: Props) {
  const summary = useMemo(() => {
    const newSummary = {
      subtotal: subtotal || 0,
      discount: discount || 0,
      amount: amount,
      cash: cash || 0,
      payments: 0,
      balance: 0,
      cashChange: cashChange || 0,
    };

    if (!cashChange) {
      newSummary.balance = balance || 0;
      newSummary.payments = amount - newSummary.balance - newSummary.cash;
    }

    return newSummary;
  }, [balance]);

  return (
    <div className="flex gap-x-4 text-dark dark:text-light">
      {/* Labels */}
      <div className="flex-grow text-right">
        <p className="text-xs">Subtotal:</p>
        <p className="text-xs">Descuento:</p>
        <p className="border-t border-transparent text-base font-bold">Total:</p>
        <p className="text-xs">Pago inicial:</p>
        <p className="text-xs">Abonos:</p>
        <p className="border-t border-transparent italic">Saldo:</p>
        {summary.cashChange > 0 ? <p className="text-xs">Vueltos:</p> : null}
      </div>

      {/* AMOUNTS */}
      <div className="text-right tracking-widest">
        <p className="text-xs">{currencyFormat(summary.subtotal)}</p>
        <p className="text-xs"> - {currencyFormat(summary.discount)}</p>
        <p className="border-t text-base font-bold">{currencyFormat(summary.amount)}</p>
        <p className="text-xs"> - {currencyFormat(summary.cash)}</p>
        <p className="text-xs"> - {currencyFormat(summary.payments)}</p>
        <p className="border-t italic">{currencyFormat(summary.balance)}</p>
        {summary.cashChange > 0 ? <p className="text-xs italic">{currencyFormat(summary.cashChange)}</p> : null}
      </div>
    </div>
  );
}
