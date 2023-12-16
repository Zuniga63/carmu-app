import dayjs from 'dayjs';
import React from 'react';
import { IInvoicePaymentBase } from '@/types';
import { currencyFormat } from '@/lib/utils';

interface Props {
  paymentBase: IInvoicePaymentBase;
}
const CustomerInfoPaymentCard = ({ paymentBase }: Props) => {
  const diff = dayjs().diff(paymentBase.paymentDate, 'months');

  return (
    <div className={`rounded-lg border border-green-500 bg-green-500 bg-opacity-10 py-2 ${diff > 6 && 'opacity-50'}`}>
      <header className="flex items-center justify-between px-4 py-2">
        <div>
          <p className="text-xs">{dayjs(paymentBase.paymentDate).format('DD/MM/YY hh:mm a')}</p>
          <p className="text-xs">{dayjs(paymentBase.paymentDate).fromNow()}</p>
        </div>

        <p className="text-xs">{currencyFormat(paymentBase.amount)}</p>
      </header>
    </div>
  );
};

export default CustomerInfoPaymentCard;
