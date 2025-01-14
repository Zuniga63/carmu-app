import { useEffect, useMemo, useState } from 'react';
import { useGetAllInvoices } from './react-query/invoices.hooks';
import { useInvoicePageStore } from '@/store/invoices-page.store';

export function useInvoiceList() {
  const growRate = 25;

  const search = useInvoicePageStore(state => state.search);
  const invoiceNumber = useInvoicePageStore(state => state.invoiceNumber);
  const filter = useInvoicePageStore(state => state.filter);
  const udpateFilter = useInvoicePageStore(state => state.updateFilter);

  const { data: invoices = [], isLoading, isRefetching } = useGetAllInvoices({ search, invoiceNumber });

  const [invoiceLegth, setInvoiceLength] = useState(growRate);

  const filteredInvoices = useMemo(() => {
    let result: typeof invoices = [];

    if (filter === 'all') result = [...invoices];
    else if (filter === 'paid') result = invoices.filter(invoice => !invoice.balance);
    else if (filter === 'pending') result = invoices.filter(invoice => invoice.balance && !invoice.isSeparate);
    else if (filter === 'separated') result = invoices.filter(invoice => invoice.isSeparate && invoice.balance);
    else if (filter === 'canceled') result = invoices.filter(invoice => invoice.cancel);

    // result.reverse();
    return result;
  }, [invoices, filter, search]);

  const invoiceList = useMemo(() => {
    return filteredInvoices.slice(0, invoiceLegth);
  }, [filteredInvoices, invoiceLegth]);

  const showMoreInvoices = () => {
    setInvoiceLength(current => (current += growRate));
  };

  useEffect(() => {
    udpateFilter('all');
  }, [isRefetching]);

  const showMoreButtonInvoice =
    Boolean(invoiceList.length && !isLoading) && invoiceLegth <= filteredInvoices.length + 1;

  return {
    invoices: invoiceList,
    isLoading,
    showMoreButtonInvoice,
    showMoreInvoices,
  };
}
