import type { IInvoicePayment } from '@/types';

import { Table } from '@mantine/core';
import InvoiceCardPaymentRow from './InvoiceCardPaymentRow';

interface Props {
  payments: IInvoicePayment[];
  onPaymentCancel: (paymentId: IInvoicePayment) => void;
}
const InvoiceCardPayments = ({ payments, onPaymentCancel }: Props) => {
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
          <InvoiceCardPaymentRow payment={payment} key={payment.id} onPaymentCancel={onPaymentCancel} />
        ))}
      </tbody>
    </Table>
  );
};

export default InvoiceCardPayments;
