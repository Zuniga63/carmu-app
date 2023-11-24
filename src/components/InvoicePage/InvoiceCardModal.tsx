import type { IInvoicePayment } from '@/types';
import { useMediaQuery } from '@mantine/hooks';
import { useState } from 'react';
import { useInvoicePageStore } from '@/store/invoices-page.store';
import { useGetInvoiceById } from '@/hooks/react-query/invoices.hooks';

import { ActionIcon, Button, Modal } from '@mantine/core';
import { IconCash, IconPrinter } from '@tabler/icons-react';
import EmptyInvoice from './EmptyInvoice';
import InvoiceCard from './InvoiceCard';
import InvoiceCardModalHeader from './InvoiceCardModalHeader';
import InvoicePaymentForm from './InvoicePaymentForm';
import CancelInvoicePaymentForm from './CancelInvoicePaymentForm';
import CancelInvoiceForm from './CancelInvoiceForm';

const InvoiceCardModal = () => {
  const largeScreen = useMediaQuery('(min-width: 768px)');

  const invoiceId = useInvoicePageStore(state => state.invoiceIdToShow);
  const unmountInvoiceToShow = useInvoicePageStore(state => state.unmountInvoiceToShow);
  const showPrinterModal = useInvoicePageStore(state => state.showPrinterModal);

  const [paymentFormIsOpen, setPaymentFormIsOpen] = useState(false);
  const [cancelInvoiceFormIsOpen, setCancelInvoiceFormIsOpen] = useState(false);
  const [cancelInvoicePaymentFormIsOpen, setCancelInvoicePaymentFormIsOpen] = useState(false);
  const [paymentToCancel, setPaymentToCancel] = useState<IInvoicePayment | undefined>();

  const { data: invoice, isLoading, isError } = useGetInvoiceById(invoiceId);

  const showPaymentForm = () => {
    setPaymentFormIsOpen(true);
  };

  const hidePaymentForm = () => {
    setPaymentFormIsOpen(false);
  };

  const showCancelInvoiceForm = () => {
    setCancelInvoiceFormIsOpen(true);
  };

  const hideCancelInvoiceForm = () => {
    setCancelInvoiceFormIsOpen(false);
  };

  const showCancelInvoicePaymentForm = (payment: IInvoicePayment) => {
    setCancelInvoicePaymentFormIsOpen(true);
    setPaymentToCancel(payment);
  };

  const hideCancelInvoicePaymentForm = () => {
    setCancelInvoicePaymentFormIsOpen(false);
    setPaymentToCancel(undefined);
  };

  const handleClose = () => {
    if (isLoading) return;
    unmountInvoiceToShow();
  };

  const handlePrint = () => {
    if (!invoice) return;
    showPrinterModal(invoice.id);
  };

  return (
    <>
      <Modal
        size={largeScreen ? '70%' : '100%'}
        opened={Boolean(invoiceId)}
        onClose={handleClose}
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
            cancel={invoice?.cancel}
            onClose={handleClose}
          />

          <div className="bg-gradient-to-r from-red-500 via-purple-600 to-blue-500 px-4 py-4">
            {invoice ? (
              <InvoiceCard onPaymentCancel={showCancelInvoicePaymentForm} invoice={invoice} />
            ) : (
              <EmptyInvoice loading={isLoading} hasError={isError} />
            )}
          </div>

          <footer className="flex items-center justify-between rounded-b-lg bg-gray-300 p-4 dark:bg-header">
            <div className="flex items-center gap-x-2">
              <ActionIcon size="lg" color="blue" disabled={!invoice} onClick={handlePrint}>
                <IconPrinter size={24} stroke={2} />
              </ActionIcon>
            </div>

            {!invoice?.cancel ? (
              <div className="flex gap-x-4">
                <Button leftIcon={<IconCash />} color="red" onDoubleClick={showCancelInvoiceForm}>
                  Anular Factura
                </Button>

                <Button leftIcon={<IconCash />} color="grape" disabled={!invoice?.balance} onClick={showPaymentForm}>
                  Registrar Pago
                </Button>
              </div>
            ) : null}
          </footer>
        </div>
      </Modal>

      <InvoicePaymentForm isOpen={paymentFormIsOpen} invoice={invoice} onClose={hidePaymentForm} />
      <CancelInvoicePaymentForm
        isOpen={cancelInvoicePaymentFormIsOpen}
        invoice={invoice}
        onCloseModal={hideCancelInvoicePaymentForm}
        payment={paymentToCancel}
      />
      <CancelInvoiceForm isOpen={cancelInvoiceFormIsOpen} invoice={invoice} onClose={hideCancelInvoiceForm} />
    </>
  );
};

export default InvoiceCardModal;
