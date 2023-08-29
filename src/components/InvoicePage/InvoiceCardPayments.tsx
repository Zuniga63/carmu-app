import { Table } from '@mantine/core';
import React from 'react';
import { IInvoicePayment } from '@/types';
import InvoiceCardPaymentRow from './InvoiceCardPaymentRow';

interface Props {
  payments: IInvoicePayment[];
}
const InvoiceCardPayments = ({ payments }: Props) => {
  return (
    <Table>
      <thead>
        <tr>
          <th scope="col">
            <div className="text-center">Fecha</div>
          </th>
          <th scope="col">Descripción</th>
          <th scope="col">
            <div className="text-center">Importe</div>
          </th>
          <th scope="col">
            <span className="sr-only">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {payments.map(payment => (
          <InvoiceCardPaymentRow payment={payment} key={payment.id} />
        ))}
      </tbody>
    </Table>
  );
};

export default InvoiceCardPayments;
