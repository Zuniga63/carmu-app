import { IconTrash } from '@tabler/icons';
import React from 'react';
import { INewInvoicePayment } from 'types';
import { currencyFormat } from 'utils';

interface Props {
  payment: INewInvoicePayment;
  onRemove(paymentId: number): void;
}

const InvoiceFormPaymentListItem = ({ payment, onRemove }: Props) => {
  return (
    <tr className="bg-gray-300 text-dark odd:bg-neutral-500 odd:text-light">
      <td className="px-2 py-1 text-xs">
        <p>
          <span className="font-bold">{payment.description}</span> en{' '}
          <span className="font-bold">{payment.box?.name || 'Caja Global'}</span>
        </p>
        <p>Registrar: {payment.register ? 'Si' : 'No'}</p>
      </td>
      <td className="whitespace-nowrap px-2 py-1 text-right">{currencyFormat(payment.amount)}</td>
      <td className="px-3">
        <div className="flex items-center justify-center">
          <button
            className="rounded-full border border-transparent p-1 text-red-800 transition-colors hover:border-red-800 hover:bg-red-100 hover:text-opacity-70 hover:shadow-md active:text-opacity-90"
            onClick={() => onRemove(payment.id)}
          >
            <IconTrash size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default InvoiceFormPaymentListItem;
