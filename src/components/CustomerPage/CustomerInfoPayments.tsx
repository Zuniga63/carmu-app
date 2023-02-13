import React from 'react';
import { IInvoicePaymentBase } from 'src/types';
import CustomerInfoPaymentCard from './CustomerInfoPaymentCard';

interface Props {
  payments: IInvoicePaymentBase[];
}
const CustomerInfoPayments = ({ payments }: Props) => {
  return (
    <div className="relative grid min-h-[20rem] grid-cols-3 items-start gap-4">
      {payments.map(payment => (
        <CustomerInfoPaymentCard paymentBase={payment} key={payment.id} />
      ))}
    </div>
  );
};

export default CustomerInfoPayments;
