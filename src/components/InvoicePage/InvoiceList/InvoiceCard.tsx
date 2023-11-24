import { useInvoicePageStore } from '@/store/invoices-page.store';
import { MouseEventHandler, useState } from 'react';
import type { IInvoice } from '@/types';

import { Button, Collapse } from '@mantine/core';
import { IconFileInvoice, IconPrinter } from '@tabler/icons-react';
import InvoiceCardHeader from './InvoiceCardHeader';
import InvoiceCardBody from './InvoiceCardBody';

interface Props {
  invoice: IInvoice;
}

export default function InvoiceCard({ invoice }: Props) {
  const [opened, setOpened] = useState(false);
  const mountInvoiceToShow = useInvoicePageStore(state => state.mountInvoiceToShow);
  const showPrinterModal = useInvoicePageStore(state => state.showPrinterModal);

  const isToday = invoice.expeditionDate.isToday();

  const showInvoice: MouseEventHandler<HTMLButtonElement> = event => {
    event.stopPropagation();
    mountInvoiceToShow(invoice.id);
  };

  const handlePrinterClick: MouseEventHandler<HTMLButtonElement> = event => {
    event.stopPropagation();
    showPrinterModal(invoice.id);
  };

  return (
    <div
      className={`overflow-hidden rounded-lg border text-light ${
        isToday
          ? invoice.balance
            ? invoice.isSeparate
              ? 'border-blue-700 bg-blue-900 shadow-blue-800 hover:bg-blue-700 hover:shadow-blue-500'
              : 'border-red-700 bg-red-900 shadow-red-800 hover:bg-red-800 hover:shadow-red-500'
            : 'border-emerald-700 bg-emerald-900 shadow-emerald-800 hover:bg-emerald-800 hover:shadow-emerald-900'
          : 'border-header bg-header shadow-header hover:border-dark hover:bg-dark hover:shadow-neutral-900'
      } shadow  transition-colors ${invoice.cancel ? 'opacity-50' : ''} `}
    >
      <InvoiceCardHeader invoice={invoice} onClick={() => setOpened(!opened)} />
      <Collapse in={opened}>
        <InvoiceCardBody invoice={invoice} />

        <footer className="flex justify-between px-4 py-3">
          <Button size="xs" color="dark" leftIcon={<IconPrinter size={16} />} onClick={handlePrinterClick}>
            Imprimir
          </Button>
          <Button size="xs" leftIcon={<IconFileInvoice size={16} />} onClick={showInvoice}>
            Ver detalles
          </Button>
        </footer>
      </Collapse>
    </div>
  );
}
