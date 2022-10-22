import React from 'react';
import { Button, ScrollArea } from '@mantine/core';
import { ICustomer } from 'types';
import CustomerTableItem from './CustomerTableItem';
import { IconWriting } from '@tabler/icons';

interface Props {
  customers: ICustomer[];
  openForm(): void;
  mountCustomer(customer: ICustomer): void;
  deleteCustomer(customer: ICustomer): Promise<void>;
}
const CustomerTable = ({ customers, openForm, mountCustomer, deleteCustomer }: Props) => {
  return (
    <div className="mx-auto w-11/12 pt-4 text-light">
      <header className="rounded-t-md bg-header px-6 py-2">
        <h2 className="text-center text-xl font-bold tracking-wider">Listado de Clientes</h2>
      </header>
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
            {customers.map(customer => (
              <CustomerTableItem
                customer={customer}
                key={customer.id}
                mount={mountCustomer}
                onDelete={deleteCustomer}
              />
            ))}
          </tbody>
        </table>
      </ScrollArea>
      <footer className="flex justify-end rounded-b-md bg-header px-6 py-2">
        <Button leftIcon={<IconWriting />} onClick={() => openForm()}>
          Agregar Cliente
        </Button>
      </footer>
    </div>
  );
};

export default CustomerTable;
