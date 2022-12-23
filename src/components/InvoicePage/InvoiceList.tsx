import {
  ActionIcon,
  Button,
  Loader,
  ScrollArea,
  SegmentedControl,
  TextInput,
} from '@mantine/core';
import { IconFileInvoice, IconReload, IconSearch } from '@tabler/icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  fetchInvoiceData,
  invoicePageSelector,
  showCounterSaleForm,
  showNewInvoiceForm,
} from 'src/features/InvoicePage';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { IInvoice } from 'src/types';
import { buildInvoice, normalizeText } from 'src/utils';
import InvoiceListItem from './InvoiceListItem';
import InvoiceRated from './InvoiceRated';

const InvoiceList = () => {
  const { invoices, loading: loadingData } =
    useAppSelector(invoicePageSelector);
  const dispatch = useAppDispatch();
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
    setFilter('all');
    classifyInvoices();
  }, [invoices]);

  useEffect(() => {
    filterInvoices();
  }, [filter, search]);

  useEffect(() => {
    setInvoceList(filteredInvoices.slice(0, invoiceLegth));
  }, [invoiceLegth]);

  return (
    <div className="relative rounded bg-gray-300 px-3 pt-4 pb-2 dark:bg-header">
      <div className="absolute top-4 right-2">
        <div className="flex items-center">
          <ActionIcon
            loading={loadingData}
            color="blue"
            onClick={() => dispatch(fetchInvoiceData())}
          >
            <IconReload size={18} />
          </ActionIcon>
        </div>
      </div>
      <header className="mb-2 px-2">
        <h2 className="mb-2 text-center text-xl font-bold tracking-widest text-dark dark:text-light">
          Facturas
        </h2>

        {/* FILTERS */}
        <TextInput
          size="xs"
          icon={
            loading ? (
              <Loader size={14} variant="dots" />
            ) : (
              <IconSearch size={14} stroke={1.5} />
            )
          }
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

      <div className="mb-2 rounded-md bg-white bg-opacity-50 dark:bg-slate-800">
        {loadingData ? (
          <div className="flex h-80 flex-col items-center justify-center gap-y-4">
            <Loader />
            <p className="animate-pulse text-center text-xs tracking-widest text-dark dark:text-light">
              Se están recuperando las facturas, esto puede tardar un poco...
            </p>
          </div>
        ) : (
          <ScrollArea className="h-80 px-4 py-3 3xl:h-[40rem]">
            <div className="flex flex-col gap-y-4">
              {invoiceList.map(invoice => (
                <InvoiceListItem key={invoice.id} invoice={invoice} />
              ))}
              {Boolean(invoiceList.length && !loadingData) &&
                invoiceLegth <= filteredInvoices.length + 1 && (
                  <Button onClick={showMoreInvoices}>
                    Mostrar más facturas
                  </Button>
                )}
            </div>
          </ScrollArea>
        )}
      </div>

      <InvoiceRated
        paid={paidInvoices.length}
        pending={pendingInvoices.length}
        separated={separatedInvoices.length}
        canceled={canceledInvoices.length}
      />

      <div className="mt-2 flex justify-center gap-x-4">
        <Button
          className="flex-shrink-0"
          size="xs"
          leftIcon={<IconFileInvoice size={16} />}
          onClick={() => dispatch(showCounterSaleForm())}
        >
          Fact. Rapida
        </Button>
        <Button
          className="flex-shrink-0"
          size="xs"
          leftIcon={<IconFileInvoice size={16} />}
          onClick={() => dispatch(showNewInvoiceForm())}
          color="green"
        >
          Fact. Normal
        </Button>
      </div>
    </div>
  );
};

export default InvoiceList;
