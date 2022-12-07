import React from 'react';
import { IconX } from '@tabler/icons';

interface Props {
  title: string;
  onClose(): void;
}
const DrawerHeader = ({ title, onClose }: Props) => {
  return (
    <header className="sticky top-0 z-fixed bg-gray-200 text-dark dark:bg-header dark:text-gray-200">
      <div className="flex h-16 items-center justify-between px-4 py-2">
        <h2 className="text-lg font-bold uppercase">{title}</h2>
        <button onClick={onClose}>
          <IconX size={32} />
        </button>
      </div>
    </header>
  );
};

export default DrawerHeader;
