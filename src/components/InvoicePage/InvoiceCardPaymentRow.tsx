import type { IInvoicePayment } from '@/types';
import { currencyFormat } from '@/utils';

import { ActionIcon, Tooltip } from '@mantine/core';
import { IconX } from '@tabler/icons-react';

interface Props {
  payment: IInvoicePayment;
  onPaymentCancel: (paymentId: IInvoicePayment) => void;
}

const InvoiceCardPaymentRow = ({ payment, onPaymentCancel }: Props) => {
  return (
    <tr className={payment.cancel ? 'line-through' : ''}>
      <td className="text-center">
        <p>{payment.paymentDate.format('DD-MM-YYYY')}</p>
        <p className="text-xs">{payment.paymentDate.format('hh:mm a')}</p>
      </td>
      <td>
        <p>{payment.description}</p>
        <p className="text-xs text-light text-opacity-50">{payment.paymentDate.fromNow()}</p>
      </td>
      <td className="text-right">{currencyFormat(payment.amount)}</td>
      <td>
        {!payment.cancel ? (
          <div className="flex justify-center">
            <Tooltip label="Cancelar pago">
              <ActionIcon size="lg" color="red" onClick={() => onPaymentCancel(payment)}>
                <IconX size={18} />
              </ActionIcon>
            </Tooltip>
          </div>
        ) : null}
      </td>
    </tr>
  );
};

export default InvoiceCardPaymentRow;
