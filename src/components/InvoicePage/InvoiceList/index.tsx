import { useInvoiceList } from '@/hooks/useInvoiceList';

import InvoiceRated from './InvoiceRated';
import InvoiceListHeader from './InvoiceListHeader';
import InvoiceListBody from './InvoiceListBody';

export default function InvoiceList() {
  const { invoices, showMoreButtonInvoice, showMoreInvoices, isLoading } = useInvoiceList();

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col overflow-hidden rounded bg-header">
      <InvoiceListHeader />

      <InvoiceListBody
        invoices={invoices}
        isLoading={isLoading}
        showMoreButtonInvoice={showMoreButtonInvoice}
        onShowMore={showMoreInvoices}
      />

      {/* FOOTER */}
      <InvoiceRated />
    </div>
  );
}
