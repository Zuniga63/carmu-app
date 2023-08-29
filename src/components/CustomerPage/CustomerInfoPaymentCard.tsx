import dayjs from 'dayjs';
import React from 'react';
import { IInvoicePaymentBase } from '@/types';
import { currencyFormat } from '@/utils';

interface Props {
  paymentBase: IInvoicePaymentBase;
}
const CustomerInfoPaymentCard = ({ paymentBase }: Props) => {
  return (
    <div className="rounded-lg border border-green-500 bg-green-500 bg-opacity-10 py-2">
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
