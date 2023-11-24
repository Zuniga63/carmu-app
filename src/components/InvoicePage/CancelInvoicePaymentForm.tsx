import dayjs from 'dayjs';
import type { IBox, IInvoiceFull, IInvoicePayment } from '@/types';
import { FormEvent, useEffect, useState } from 'react';
import { currencyFormat } from '@/utils';
import { useGetAllBoxes } from '@/hooks/react-query/boxes.hooks';
import { useCancelInvoicePayment } from '@/hooks/react-query/invoices.hooks';

import { IconBox } from '@tabler/icons-react';
import { Button, Checkbox, Modal, Select, Textarea } from '@mantine/core';

export interface ICancelPaymentData {
  invoiceId: string;
  paymentId: string;
  message?: string;
  registerTransaction?: boolean;
  cashboxId?: string;
}

type Props = {
  isOpen: boolean;
  invoice?: IInvoiceFull;
  payment?: IInvoicePayment;
  onCloseModal: () => void;
};

const CancelInvoicePaymentForm = ({ isOpen, invoice, payment, onCloseModal }: Props) => {
  const { data: boxesResponse } = useGetAllBoxes();
  const boxes: IBox[] = boxesResponse?.boxes || [];

  const { mutate: cancelPayment, isPending, isSuccess } = useCancelInvoicePayment();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [registerTransaction, setRegisterTransaction] = useState(true);
  const [boxId, setBoxId] = useState<string | null>(null);

  const getData = (): ICancelPaymentData | null => {
    if (invoice && payment) {
      const data: ICancelPaymentData = {
        invoiceId: invoice.id,
        paymentId: payment.id,
      };

      if (message) data.message = message.trim();
      if (registerTransaction) {
        data.registerTransaction = true;
        if (boxId) data.cashboxId = boxId;
      }

      return data;
    }

    return null;
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;

    const data = getData();
    if (data) cancelPayment(data);
  };

  const reset = () => {
    setMessage('');
    setRegisterTransaction(true);
    setBoxId(null);
  };

  const handleClose = () => {
    if (isPending) return;
    onCloseModal();
    reset();
  };

  useEffect(() => {
    setTitle(invoice ? `Factura N° ${invoice.prefixNumber}: Anulación de pago` : '');
  }, [invoice]);

  useEffect(() => {
    if (!isSuccess) return;
    handleClose();
  }, [isSuccess]);

  return (
    <Modal opened={isOpen} onClose={handleClose} title={title}>
      <form onSubmit={onSubmit}>
        {payment ? (
          <div className="mb-4 flex items-center justify-around gap-x-2 rounded border border-purple-500 p-2">
            <div className="flex-shrink-0">
              <div className="flex flex-col items-center">
                <span className="text-sm">{dayjs(payment.paymentDate).format('DD/MM/YYYY')}</span>
                <span className="text-xs">{dayjs(payment.paymentDate).format('hh:mm a')}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm">{payment.description}</span>
              <span className="text-xs">{dayjs(payment.paymentDate).fromNow()}</span>
            </div>
            <div>{currencyFormat(payment.amount)}</div>
          </div>
        ) : null}

        <div className="mb-4">
          <Textarea
            label="Motivo de cancelación"
            placeholder="Escribelo aquí"
            className="mb-4"
            value={message}
            onChange={({ currentTarget }) => {
              setMessage(currentTarget.value);
            }}
          />

          <Checkbox
            label="Registrar transacción"
            checked={registerTransaction}
            className="mb-2"
            onChange={({ currentTarget }) => setRegisterTransaction(currentTarget.checked)}
          />

          <Select
            placeholder="Selecciona una caja"
            value={boxId}
            onChange={setBoxId}
            icon={<IconBox size={14} />}
            data={boxes
              .filter(b => Boolean(b.openBox))
              .map(box => ({
                value: box.id,
                label: box.name,
              }))}
            searchable
            clearable
            size="xs"
            className="mb-4"
            disabled={!registerTransaction}
          />
        </div>

        <footer className="flex justify-end">
          <Button color="red" type="submit" loading={isPending}>
            Anular Pago
          </Button>
        </footer>
      </form>
    </Modal>
  );
};

export default CancelInvoicePaymentForm;
