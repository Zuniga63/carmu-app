import { Loader, ScrollArea } from '@mantine/core';
import { ICustomer } from '@/types';
import CustomerTableItem from './CustomerTableItem';
import { useGetAllCustomers } from '@/hooks/react-query/customers.hooks';

function Loading() {
  return (
    <div className="flex h-96 animate-pulse items-center justify-center">
      <div className="flex flex-col items-center">
        <Loader size={40} color="red" />
        <span className="tracking-widest">Cargando la información de los clientes...</span>
      </div>
    </div>
  );
}

type Props = {
  customers: ICustomer[];
};

export default function CustomerTableBody({ customers }: Props) {
  const { isLoading: firstFetchLoading } = useGetAllCustomers();

  if (firstFetchLoading) return <Loading />;

  return (
    <ScrollArea className="relative h-[60vh] overflow-y-auto border border-y-0 border-x-gray-300 dark:border-x-header 2xl:h-[70vh]">
      <table className="min-w-full table-auto">
        <thead className="sticky top-0 z-fixed overflow-hidden rounded-t-md bg-gray-300 dark:bg-header">
          <tr className="rounded-t-xl text-gray-dark dark:text-gray-300">
            <th scope="col" className="px-4 py-3 text-center uppercase tracking-wide">
              Cliente
            </th>
            <th scope="col" className="hidden px-4 py-3 text-center uppercase tracking-wide lg:table-cell">
              Contacto
            </th>
            <th scope="col" className="hidden px-4 py-3 text-center uppercase tracking-wide lg:table-cell">
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
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {customers.map(customer => (
            <CustomerTableItem customer={customer} key={customer.id} />
          ))}
        </tbody>
      </table>
    </ScrollArea>
  );
}
