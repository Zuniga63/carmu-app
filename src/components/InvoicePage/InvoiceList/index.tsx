import InvoiceRated from './InvoiceRated';
import InvoiceListHeader from './InvoiceListHeader';
import InvoiceListBody from './InvoiceListBody';
import { useInvoiceList } from '@/hooks/useInvoiceList';

export default function InvoiceList() {
  const {
    invoices,
    searchLoading,
    updateSearch,
    filter,
    setFilter,
    filterOpened,
    filterToggle,
    showMoreButtonInvoice,
    showMoreInvoices,
    invoiceCount,
  } = useInvoiceList();

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col overflow-hidden rounded bg-header">
      <InvoiceListHeader
        loadingSearch={searchLoading}
        updateSearch={updateSearch}
        filter={filter}
        filterOpened={filterOpened}
        filterToggle={filterToggle}
        updateFilter={setFilter}
      />

      <InvoiceListBody
        invoices={invoices}
        showMoreButtonInvoice={showMoreButtonInvoice}
        onShowMore={showMoreInvoices}
      />

      {/* FOOTER */}
      <footer className="rounded-b-md bg-dark px-4 py-2 dark:bg-header">
        <InvoiceRated
          paid={invoiceCount.paid}
          pending={invoiceCount.pending}
          separated={invoiceCount.separated}
          canceled={invoiceCount.canceled}
        />
      </footer>
    </div>
  );
}
