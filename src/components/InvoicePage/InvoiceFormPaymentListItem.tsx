import { IconTrash } from '@tabler/icons-react';
import React from 'react';
import { INewInvoicePayment } from '@/types';
import { currencyFormat } from '@/utils';

interface Props {
  payment: INewInvoicePayment;
  index: number;
  onRemove(paymentId: number): void;
}

const InvoiceFormPaymentListItem: React.FC<Props> = ({ payment, onRemove, index }) => {
  return (
    <tr>
      <td className="whitespace-nowrap">
        <span className="block text-center">{index + 1}</span>
      </td>
      <td className="whitespace-nowrap">
        <span className="block font-bold">{payment.box?.name || 'Caja Global'}</span>
        <span className="block text-xs">Registrar transacción: {payment.register ? 'Si' : 'No'}</span>
      </td>
      <td>
        <span className="block font-bold">{payment.description}</span>
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
