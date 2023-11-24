import { useGetAllInvoices } from '@/hooks/react-query/invoices.hooks';
import { ChangeEventHandler, useEffect, useRef, useState } from 'react';
import { useInvoicePageStore } from '@/store/invoices-page.store';

import { ActionIcon, Collapse, Loader, SegmentedControl, TextInput, Tooltip } from '@mantine/core';
import {
  IconAdjustmentsHorizontal,
  IconAdjustmentsOff,
  IconBuildingStore,
  IconFileInvoice,
  IconReload,
  IconSearch,
} from '@tabler/icons-react';

export default function InvoiceListHeader() {
  const { isRefetching, refetch } = useGetAllInvoices();

  const filtersIsOpen = useInvoicePageStore(state => state.filtersIsOpen);
  const filter = useInvoicePageStore(state => state.filter);
  const updateSearch = useInvoicePageStore(state => state.updateSearch);
  const filterToggle = useInvoicePageStore(state => state.toggleFilters);
  const updateFilter = useInvoicePageStore(state => state.updateFilter);
  const showGeneralForm = useInvoicePageStore(state => state.showGeneralForm);
  const showCounterForm = useInvoicePageStore(state => state.showCounterForm);

  const [searchIsLoading, setSearchIsLoading] = useState(false);
  const debounceInterval = useRef<undefined | NodeJS.Timeout>(undefined);

  const clearIntervals = () => {
    if (debounceInterval.current) clearTimeout(debounceInterval.current);
  };

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    clearIntervals();
    setSearchIsLoading(true);
    debounceInterval.current = setTimeout(() => {
      setSearchIsLoading(false);
      updateSearch(target.value);
    }, 300);
  };

  const handleRefresh = () => refetch();
  const handleFilterClick = () => filterToggle();
  const handleGeneralFormClick = () => showGeneralForm();
  const handleCounterFormClick = () => showCounterForm();

  useEffect(() => {
    return clearIntervals;
  }, []);

  return (
    <header className="px-4 py-2">
      <div className="flex items-center justify-between gap-x-2">
        <div className="flex-grow">
          <TextInput
            size="xs"
            icon={searchIsLoading ? <Loader size={14} variant="dots" /> : <IconSearch size={14} stroke={1.5} />}
            placeholder="Buscar Factura"
            onChange={handleSearchChange}
            name="search-invoices"
            autoComplete="off"
            role="search"
          />
        </div>

        {/* ACTIONS */}
        <div className="flex flex-shrink-0 gap-x-1">
          <Tooltip label="Actualizar Facturas">
            <ActionIcon loading={isRefetching} color="blue" onClick={handleRefresh}>
              <IconReload size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Facturación Rápida">
            <ActionIcon color="green" onClick={handleCounterFormClick}>
              <IconBuildingStore stroke={2} size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Facturación Normal">
            <ActionIcon color="grape" onClick={handleGeneralFormClick}>
              <IconFileInvoice size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Filtros">
            <ActionIcon color="yellow" onClick={handleFilterClick}>
              {filtersIsOpen ? <IconAdjustmentsOff size={18} /> : <IconAdjustmentsHorizontal size={18} />}
            </ActionIcon>
          </Tooltip>
        </div>
      </div>

      <Collapse in={filtersIsOpen}>
        <SegmentedControl
          size="xs"
          value={filter}
          onChange={updateFilter}
          className="mt-2"
          data={[
            { label: 'Todas', value: 'all' },
            { label: 'Pagadas', value: 'paid' },
            { label: 'Creditos', value: 'pending' },
            { label: 'Apartados', value: 'separated' },
            { label: 'Canceladas', value: 'canceled' },
          ]}
        />
      </Collapse>
    </header>
  );
}
