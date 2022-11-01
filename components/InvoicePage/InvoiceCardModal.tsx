import { Button, Modal } from '@mantine/core';
import { NextLink } from '@mantine/next';
import { IconCash, IconPrinter } from '@tabler/icons';
import React from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { openPaymentForm, unmountSelectedInvoice } from 'store/reducers/InvoicePage/creators';
import EmptyInvoice from './EmptyInvoice';
import InvoiceCard from './InvoiceCard';
import InvoiceCardModalHeader from './InvoiceCardModalHeader';

const InvoiceCardModal = () => {
  const {
    selectedInvoice: invoice,
    selectedInvoiceOpened: opened,
    selectedInvoiceLoading: loading,
    selectedInvoiceError: error,
  } = useAppSelector(state => state.InvoicePageReducer);
  const dispatch = useAppDispatch();

  const onClose = () => {
    if (!loading) dispatch(unmountSelectedInvoice());
  };

  return (
    <Modal size="60%" opened={opened} onClose={onClose} padding={0} withCloseButton={false}>
      <div>
        <InvoiceCardModalHeader
          title={
            <span className="font-bold italic">
              Tienda <span className="text-red-500">Carmú</span>
            </span>
          }
          invoiceNumber={invoice?.prefixNumber}
          invoiceType={invoice?.isSeparate ? 'Apartado' : 'Factura'}
          onClose={onClose}
        />

        <div className="bg-gradient-to-r from-red-500 via-purple-600 to-blue-500 px-4 py-4">
          {invoice ? <InvoiceCard invoice={invoice} /> : <EmptyInvoice loading={loading} error={error} />}
        </div>

        <footer className="flex justify-between rounded-b-lg bg-header p-4">
          <Button
            leftIcon={<IconPrinter />}
            color="green"
            component={NextLink}
            href={`/admin/invoices/print/${invoice?.id}`}
            target="_blank"
            disabled={!invoice}
          >
            Imprimir
          </Button>
          <Button
            leftIcon={<IconCash />}
            color="grape"
            disabled={!invoice?.balance}
            onClick={() => dispatch(openPaymentForm())}
          >
            Registrar Pago
          </Button>
        </footer>
      </div>
    </Modal>
  );
};

export default InvoiceCardModal;
