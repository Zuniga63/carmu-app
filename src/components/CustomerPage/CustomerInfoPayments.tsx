import React from 'react';
import { IInvoicePaymentBase } from '@/types';
import CustomerInfoPaymentCard from './CustomerInfoPaymentCard';

interface Props {
  payments: IInvoicePaymentBase[];
}
const CustomerInfoPayments = ({ payments }: Props) => {
  return (
    <div className="relative grid min-h-[20rem] grid-cols-3 place-content-start gap-4 lg:grid-cols-4">
      {payments.map(payment => (
        <CustomerInfoPaymentCard paymentBase={payment} key={payment.id} />
      ))}
    </div>
  );
};

export default CustomerInfoPayments;
