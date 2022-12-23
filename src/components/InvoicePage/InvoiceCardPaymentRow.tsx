import React from 'react';
import { IInvoicePayment } from 'src/types';
import { currencyFormat } from 'src/utils';

interface Props {
  payment: IInvoicePayment;
}

const InvoiceCardPaymentRow = ({ payment }: Props) => {
  return (
    <tr>
      <td className="text-center">
        <p>{payment.paymentDate.format('DD-MM-YYYY')}</p>
        <p className="text-xs">{payment.paymentDate.format('hh:mm a')}</p>
      </td>
      <td>
        <p>{payment.description}</p>
        <p className="text-xs text-light text-opacity-50">
          {payment.paymentDate.fromNow()}
        </p>
      </td>
      <td className="text-right">{currencyFormat(payment.amount)}</td>
      <td></td>
    </tr>
  );
};

export default InvoiceCardPaymentRow;
