import React from 'react';
import Image from 'next/image';
import brandLogo from 'public/images/logo_62601199d793d.png';
import { IconX } from '@tabler/icons';

interface Props {
  isSeparate: boolean;
  onClose(): void;
}

const InvoiceFormHeader = ({ isSeparate, onClose }: Props) => {
  return (
    <header className="mb-4 flex items-center justify-between px-6 py-4">
      <figure className="flex w-24 items-center">
        <Image src={brandLogo} alt="Carmú Logo" />
      </figure>
      <h2 className="hidden text-xl tracking-wider lg:block">
        {isSeparate ? 'Apartado' : 'Facturación'}{' '}
        <span className="font-bold italic">
          Tienda <span className="text-red-500">Carmú</span>
        </span>
      </h2>
      <button
        className="text-dark text-opacity-80 transition-opacity hover:text-opacity-100 dark:text-light"
        onClick={onClose}
      >
        <IconX stroke={3} />
      </button>
    </header>
  );
};

export default InvoiceFormHeader;
