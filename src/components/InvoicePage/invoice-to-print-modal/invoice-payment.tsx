import { InvoicePrintSize } from '@/hooks/use-invoice-to-print-modal';
import { IInvoicePaymentBase } from '@/types';
import { currencyFormat } from '@/utils';
import dayjs from 'dayjs';
import React from 'react';

//-----------------------------------------------------------------------------
// ONLY CASH PAYMENT COMPONENT
//-----------------------------------------------------------------------------
type OnlyCashPaymentProps = {
  cash?: number;
  cashChange?: number;
  size: InvoicePrintSize;
};

const OnlyCashPayment = ({ cash, cashChange, size }: OnlyCashPaymentProps) => {
  return (
    <div className="flex justify-end gap-x-4">
      <div className="flex flex-col items-end">
        <p className={size === 'sm' ? 'text-xs' : 'text-sm'}>Efectivo:</p>
        <p className={size === 'sm' ? 'text-xs' : 'text-sm'}>Cambio:</p>
      </div>
      <div className="flex flex-col items-end">
        <p className={size === 'sm' ? 'text-xs' : 'text-sm'}>{currencyFormat(cash)}</p>
        <p className={size === 'sm' ? 'text-xs' : 'text-sm'}>{currencyFormat(cashChange)}</p>
      </div>
    </div>
  );
};

//-----------------------------------------------------------------------------
// PAYMENT LIST
//-----------------------------------------------------------------------------
type PaymentListProps = {
  size: InvoicePrintSize;
  payments?: IInvoicePaymentBase[];
};
const PaymentList = ({ size, payments = [] }: PaymentListProps) => {
  const formatDate = (date?: string) => {
    const format = size === 'lg' ? 'dddd DD-MM-YYYY hh:mm a' : 'DD-MM-YY';
    return dayjs(date).format(format);
  };
  return (
    <div className={`${size === 'lg' && 'col-span-2'}`}>
      {payments.map(payment => (
        <div
          key={payment.id}
          className={`flex items-center justify-evenly gap-x-1 divide-x ${
            size === 'sm' ? 'text-xs' : 'gap-x-2 text-sm'
          }`}
        >
          <p className="flex-shrink-0 px-2">{formatDate(payment.paymentDate)}</p>
          <p className="line-clamp-1 flex-grow px-2">{payment.description}</p>
          <p className="flex-shrink-0 px-2">{currencyFormat(payment.amount)}</p>
        </div>
      ))}
    </div>
  );
};

//-----------------------------------------------------------------------------
// INVOICE BALANCE
//-----------------------------------------------------------------------------
type InvoiceBalanceProps = {
  size: InvoicePrintSize;
  balance?: number;
};

const InvoiceBalance = ({ size, balance }: InvoiceBalanceProps) => {
  if (!balance || balance === 0) return null;

  return (
    <div
      className={`${
        size === 'sm'
          ? 'w-fit border-4 border-gray-dark p-2 text-sm'
          : 'w-full overflow-hidden bg-gray-100 p-4 text-base'
      } mx-auto my-4 rounded-lg `}
    >
      <h3 className="mb-2 border-b-8 border-double border-gray-dark text-center tracking-wider text-dark">Saldo</h3>
      <p className="text-center font-bold tracking-widest text-gray-dark">{currencyFormat(balance)}</p>
    </div>
  );
};

//-----------------------------------------------------------------------------
// MAIN COMPONENT
//-----------------------------------------------------------------------------
type Props = {
  size: InvoicePrintSize;
  cash?: number;
  cashChange?: number;
  balance?: number;
  payments?: IInvoicePaymentBase[];
};
export default function InvoicePayment({ size, cash, cashChange, payments, balance }: Props) {
  const isOnlyCash = Boolean(cashChange);

  return (
    <div className="">
      <h3 className={size === 'sm' ? 'mb-2 text-center text-sm font-bold' : 'mb-2 text-center text-lg font-bold'}>
        Forma de pago
      </h3>
      {isOnlyCash ? (
        <OnlyCashPayment size={size} cash={cash} cashChange={cashChange} />
      ) : (
        <PaymentList payments={payments} size={size} />
      )}
      <InvoiceBalance size={size} balance={balance} />
    </div>
  );
}
