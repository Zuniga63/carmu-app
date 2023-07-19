import { ActionIcon, Loader, Switch, TextInput, Tooltip } from '@mantine/core';
import { IconRefresh, IconSearch, IconUserPlus } from '@tabler/icons-react';
import { customerPageSelector, fetchCustomers, showCustomerForm } from 'src/features/CustomerPage';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { CustomerFilters } from 'src/types';

type Props = {
  filters: CustomerFilters;
  updateFilters: (filtersUpdated: CustomerFilters) => void;
  searchWaiting: boolean;
};

export default function CustomerTableHeader({ filters, searchWaiting, updateFilters }: Props) {
  const { fetchLoading } = useAppSelector(customerPageSelector);
  const dispatch = useAppDispatch();

  const handleSearch = (value: string) => {
    updateFilters({ ...filters, search: value });
  };

  const handleClick = () => {
    dispatch(fetchCustomers());
  };

  return (
    <div className="flex justify-center">
      <header className="mb-2 rounded-full bg-gray-300 px-6 pb-4 pt-2 dark:bg-header">
        <div className="flex items-center justify-center gap-x-4">
          <TextInput
            size="xs"
            icon={searchWaiting ? <Loader size={14} variant="dots" /> : <IconSearch size={14} stroke={1.5} />}
            placeholder="Buscar Cliente"
            className="w-1/2"
            value={filters.search}
            onChange={({ currentTarget }) => handleSearch(currentTarget.value)}
            onFocus={({ target }) => {
              target.select();
            }}
          />

          <Tooltip label="Actualizar clientes">
            <ActionIcon loading={fetchLoading} onClick={handleClick}>
              <IconRefresh size={18} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Nuevo Cliente">
            <ActionIcon onClick={() => dispatch(showCustomerForm())} variant="filled" color="blue">
              <IconUserPlus size={18} stroke={1.5} />
            </ActionIcon>
          </Tooltip>
        </div>
        <div className="flex justify-center gap-x-2 pt-2">
          {/* Customer With Debt */}
          <Switch
            label="Clientes con saldo"
            checked={filters.onlyCustomerWithDebt}
            onChange={({ currentTarget }) =>
              updateFilters({
                ...filters,
                onlyCustomerWithDebt: currentTarget.checked,
              })
            }
          />
          <Switch
            label="Ordenados por saldo"
            checked={filters.sortByBalance}
            onChange={({ currentTarget }) =>
              updateFilters({
                ...filters,
                sortByBalance: currentTarget.checked,
              })
            }
          />
          <Switch
            label="Ordenar por fecha ultimo pago"
            checked={filters.sortByRecentPayment}
            onChange={({ currentTarget }) =>
              updateFilters({
                ...filters,
                sortByRecentPayment: currentTarget.checked,
              })
            }
          />
          <Switch
            label="Invertir orden"
            checked={filters.reverse}
            disabled={!filters.sortByBalance && !filters.sortByRecentPayment}
            onChange={({ currentTarget }) => {
              updateFilters({
                ...filters,
                reverse: currentTarget.checked,
              });
            }}
          />
        </div>
      </header>
    </div>
  );
}
