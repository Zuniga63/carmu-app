import { Loader } from '@mantine/core';
import { IconX } from '@tabler/icons';
import React from 'react';

interface Props {
  loading: boolean;
  error: string | null;
}

const EmptyInvoice = ({ loading, error }: Props) => {
  return (
    <div className="flex h-96 items-center justify-center">
      {loading ? (
        <div className="flex items-center gap-x-2">
          <Loader size={30} color="dark"></Loader>
          <p className="animate-pulse text-light">Recuperando la información...</p>
        </div>
      ) : null}
      {error && !loading ? (
        <div className="flex flex-col items-center">
          <div className="mb-4 rounded-full border border-red-600 p-4">
            <IconX size={64} className="text-red-800" />
          </div>
          <p className="font-bold italic text-red-800">{error}</p>
        </div>
      ) : null}
    </div>
  );
};

export default EmptyInvoice;
