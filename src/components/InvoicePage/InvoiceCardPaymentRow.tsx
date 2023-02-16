import { ActionIcon, Tooltip } from '@mantine/core';
import { IconX } from '@tabler/icons';
import React from 'react';
import { showCancelPaymentForm } from 'src/features/InvoicePage';
import { useAppDispatch } from 'src/store/hooks';
import { IInvoicePayment } from 'src/types';
import { currencyFormat } from 'src/utils';

interface Props {
  payment: IInvoicePayment;
}

const InvoiceCardPaymentRow = ({ payment }: Props) => {
  const dispatch = useAppDispatch();

  return (
    <tr className={payment.cancel ? 'line-through' : ''}>
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
      <td>
        {!payment.cancel ? (
          <div className="flex justify-center">
            <Tooltip label="Cancelar pago">
              <ActionIcon
                size="lg"
                color="red"
                onClick={() => dispatch(showCancelPaymentForm(payment.id))}
              >
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
