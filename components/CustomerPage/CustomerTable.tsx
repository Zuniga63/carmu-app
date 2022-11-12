import React, { useEffect, useRef, useState } from 'react';
import { Button, Loader, ScrollArea, TextInput } from '@mantine/core';
import { ICustomer } from 'types';
import CustomerTableItem from './CustomerTableItem';
import { IconRefresh, IconSearch, IconWriting } from '@tabler/icons';
import { normalizeText } from 'utils';

interface Props {
  customers: ICustomer[];
  fetchLoading: boolean;
  openForm(): void;
  mountCustomer(customer: ICustomer): void;
  mountCustomerToPayment(customer: ICustomer): void;
  deleteCustomer(customer: ICustomer): Promise<void>;
  refresh(): Promise<void>;
}

const CustomerTable = ({
  customers,
  fetchLoading,
  openForm,
  mountCustomer,
  deleteCustomer,
  mountCustomerToPayment,
  refresh,
}: Props) => {
  const [search, setSearch] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [filteredCustomers, setFilteredCustomers] = useState<ICustomer[]>([]);
  const debounceInterval = useRef<undefined | NodeJS.Timeout>(undefined);

  const updateSearch = (value: string) => {
    if (debounceInterval.current) clearTimeout(debounceInterval.current);
    setLoading(true);
    debounceInterval.current = setTimeout(() => {
      setLoading(false);
      setSearch(value);
    }, 250);
  };

  const filterCustomers = () => {
    let result = customers.slice();
    if (search) {
      result = result.filter(customer => {
        const text = normalizeText([customer.fullName, customer.documentNumber || ''].join(' ').trim());
        return text.includes(normalizeText(search));
      });
    }

    setFilteredCustomers(result);
  };

  useEffect(() => {
    filterCustomers();
  }, [customers, search]);

  return (
    <div className="mx-auto w-11/12 pt-4 text-light">
      <header className="relative rounded-t-md bg-header px-6 pt-2 pb-4">
        <h2 className="mb-4 text-center text-xl font-bold tracking-wider">Listado de Clientes</h2>
        <div className="grid grid-cols-3">
          <TextInput
            size="xs"
            icon={loading ? <Loader size={14} variant="dots" /> : <IconSearch size={14} stroke={1.5} />}
            placeholder="Buscar Cliente"
            className="flex-grow"
            onChange={({ target }) => updateSearch(target.value)}
            onFocus={({ target }) => {
              target.select();
            }}
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
        <ScrollArea className="relative h-[28rem] overflow-y-auto border border-y-0 border-x-header">
          <table className="min-w-full table-auto">
            <thead className="sticky top-0 bg-dark">
              <tr className="text-gray-300">
                <th scope="col" className="px-4 py-3 text-center uppercase tracking-wide">
                  Cliente
                </th>
                <th scope="col" className="px-4 py-3 text-center uppercase tracking-wide">
                  Contacto
                </th>
                <th scope="col" className="px-4 py-3 text-center uppercase tracking-wide">
                  Historial
                </th>
                <th scope="col" className="px-4 py-3 text-center uppercase tracking-wide">
                  Saldo
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map(customer => (
                <CustomerTableItem
                  customer={customer}
                  key={customer.id}
                  mount={mountCustomer}
                  mountToPayment={mountCustomerToPayment}
                  onDelete={deleteCustomer}
                />
              ))}
            </tbody>
          </table>
        </ScrollArea>
      ) : (
        <div className="flex h-96 animate-pulse items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader size={40} color="red" />
            <span className="tracking-widest">Cargando la información de los clientes...</span>
          </div>
        </div>
      )}

      <footer className="flex justify-end rounded-b-md bg-header px-6 py-2">
        <Button leftIcon={<IconWriting />} onClick={() => openForm()} disabled={fetchLoading}>
          Agregar Cliente
        </Button>
      </footer>
    </div>
  );
};

export default CustomerTable;
