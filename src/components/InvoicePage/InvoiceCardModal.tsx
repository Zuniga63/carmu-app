import { Button, Modal } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconCash, IconPrinter } from '@tabler/icons';
import Link from 'next/link';
import React from 'react';
import {
  invoicePageSelector,
  showPaymentForm,
  unmountInvoice,
} from 'src/features/InvoicePage';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { buildInvoiceFull } from 'src/utils';
import EmptyInvoice from './EmptyInvoice';
import InvoiceCard from './InvoiceCard';
import InvoiceCardModalHeader from './InvoiceCardModalHeader';

const InvoiceCardModal = () => {
  const {
    selectedInvoice: invoice,
    selectedInvoiceOpened: opened,
    selectedInvoiceLoading: loading,
    selectedInvoiceError: error,
  } = useAppSelector(invoicePageSelector);
  const dispatch = useAppDispatch();
  const largeScreen = useMediaQuery('(min-width: 768px)');

  const onClose = () => {
    if (!loading) dispatch(unmountInvoice());
  };

  return (
    <Modal
      size={largeScreen ? '70%' : '100%'}
      opened={opened}
      onClose={onClose}
      padding={0}
      withCloseButton={false}
    >
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
          {invoice ? (
            <InvoiceCard invoice={buildInvoiceFull(invoice)} />
          ) : (
            <EmptyInvoice loading={loading} error={error} />
          )}
        </div>

        <footer className="flex justify-between rounded-b-lg bg-gray-300 p-4 dark:bg-header">
          <Button leftIcon={<IconPrinter />} color="green" disabled={!invoice}>
            <Link href={`/admin/invoices/print/${invoice?.id}`} target="_blank">
              Imprimir
            </Link>
          </Button>

          <Button
            leftIcon={<IconCash />}
            color="grape"
            disabled={!invoice?.balance}
            onClick={() => dispatch(showPaymentForm())}
          >
            Registrar Pago
          </Button>
        </footer>
      </div>
    </Modal>
  );
};

export default InvoiceCardModal;
