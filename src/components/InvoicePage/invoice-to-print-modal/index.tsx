import { useInvoiceToPrintModal } from '@/hooks/use-invoice-to-print-modal';

import ModalContainer from './modal-container';
import PrintButtons from './print-buttons';
import InvoiceContainer from './invoice-container';
import InvoiceHeader from './invoice-header';
import InvoiceInfo from './invoice-info';
import InvoiceItemList from './invoice-item-list';
import InvoiceItemContainer from './invoice-item-container';
import InvoiceResume from './invoice-resume';
import InvoicePayment from './invoice-payment';
import InvoiceFooter from './invoice-footer';

export default function InvoiceToPrintModal() {
  const { isOpen, size, printRef, invoice, isError, isLoading, closeModal, handlePrint, changeInvoiceSize } =
    useInvoiceToPrintModal();

  return (
    <ModalContainer isOpen={isOpen} onClose={closeModal} onPrint={handlePrint}>
      <InvoiceContainer size={size} ref={printRef} isLoading={isLoading} hasError={isError}>
        <InvoiceHeader size={size} isSeparate={invoice?.isSeparate} invoiceNumber={invoice?.prefixNumber} />

        <InvoiceInfo size={size} invoice={invoice} />

        <InvoiceItemContainer>
          <InvoiceItemList size={size} items={invoice?.items} />

          <InvoiceResume
            size={size}
            subtotal={invoice?.subtotal}
            discount={invoice?.discount}
            totalAmount={invoice?.amount}
          />
        </InvoiceItemContainer>

        <InvoicePayment
          size={size}
          payments={invoice?.payments}
          cash={invoice?.cash}
          cashChange={invoice?.cashChange}
          balance={invoice?.balance}
        />

        <InvoiceFooter sellerName={invoice?.sellerName} />
      </InvoiceContainer>

      <PrintButtons onClick={changeInvoiceSize} size={size} />
    </ModalContainer>
  );
}
