import { useEffect, useRef, useState } from 'react';
import { invoicePageSelector } from 'src/features/InvoicePage';
import { useAppSelector } from 'src/store/hooks';
import { IInvoice } from 'src/types';
import { buildInvoice, normalizeText } from 'src/utils';

export function useInvoiceList() {
  const { invoices, loading: loadingData } = useAppSelector(invoicePageSelector);
  const growRate = 25;

  const [paidInvoices, setPaidInvoices] = useState<IInvoice[]>([]);
  const [separatedInvoices, setSeparateInvoices] = useState<IInvoice[]>([]);
  const [pendingInvoices, setPendingInvoices] = useState<IInvoice[]>([]);
  const [canceledInvoices, setCancelInvoices] = useState<IInvoice[]>([]);

  const [filter, setFilter] = useState<string | undefined>('all');
  const [filterOpened, setFilterOpened] = useState(false);
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [searchLoading, setSearchLoading] = useState(false);
  const [filteredInvoices, setFilteredInvoices] = useState<IInvoice[]>([]);
  const [invoiceList, setInvoceList] = useState<IInvoice[]>([]);
  const [invoiceLegth, setInvoiceLength] = useState(growRate);
  const debounceInterval = useRef<undefined | NodeJS.Timeout>(undefined);

  const filterInvoices = () => {
    let result: IInvoice[] = [];

    if (filter === 'all') result = invoices.map(buildInvoice);
    else if (filter === 'paid') result = paidInvoices.slice();
    else if (filter === 'pending') result = pendingInvoices.slice();
    else if (filter === 'separated') result = separatedInvoices.slice();
    else if (filter === 'canceled') result = canceledInvoices.slice();

    if (search) {
      const text = normalizeText(search);
      result = result.filter(invoice => invoice.search.includes(text));
    }

    result.reverse();
    setFilteredInvoices(result);
    setInvoceList(result.slice(0, growRate));
    setInvoiceLength(growRate);
  };

  const classifyInvoices = () => {
    const paid: IInvoice[] = [];
    const cancel: IInvoice[] = [];
    const separate: IInvoice[] = [];
    const pending: IInvoice[] = [];

    invoices.forEach(invoiceData => {
      const invoice = buildInvoice(invoiceData);

      if (invoice.cancel) cancel.push(invoice);
      else if (!invoice.balance) paid.push(invoice);
      else if (invoice.isSeparate) separate.push(invoice);
      else pending.push(invoice);
    });

    setPaidInvoices(paid);
    setCancelInvoices(cancel);
    setSeparateInvoices(separate);
    setPendingInvoices(pending);
    filterInvoices();
  };

  const updateSearch = (value: string) => {
    if (debounceInterval.current) clearTimeout(debounceInterval.current);
    setSearchLoading(true);
    debounceInterval.current = setTimeout(() => {
      setSearchLoading(false);
      setSearch(value);
    }, 500);
  };

  const showMoreInvoices = () => {
    setInvoiceLength(current => (current += growRate));
  };

  const filterToggle = () => {
    setFilterOpened(!filterOpened);
  };

  useEffect(() => {
    setFilter('all');
    classifyInvoices();
  }, [invoices]);

  useEffect(() => {
    filterInvoices();
  }, [filter, search]);

  useEffect(() => {
    setInvoceList(filteredInvoices.slice(0, invoiceLegth));
  }, [invoiceLegth]);

  const showMoreButtonInvoice =
    Boolean(invoiceList.length && !loadingData) && invoiceLegth <= filteredInvoices.length + 1;

  return {
    invoices: invoiceList,
    searchLoading,
    updateSearch,
    filter,
    setFilter,
    filterOpened,
    filterToggle,
    showMoreButtonInvoice,
    showMoreInvoices,
    invoiceCount: {
      paid: paidInvoices.length,
      pending: pendingInvoices.length,
      separated: separatedInvoices.length,
      canceled: canceledInvoices.length,
    },
  };
}
