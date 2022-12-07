import { IconX } from '@tabler/icons';
import React from 'react';

interface Props {
  title: React.ReactNode;
  invoiceType?: string;
  invoiceNumber?: string;
  onClose(): void;
}

const InvoiceCardModalHeader = ({ title, invoiceNumber, onClose, invoiceType = 'Factura' }: Props) => {
  return (
    <header className="relative rounded-t-lg bg-gray-300 p-4 dark:bg-header">
      <h2 className="text-center text-xl tracking-wider">
        <span className="mr-2 inline-block">{invoiceType}</span>
        {title}
      </h2>
      {invoiceNumber ? (
        <p className="text-center text-sm italic">
          N°: <span className="ml-2 inline-block font-bold text-red-500">{invoiceNumber}</span>
        </p>
      ) : null}

      {/* CLOSE BUTTON */}
      <button
        className="absolute top-4 right-4 text-opacity-80 transition-opacity hover:text-opacity-100 dark:text-light"
        onClick={onClose}
      >
        <IconX stroke={3} />
      </button>
    </header>
  );
};

export default InvoiceCardModalHeader;
