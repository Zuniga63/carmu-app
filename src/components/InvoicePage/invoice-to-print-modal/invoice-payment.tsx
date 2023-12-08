import { cn, currencyFormat } from '@/utils';
import type { IInvoicePayment } from '@/types';
import { type InvoicePrintSize } from '@/hooks/use-invoice-to-print-modal';
import { type Dayjs } from 'dayjs';

//-----------------------------------------------------------------------------
// ONLY CASH PAYMENT COMPONENT
//-----------------------------------------------------------------------------
type OnlyCashPaymentProps = {
  cash?: number;
  cashChange?: number;
};

const OnlyCashPayment = ({ cash, cashChange }: OnlyCashPaymentProps) => {
  return (
    <div className="flex justify-end gap-x-4 text-xs">
      <div className="flex flex-col items-end">
        <p>Efectivo:</p>
        <p>Cambio:</p>
      </div>
      <div className="flex flex-col items-end font-bold">
        <p>{currencyFormat(cash)}</p>
        <p>{currencyFormat(cashChange)}</p>
      </div>
    </div>
  );
};

//-----------------------------------------------------------------------------
// PAYMENT LIST
//-----------------------------------------------------------------------------
type PaymentListProps = {
  payments?: IInvoicePayment[];
};
const PaymentList = ({ payments = [] }: PaymentListProps) => {
  const formatDate = (date?: Dayjs) => {
    const format = 'DD-MM-YY';
    return date ? date.format(format) : '';
  };
  return (
    <div className="space-y-2 text-xs">
      {payments.map(payment => (
        <div key={payment.id} className="flex items-center justify-evenly gap-x-1 divide-x ">
          <p className="flex-shrink-0 pr-1">{formatDate(payment.paymentDate)}</p>
          <p className="line-clamp-2 flex-grow px-2">{payment.description}</p>
          <p className="flex-shrink-0 pl-2 text-right">{currencyFormat(payment.amount)}</p>
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
      className={cn('mx-auto my-4 w-full rounded-lg border-4 border-neutral-400 p-2 text-sm', {
        'overflow-hidden border-none bg-gray-100 p-4': size === 'lg',
      })}
    >
      <h3 className="mb-2 border-b-8 border-double border-neutral-600 text-center font-bold tracking-wider text-dark">
        Saldo
      </h3>
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
  payments?: IInvoicePayment[];
  className?: string;
};
export default function InvoicePayment({ size, cash, cashChange, payments = [], balance, className }: Props) {
  const isOnlyCash = Boolean(cashChange);

  return (
    <div className={className}>
      <h3 className="mb-2 text-center text-sm font-bold">Forma de pago</h3>
      {isOnlyCash ? <OnlyCashPayment cash={cash} cashChange={cashChange} /> : <PaymentList payments={payments} />}
      <InvoiceBalance size={size} balance={balance} />
    </div>
  );
}
