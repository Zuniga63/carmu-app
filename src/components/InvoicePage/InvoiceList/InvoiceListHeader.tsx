import { ActionIcon, Collapse, Loader, SegmentedControl, TextInput, Tooltip } from '@mantine/core';
import {
  IconAdjustmentsHorizontal,
  IconAdjustmentsOff,
  IconBuildingStore,
  IconFileInvoice,
  IconReload,
  IconSearch,
} from '@tabler/icons-react';
import { invoicePageSelector, refreshInvoices, showCounterSaleForm, showNewInvoiceForm } from '@/features/InvoicePage';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

type Props = {
  filter?: string;
  filterOpened: boolean;
  updateFilter: (value: string) => void;
  filterToggle: () => void;
  loadingSearch: boolean;
  updateSearch: (value: string) => void;
};

export default function InvoiceListHeader({
  filter,
  filterOpened,
  updateFilter,
  filterToggle,
  loadingSearch,
  updateSearch,
}: Props) {
  const { loading } = useAppSelector(invoicePageSelector);
  const dispatch = useAppDispatch();

  return (
    <header className="px-4 py-2">
      <div className="flex items-center justify-between gap-x-2">
        <div className="flex-grow">
          <TextInput
            size="xs"
            icon={loadingSearch ? <Loader size={14} variant="dots" /> : <IconSearch size={14} stroke={1.5} />}
            placeholder="Buscar Factura"
            onChange={({ target }) => updateSearch(target.value)}
          />
        </div>

        {/* ACTIONS */}
        <div className="flex flex-shrink-0 gap-x-1">
          <Tooltip label="Actualizar Facturas">
            <ActionIcon loading={loading} color="blue" onClick={() => dispatch(refreshInvoices())}>
              <IconReload size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Facturación Rápida">
            <ActionIcon color="green" onClick={() => dispatch(showCounterSaleForm())}>
              <IconBuildingStore stroke={2} size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Facturación Normal">
            <ActionIcon color="grape" onClick={() => dispatch(showNewInvoiceForm())}>
              <IconFileInvoice size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Filtros">
            <ActionIcon color="yellow" onClick={filterToggle}>
              {filterOpened ? <IconAdjustmentsOff size={18} /> : <IconAdjustmentsHorizontal size={18} />}
            </ActionIcon>
          </Tooltip>
        </div>
      </div>

      <Collapse in={filterOpened}>
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
