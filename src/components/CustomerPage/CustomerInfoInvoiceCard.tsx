import dayjs from 'dayjs';
import React from 'react';
import { IInvoiceBaseFull } from 'src/types';
import { currencyFormat } from 'src/utils';

interface Props {
  invoice: IInvoiceBaseFull;
}
const CustomerInfoInvoiceCard = ({ invoice }: Props) => {
  const isCredit = !invoice.isSeparate && invoice.balance;
  const isCancel = Boolean(invoice.cancel);
  const hasBalance = Boolean(invoice.balance);

  return (
    <div
      className={
        isCancel
          ? 'rounded-lg border border-gray-500 bg-gray-500 bg-opacity-10 py-2'
          : hasBalance
          ? isCredit
            ? 'rounded-lg border border-red-500 bg-red-500 bg-opacity-10 py-2' //Credit Style
            : 'rounded-lg border border-blue-500 bg-blue-500 bg-opacity-10 py-2' //Separate Style
          : 'rounded-lg border border-green-500 bg-green-500 bg-opacity-10 py-2'
      }
    >
      <header className="flex items-center justify-between px-4 py-2">
        <div>
          <p className="text-xs">
            {dayjs(invoice.expeditionDate).format('DD/MM/YY hh:mm a')}
          </p>
          <p className="text-xs">{dayjs(invoice.expeditionDate).fromNow()}</p>
        </div>

        <div className="flex flex-col items-center justify-center">
          <div className="flex gap-x-1 text-sm">
            <span>N°</span> <span>{invoice.prefixNumber}</span>{' '}
          </div>
          <p className="text-xs">{currencyFormat(invoice.amount)}</p>
        </div>
      </header>

      {Boolean(invoice.balance) ? (
        <div className="text-center tracking-widest">
          {currencyFormat(invoice.balance)}
        </div>
      ) : null}
    </div>
  );
};

export default CustomerInfoInvoiceCard;
