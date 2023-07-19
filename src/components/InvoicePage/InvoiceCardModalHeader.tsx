import { IconX } from '@tabler/icons';
import React from 'react';

interface Props {
  title: React.ReactNode;
  invoiceType?: string;
  invoiceNumber?: string;
  cancel?: boolean;
  onClose(): void;
}

const InvoiceCardModalHeader = ({ title, invoiceNumber, cancel, onClose, invoiceType = 'Factura' }: Props) => {
  return (
    <header className="relative rounded-t-lg bg-gray-300 p-4 dark:bg-header">
      <h2 className="text-center text-xl tracking-wider">
        <span className="mr-2 inline-block">{invoiceType}</span>
        {title}
      </h2>
      {invoiceNumber ? (
        <p className="text-center text-sm italic">
          N°: <span className="ml-2 inline-block font-bold text-red-500">{invoiceNumber}</span>
          {cancel ? <span className="ml-1 inline-block italic"> - Cancelada</span> : null}
        </p>
      ) : null}

      {/* CLOSE BUTTON */}
      <button
        className="absolute right-4 top-4 text-opacity-80 transition-opacity hover:text-opacity-100 dark:text-light"
        onClick={onClose}
      >
        <IconX stroke={3} />
      </button>
    </header>
  );
};

export default InvoiceCardModalHeader;
