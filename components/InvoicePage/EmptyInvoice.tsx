import { Loader } from '@mantine/core';
import { IconFileInvoice } from '@tabler/icons';
import React from 'react';
import { useAppSelector } from 'store/hooks';

const EmptyInvoice = () => {
  const { loading } = useAppSelector(state => state.InvoicePageReducer);
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center">
        <p className="text-2xl font-bold">Selecciona una factura</p>
        {loading && (
          <div className="flex gap-x-2">
            <Loader size={12}></Loader>
            <p className="animate-pulse text-xs">Recuperando la información...</p>
          </div>
        )}
        <IconFileInvoice size={60} className="mt-4" />
      </div>
    </div>
  );
};

export default EmptyInvoice;
