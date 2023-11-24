import { useInvoicePageStore } from '@/store/invoices-page.store';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useGetInvoiceById } from './react-query/invoices.hooks';

export type InvoicePrintSize = 'md' | 'lg' | 'sm';

export function useInvoiceToPrintModal() {
  const invoiceId = useInvoicePageStore(state => state.invoiceIdToPrint);
  const hidePrinterModal = useInvoicePageStore(state => state.hidePrinterModal);

  const { data: invoice, isError, isLoading } = useGetInvoiceById(invoiceId);

  const [size, setSize] = useState<InvoicePrintSize>('lg');
  const printRef = useRef<HTMLDivElement | null>(null);
  const promiseResolveRef = useRef<unknown>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const closeModal = () => {
    if (isPrinting) return;
    hidePrinterModal();
  };

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    onBeforeGetContent: () => {
      return new Promise(resolve => {
        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      promiseResolveRef.current = null;
      setIsPrinting(false);
    },
  });

  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      (promiseResolveRef.current as () => void)();
    }
  }, [isPrinting]);

  const changeInvoiceSize = (size: InvoicePrintSize) => setSize(size);

  return {
    isOpen: Boolean(invoice),
    isLoading,
    isError,
    size,
    printRef,
    invoice,
    closeModal,
    handlePrint,
    changeInvoiceSize,
  };
}
