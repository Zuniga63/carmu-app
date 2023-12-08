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
import { cn } from '@/utils';

export default function InvoiceToPrintModal() {
  const { isOpen, size, printRef, invoice, isError, isLoading, closeModal, handlePrint, changeInvoiceSize } =
    useInvoiceToPrintModal();

  return (
    <ModalContainer isOpen={isOpen} onClose={closeModal} onPrint={handlePrint}>
      <InvoiceContainer size={size} ref={printRef} isLoading={isLoading} hasError={isError}>
        <InvoiceHeader size={size} isSeparate={invoice?.isSeparate} invoiceNumber={invoice?.prefixNumber} />

        <div className={cn('grid grid-cols-1 items-start gap-x-2', { 'grid-cols-3 gap-x-4': size === 'lg' })}>
          <div>
            <InvoiceInfo size={size} invoice={invoice} />
            <InvoicePayment
              size={size}
              payments={invoice?.payments}
              cash={invoice?.cash}
              cashChange={invoice?.cashChange}
              balance={invoice?.balance}
              className={size !== 'lg' ? 'hidden' : 'block'}
            />
          </div>

          <InvoiceItemContainer size={size}>
            <InvoiceItemList items={invoice?.items} />

            <InvoiceResume
              size={size}
              subtotal={invoice?.subtotal}
              discount={invoice?.discount}
              totalAmount={invoice?.amount}
            />
          </InvoiceItemContainer>
        </div>

        <InvoicePayment
          size={size}
          payments={invoice?.payments}
          cash={invoice?.cash}
          cashChange={invoice?.cashChange}
          balance={invoice?.balance}
          className={size !== 'lg' ? 'block' : 'hidden'}
        />

        <InvoiceFooter size={size} invoice={invoice} />
      </InvoiceContainer>

      <PrintButtons onClick={changeInvoiceSize} size={size} />
    </ModalContainer>
  );
}
