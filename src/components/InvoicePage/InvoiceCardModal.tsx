import { Button, Modal } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconCash, IconPrinter } from '@tabler/icons';
import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';
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
import InvoiceToPrint from './InvoiceToPrint';

const InvoiceCardModal = () => {
  const {
    selectedInvoice: invoice,
    selectedInvoiceOpened: opened,
    selectedInvoiceLoading: loading,
    selectedInvoiceError: error,
  } = useAppSelector(invoicePageSelector);
  const dispatch = useAppDispatch();
  const largeScreen = useMediaQuery('(min-width: 768px)');
  const invoiceRef = useRef<HTMLDivElement>(null);

  const onClose = () => {
    if (!loading) dispatch(unmountInvoice());
  };

  return (
    <>
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
            <ReactToPrint
              trigger={() => (
                <Button
                  size="xs"
                  leftIcon={<IconPrinter size={16} />}
                  color="green"
                  disabled={!invoice}
                >
                  Imprimir
                </Button>
              )}
              content={() => invoiceRef.current}
            />

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

      <div className="hidden">
        <div ref={invoiceRef}>
          {invoice ? <InvoiceToPrint invoice={invoice} /> : null}
        </div>
      </div>
    </>
  );
};

export default InvoiceCardModal;
