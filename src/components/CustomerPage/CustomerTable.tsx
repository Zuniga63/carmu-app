import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Loader,
  ScrollArea,
  Switch,
  TextInput,
  Tooltip,
} from '@mantine/core';
import { ICustomer } from 'src/types';
import CustomerTableItem from './CustomerTableItem';
import {
  IconAlertCircle,
  IconCircleCheck,
  IconCircleX,
  IconRefresh,
  IconSearch,
  IconSkull,
  IconWriting,
} from '@tabler/icons';
import { normalizeText } from 'src/utils';
import dayjs from 'dayjs';

interface Props {
  customers: ICustomer[];
  fetchLoading: boolean;
  openForm(): void;
  mountCustomer(customer: ICustomer): void;
  mountCustomerToPayment(customer: ICustomer): void;
  deleteCustomer(customer: ICustomer): Promise<void>;
  refresh(): Promise<void>;
  paymentLoading: boolean;
  onGetPayments(customer: ICustomer): Promise<void>;
}

const CustomerTable = ({
  customers,
  fetchLoading,
  openForm,
  mountCustomer,
  deleteCustomer,
  mountCustomerToPayment,
  refresh,
  paymentLoading,
  onGetPayments,
}: Props) => {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [onlyCustomerWithDebt, setOnlyCustomerWithDebt] = useState(false);
  const [sortByBalance, setSortByBalance] = useState(false);
  const [reverse, setReverse] = useState(false);
  const [sortByRecentPayment, setSortByRecentPayment] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<ICustomer[]>([]);
  const debounceInterval = useRef<undefined | NodeJS.Timeout>(undefined);
  const [show, setShow] = useState(10);
  const [customerList, setCustomerList] = useState<ICustomer[]>([]);

  const updateSearch = (value: string) => {
    if (debounceInterval.current) clearTimeout(debounceInterval.current);
    setLoading(true);
    debounceInterval.current = setTimeout(() => {
      setLoading(false);
      setSearch(value);
    }, 250);
  };

  const filterCustomers = async () => {
    const result = customers.slice().filter(customer => {
      let isOk = true;
      if (onlyCustomerWithDebt) isOk = Boolean(customer.balance);

      if (isOk && search) {
        const text = normalizeText(
          [customer.fullName, customer.documentNumber || '', customer.alias]
            .join(' ')
            .trim()
        );
        isOk = text.includes(normalizeText(search));
      }

      return isOk;
    });

    if (sortByBalance) {
      result.sort((currentCustomer, lastCustomer) => {
        let result = 0;

        if (!currentCustomer.balance) result = -1;
        else if (!lastCustomer.balance) result = 1;
        else if (currentCustomer.balance < lastCustomer.balance) result = -1;
        else if (currentCustomer.balance > lastCustomer.balance) result = 1;

        if (reverse) result *= -1;

        return result;
      });
    }

    if (sortByRecentPayment) {
      result.sort((currentCustomer, lastCustomer) => {
        let result = 0;

        const currentCustomerDiff = dayjs().diff(
          currentCustomer.lastPayment || currentCustomer.firstPendingInvoice
        );

        const lastCustomerDiff = dayjs().diff(
          lastCustomer.lastPayment || lastCustomer.firstPendingInvoice
        );

        if (currentCustomerDiff < lastCustomerDiff) result = -1;
        else if (currentCustomerDiff > lastCustomerDiff) result = 1;

        if (reverse) result *= -1;

        return result;
      });
    }

    setFilteredCustomers(result);
    setShow(10);
  };

  useEffect(() => {
    filterCustomers();
  }, [
    customers,
    search,
    onlyCustomerWithDebt,
    sortByBalance,
    reverse,
    sortByRecentPayment,
  ]);

  useEffect(() => {
    setCustomerList(filteredCustomers.slice(0, show));
  }, [filteredCustomers, show]);

  return (
    <div className="mx-auto w-11/12 pt-4 text-dark dark:text-light">
      <header className="relative rounded-t-md bg-gray-300 px-6 pt-2 pb-4 dark:bg-header">
        <h2 className="mb-4 text-center text-xl font-bold tracking-wider">
          Listado de Clientes
        </h2>
        <TextInput
          size="sm"
          icon={
            loading ? (
              <Loader size={14} variant="dots" />
            ) : (
              <IconSearch size={14} stroke={1.5} />
            )
          }
          placeholder="Buscar Cliente"
          className="col-span-3 flex-grow lg:col-span-1"
          onChange={({ target }) => updateSearch(target.value)}
          onFocus={({ target }) => {
            target.select();
          }}
        />
        <div className="flex gap-x-2">
          {/* Customer With Debt */}
          <Switch
            label="Clientes con saldo"
            checked={onlyCustomerWithDebt}
            onChange={({ currentTarget }) =>
              setOnlyCustomerWithDebt(currentTarget.checked)
            }
          />
          <Switch
            label="Ordenados por saldo"
            checked={sortByBalance}
            onChange={({ currentTarget }) =>
              setSortByBalance(currentTarget.checked)
            }
          />
          <Switch
            label="Ordenar por fecha ultimo pago"
            checked={sortByRecentPayment}
            onChange={({ currentTarget }) =>
              setSortByRecentPayment(currentTarget.checked)
            }
          />
          <Switch
            label="Invertir orden"
            checked={reverse}
            disabled={!sortByBalance && !sortByRecentPayment}
            onChange={({ currentTarget }) => setReverse(currentTarget.checked)}
          />
        </div>

        {/* REFRESH BUTTON */}
        <button
          className="absolute top-4 right-4 rounded-full border border-cyan-500 p-1 text-blue-500 transition-colors hover:border-cyan-300 hover:text-blue-400 active:border-cyan-700 active:text-blue-700"
          onClick={refresh}
        >
          <IconRefresh size={18} />
        </button>
      </header>
      {!fetchLoading ? (
        <ScrollArea className="relative h-[28rem] overflow-y-auto border border-y-0 border-x-gray-300 dark:border-x-header">
          <table className="min-w-full table-auto">
            <thead className="sticky top-0 bg-gray-300 dark:bg-dark">
              <tr className="text-gray-dark dark:text-gray-300">
                <th
                  scope="col"
                  className="px-4 py-3 text-center uppercase tracking-wide"
                >
                  Cliente
                </th>
                <th
                  scope="col"
                  className="hidden px-4 py-3 text-center uppercase tracking-wide lg:table-cell"
                >
                  Contacto
                </th>
                <th
                  scope="col"
                  className="hidden px-4 py-3 text-center uppercase tracking-wide lg:table-cell"
                >
                  Historial
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-center uppercase tracking-wide"
                >
                  Saldo
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {customerList.map(customer => (
                <CustomerTableItem
                  customer={customer}
                  key={customer.id}
                  mount={mountCustomer}
                  mountToPayment={mountCustomerToPayment}
                  onDelete={deleteCustomer}
                  paymentLoading={paymentLoading}
                  onGetPayments={onGetPayments}
                />
              ))}
            </tbody>
          </table>
          {filteredCustomers.length > 0 && show < filteredCustomers.length ? (
            <div className="mx-auto w-1/2 py-4">
              <Button
                className="w-full"
                fullWidth
                onClick={() => setShow(current => current + 25)}
              >
                Mostrar mas Clientes
              </Button>
            </div>
          ) : null}
        </ScrollArea>
      ) : (
        <div className="flex h-96 animate-pulse items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader size={40} color="red" />
            <span className="tracking-widest">
              Cargando la información de los clientes...
            </span>
          </div>
        </div>
      )}

      <footer className="flex items-center justify-between rounded-b-md bg-gray-300 px-6 py-2 dark:bg-header">
        <div className="flex gap-x-2">
          <Tooltip label="Deuda de 0 a 3 meses" withArrow>
            <div>
              <IconCircleCheck size={24} className="text-green-500" />
            </div>
          </Tooltip>
          <Tooltip label="Deuda de 3 a 6 meses" withArrow>
            <div>
              <IconAlertCircle size={24} className="text-green-500" />
            </div>
          </Tooltip>
          <Tooltip label="Deuda de 6 a 9 meses" withArrow>
            <div>
              <IconCircleX size={24} className="text-green-500" />
            </div>
          </Tooltip>
          <Tooltip label="Superior a 9 meses" withArrow>
            <div>
              <IconSkull size={24} className="text-green-500" />
            </div>
          </Tooltip>
        </div>

        <div className="flex gap-x-2">
          <Tooltip label="Pago relaizado en los ultimos 28 días" withArrow>
            <div>
              <IconSkull size={24} className="text-green-500" />
            </div>
          </Tooltip>
          <Tooltip label="Ultimo pago hace mas de 28 día" withArrow>
            <div>
              <IconSkull size={24} className="text-amber-500" />
            </div>
          </Tooltip>
          <Tooltip label="Ultimo pago hace mas de 45 días" withArrow>
            <div>
              <IconSkull size={24} className="text-red-500" />
            </div>
          </Tooltip>
          <Tooltip label="Ultimo pago hace mas de 90 días" withArrow>
            <div>
              <IconSkull size={24} className="text-purple-500" />
            </div>
          </Tooltip>
        </div>
        <Button
          leftIcon={<IconWriting />}
          onClick={() => openForm()}
          disabled={fetchLoading}
        >
          Agregar Cliente
        </Button>
      </footer>
    </div>
  );
};

export default CustomerTable;
