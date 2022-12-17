import { Tooltip } from '@mantine/core';
import {
  IconCircleCheck,
  IconAlertCircle,
  IconClock,
  IconX,
} from '@tabler/icons';
import React from 'react';

interface Props {
  paid: number;
  pending: number;
  separated: number;
  canceled: number;
}

const InvoiceRated = ({ paid, pending, separated, canceled }: Props) => {
  return (
    <div className="mb-4 flex flex-wrap justify-evenly gap-2 px-2">
      <Tooltip label="Pagadas" withArrow color="green">
        <div className="flex items-center gap-x-2 text-sm text-green-600 hover:cursor-help dark:text-green-400">
          <IconCircleCheck size={20} stroke={2} />{' '}
          <span className="font-bold">{paid}</span>
        </div>
      </Tooltip>
      <Tooltip label="Pendientes" withArrow color="orange">
        <div className="flex items-center gap-x-2 text-sm text-orange-500 hover:cursor-help dark:text-orange-400">
          <IconAlertCircle size={20} stroke={2} />{' '}
          <span className="font-bold">{pending}</span>
        </div>
      </Tooltip>
      <Tooltip label="Apartados" withArrow color="blue">
        <div className="flex items-center gap-x-2 text-sm text-blue-500 hover:cursor-help dark:text-blue-400">
          <IconClock size={20} stroke={2} />{' '}
          <span className="font-bold">{separated}</span>
        </div>
      </Tooltip>
      <Tooltip label="Canceladas" withArrow color="blue">
        <div className="flex items-center gap-x-2 text-sm text-red-500 hover:cursor-help dark:text-red-400">
          <IconX size={20} stroke={2} />{' '}
          <span className="font-bold">{canceled}</span>
        </div>
      </Tooltip>
    </div>
  );
};

export default InvoiceRated;
