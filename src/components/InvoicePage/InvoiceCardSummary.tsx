import React, { useEffect, useState } from 'react';
import { IInvoiceFull } from 'src/types';
import { currencyFormat } from 'src/utils';

interface Props {
  invoice: IInvoiceFull;
}

const InvoiceCardSummary = ({ invoice }: Props) => {
  const [payments, setPayments] = useState(0);
  useEffect(() => {
    setPayments(
      invoice.payments.reduce(
        (amount, payment) =>
          (amount += !payment.initialPayment ? payment.amount : 0),
        0
      )
    );
  }, [invoice]);

  return (
    <div className="sticky top-0 px-4 py-2">
      {/* SUBTOTAL && DISCOUNT */}
      <div
        className={`flex ${
          invoice.discount ? 'justify-between' : 'justify-end'
        } mb-2`}
      >
        {/* SUBTOTAL */}
        {Boolean(invoice.subtotal) && invoice.subtotal !== invoice.amount && (
          <div className="flex flex-col items-end">
            <p className="text-xs">Subtotal</p>
            <p className="border-t px-2 text-sm font-bold text-dark dark:text-gray-200">
              {currencyFormat(invoice.subtotal)}
            </p>
          </div>
        )}
        {/* DESCUENTO */}
        {invoice.discount && (
          <div className="flex flex-col items-end">
            <p className="text-xs">Descuento</p>
            <p className="border-t px-2 text-sm font-bold text-dark dark:text-gray-200">
              {currencyFormat(invoice.discount)}
            </p>
          </div>
        )}
      </div>
      {/* AMOUNT */}
      <div className="mb-2 flex flex-col items-end">
        <p className="font-bold uppercase">Total</p>
        <p className="border-t px-2 text-lg font-bold text-dark dark:text-gray-200">
          {currencyFormat(invoice.amount)}
        </p>
      </div>
      {/* CASH && CASHCHAGE && PAYMENTS */}
      <div
        className={`flex ${
          invoice.cash && (invoice.cashChange || payments > 0)
            ? 'justify-between'
            : 'justify-end'
        } mb-2`}
      >
        {/* CASH */}
        {Boolean(invoice.cash) && (
          <div className="flex flex-col items-end">
            <p className="text-xs">Efectivo</p>
            <p className="border-t px-2 text-sm font-bold text-dark dark:text-gray-200">
              {currencyFormat(invoice.cash)}
            </p>
          </div>
        )}
        {/* CASH CHANGE */}
        {invoice.cashChange && (
          <div className="flex flex-col items-end">
            <p className="text-xs">Cambio</p>
            <p className="border-t px-2 text-sm font-bold text-dark dark:text-gray-200">
              {currencyFormat(invoice.cashChange)}
            </p>
          </div>
        )}
        {/* PAYMENTS */}
        {payments > 0 && (
          <div className="flex flex-col items-end">
            <p className="text-xs">Abonos</p>
            <p className="border-t px-2 text-sm font-bold text-dark dark:text-gray-200">
              {currencyFormat(payments)}
            </p>
          </div>
        )}
      </div>
      {/* BALANCE */}
      {Boolean(invoice.balance) && (
        <div className="mb-2 flex flex-col items-end">
          <p className="font-bold uppercase">Saldo</p>
          <p className="border-t px-2 text-lg font-bold text-dark dark:text-gray-200">
            {currencyFormat(invoice.balance)}
          </p>
        </div>
      )}
    </div>
  );
};

export default InvoiceCardSummary;
