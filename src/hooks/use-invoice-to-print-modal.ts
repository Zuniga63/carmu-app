import { hidePrintModal, invoicePageSelector } from '@/features/InvoicePage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect, useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

export type InvoicePrintSize = 'md' | 'lg' | 'sm';

export function useInvoiceToPrintModal() {
  const { invoiceToPrint: invoice, formOpened, counterSaleFormOpened } = useAppSelector(invoicePageSelector);

  const [size, setSize] = useState<InvoicePrintSize>('lg');
  const printRef = useRef<HTMLDivElement | null>(null);
  const promiseResolveRef = useRef<unknown>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const dispatch = useAppDispatch();

  const closeModal = () => {
    dispatch(hidePrintModal());
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
    isOpen: !(formOpened || counterSaleFormOpened) && Boolean(invoice),
    size,
    printRef,
    invoice,
    closeModal,
    handlePrint,
    changeInvoiceSize,
  };
}
