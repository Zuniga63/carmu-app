import { Button, Modal, Textarea } from '@mantine/core';
import React, { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { cancelInvoice, hideCancelInvoiceForm, invoicePageSelector } from '@/features/InvoicePage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export interface ICancelInvoiceData {
  invoiceId: string;
  message?: string;
}

const CancelInvoiceForm = () => {
  const {
    selectedInvoice: invoice,
    cancelInvoiceFormOpened: opened,
    cancelInvoiceLoading: loading,
    cancelInvoiceIsSuccess: isSuccess,
    cancelInvoiceError: error,
  } = useAppSelector(invoicePageSelector);
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const reset = () => {
    dispatch(hideCancelInvoiceForm());
    setMessage('');
  };

  const onClose = () => {
    if (!loading) {
      reset();
    }
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
    const data = getData();
    if (data) {
      dispatch(cancelInvoice(data));
    }
  };

  useEffect(() => {
    setTitle(invoice ? `Anulación de Factura N° ${invoice.prefixNumber}: ${invoice.customerName}` : '');
  }, [invoice]);

  useEffect(() => {
    if (isSuccess) {
      toast.success('¡Factura anulada!');
      reset();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <Modal opened={opened} onClose={onClose} title={title}>
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
          <Button color="red" type="submit" loading={loading}>
            Anular Factura
          </Button>
        </footer>
      </form>
    </Modal>
  );
};

export default CancelInvoiceForm;
