import { FormEvent, useEffect, useState } from 'react';
import type { IInvoiceFull } from '@/types';
import { useCancelInvoice } from '@/hooks/react-query/invoices.hooks';
import { Button, Modal, Textarea } from '@mantine/core';

export interface ICancelInvoiceData {
  invoiceId: string;
  message?: string;
}

type Props = {
  isOpen: boolean;
  invoice?: IInvoiceFull;
  onClose: () => void;
};

const CancelInvoiceForm = ({ isOpen, invoice, onClose }: Props) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const { mutate: cancelInvoice, isSuccess, isPending } = useCancelInvoice();

  const handleClose = () => {
    if (isPending) return;
    onClose();
    setMessage('');
  };

  const getData = (): ICancelInvoiceData | null => {
    if (invoice) {
      const data: ICancelInvoiceData = {
        invoiceId: invoice.id,
      };
      if (message.trim()) data.message = message.trim();

      return data;
    }

    return null;
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isPending) return;
    const data = getData();
    if (data) cancelInvoice(data);
  };

  useEffect(() => {
    setTitle(invoice ? `Anulación de Factura N° ${invoice.prefixNumber}: ${invoice.customerName}` : '');
  }, [invoice]);

  useEffect(() => {
    if (isSuccess) handleClose();
  }, [isSuccess]);

  return (
    <Modal opened={isOpen} onClose={handleClose} title={title}>
      <form onSubmit={onSubmit}>
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
        </div>

        <footer className="flex justify-end">
          <Button color="red" type="submit" loading={isPending}>
            Anular Factura
          </Button>
        </footer>
      </form>
    </Modal>
  );
};

export default CancelInvoiceForm;
