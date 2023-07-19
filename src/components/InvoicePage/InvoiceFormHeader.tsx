import React, { useEffect, useState } from 'react';
import { IconX } from '@tabler/icons';
import BrandLogo from '../Layout/BrandLogo';
import { useAppSelector } from 'src/store/hooks';
import { configSelector } from 'src/features/Config';

interface Props {
  isSeparate: boolean;
  onClose(): void;
}

const InvoiceFormHeader = ({ isSeparate, onClose }: Props) => {
  const { premiseStoreSelected } = useAppSelector(configSelector);
  const [title, setTitle] = useState(process.env.NEXT_PUBLIC_APP_NAME);

  useEffect(() => {
    setTitle(current => (premiseStoreSelected ? premiseStoreSelected.name : current));
  }, [premiseStoreSelected]);

  return (
    <header className="mb-4 flex items-center justify-between px-6 py-4">
      <BrandLogo />
      <h2 className="hidden text-xl tracking-wider lg:block">
        {isSeparate ? 'Apartado' : 'Facturación'} <span className="font-bold italic">{title}</span>
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
