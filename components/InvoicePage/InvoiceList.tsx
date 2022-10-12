import { Button, Loader, ScrollArea, SegmentedControl, TextInput } from '@mantine/core';
import { IconFileInvoice, IconSearch } from '@tabler/icons';
import React, { useEffect, useRef, useState } from 'react';
import { useAppSelector } from 'store/hooks';
import { IInvoice } from 'types';
import { normalizeText } from 'utils';
import InvoiceListItem from './InvoiceListItem';
import InvoiceRated from './InvoiceRated';

const InvoiceList = () => {
  const { invoices } = useAppSelector(state => state.InvoicePageReducer);
  const growRate = 25;

  const [paidInvoices, setPaidInvoices] = useState<IInvoice[]>([]);
  const [separatedInvoices, setSeparateInvoices] = useState<IInvoice[]>([]);
  const [pendingInvoices, setPendingInvoices] = useState<IInvoice[]>([]);
  const [canceledInvoices, setCancelInvoices] = useState<IInvoice[]>([]);

  const [filter, setFilter] = useState<string | undefined>('all');
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [filteredInvoices, setFilteredInvoices] = useState<IInvoice[]>([]);
  const [invoiceList, setInvoceList] = useState<IInvoice[]>([]);
  const [invoiceLegth, setInvoiceLength] = useState(growRate);
  const debounceInterval = useRef<undefined | NodeJS.Timeout>(undefined);

  const classifyInvoices = () => {
    const paid: IInvoice[] = [];
    const cancel: IInvoice[] = [];
    const separate: IInvoice[] = [];
    const pending: IInvoice[] = [];

    invoices.forEach(invoice => {
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

  const filterInvoices = () => {
    let result: IInvoice[] = [];

    if (filter === 'all') result = invoices.slice();
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

  const updateSearch = (value: string) => {
    if (debounceInterval.current) clearTimeout(debounceInterval.current);
    setLoading(true);
    debounceInterval.current = setTimeout(() => {
      setLoading(false);
      setSearch(value);
    }, 500);
  };

  const showMoreInvoices = () => {
    setInvoiceLength(current => (current += growRate));
  };

  useEffect(() => {
    console.log('Invoices', invoices.length);
    classifyInvoices();
  }, [invoices]);

  useEffect(() => {
    console.log('filter', invoices.length);
    filterInvoices();
  }, [filter, search]);

  useEffect(() => {
    setInvoceList(filteredInvoices.slice(0, invoiceLegth));
  }, [invoiceLegth]);

  return (
    <div className="rounded bg-header px-3 py-4">
      <header className="mb-2 px-2">
        <h2 className="mb-2 text-center text-xl font-bold tracking-widest text-light">Facturas</h2>
        <TextInput
          size="xs"
          icon={loading ? <Loader size={14} variant="dots" /> : <IconSearch size={14} stroke={1.5} />}
          placeholder="Buscar Factura"
          className="mb-2"
          onChange={({ target }) => updateSearch(target.value)}
        />
        <SegmentedControl
          size="xs"
          value={filter}
          onChange={setFilter}
          data={[
            { label: 'Todas', value: 'all' },
            { label: 'Pagadas', value: 'paid' },
            { label: 'Creditos', value: 'pending' },
            { label: 'Apartados', value: 'separated' },
            { label: 'Canceladas', value: 'canceled' },
          ]}
        />
      </header>

      <div className="mb-2 rounded-md bg-slate-800 bg-opacity-50">
        <ScrollArea className="h-80 px-4 py-5 3xl:h-[34rem]">
          <div className="flex flex-col gap-y-4">
            {invoiceList.map(invoice => (
              <InvoiceListItem key={invoice.id} invoice={invoice} />
            ))}
            {Boolean(filteredInvoices.length) && invoiceLegth <= filteredInvoices.length + 1 && (
              <Button onClick={showMoreInvoices}>Mostrar más facturas</Button>
            )}
          </div>
        </ScrollArea>
      </div>

      <InvoiceRated
        paid={paidInvoices.length}
        pending={pendingInvoices.length}
        separated={separatedInvoices.length}
        canceled={canceledInvoices.length}
      />

      <footer className="flex justify-end">
        <Button leftIcon={<IconFileInvoice />}>Registrar Factura</Button>
      </footer>
    </div>
  );
};

export default InvoiceList;
