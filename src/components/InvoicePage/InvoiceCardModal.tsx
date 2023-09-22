import { ActionIcon, Button, Modal } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconCash, IconPrinter } from '@tabler/icons-react';
import {
  invoicePageSelector,
  showCancelInvoiceForm,
  showPaymentForm,
  showPrintModal,
  unmountInvoice,
} from '@/features/InvoicePage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { buildInvoiceFull } from '@/utils';
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

  const handlePrint = () => {
    if (!invoice) return;
    dispatch(showPrintModal(invoice));
  };

  const handleCancelInvoice = () => {
    dispatch(showCancelInvoiceForm());
  };

  const handleAddPayment = () => {
    dispatch(showPaymentForm());
  };

  return (
    <>
      <Modal size={largeScreen ? '70%' : '100%'} opened={opened} onClose={onClose} padding={0} withCloseButton={false}>
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
            onClose={onClose}
          />

          <div className="bg-gradient-to-r from-red-500 via-purple-600 to-blue-500 px-4 py-4">
            {invoice ? (
              <InvoiceCard invoice={buildInvoiceFull(invoice)} />
            ) : (
              <EmptyInvoice loading={loading} error={error} />
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
                <Button leftIcon={<IconCash />} color="red" onDoubleClick={handleCancelInvoice}>
                  Anular Factura
                </Button>

                <Button leftIcon={<IconCash />} color="grape" disabled={!invoice?.balance} onClick={handleAddPayment}>
                  Registrar Pago
                </Button>
              </div>
            ) : null}
          </footer>
        </div>
      </Modal>
    </>
  );
};

export default InvoiceCardModal;
