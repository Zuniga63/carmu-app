import { Button } from '@mantine/core';
import { IconFolder } from '@tabler/icons';
import React from 'react';
import { mountGlobalTransactions } from 'src/features/BoxPage';
import { useAppDispatch } from 'src/store/hooks';
import { IMainBox } from 'src/types';
import { currencyFormat } from 'src/utils';

interface Props {
  mainBox: IMainBox;
}

const MainBox = ({ mainBox }: Props) => {
  const dispatch = useAppDispatch();
  return (
    <div className="overflow-hidden rounded-lg border shadow-sm dark:border-header dark:shadow-gray-500">
      <header className="relative bg-gray-300 px-4 py-2 dark:bg-header">
        <h2 className="text-center font-bold tracking-wider">{mainBox.name}</h2>
      </header>
      <div className="bg-gradient-to-b from-gray-200 to-indigo-300 px-4 py-2 dark:bg-none">
        <p className="text-center text-2xl font-bold tracking-wider">
          {currencyFormat(mainBox.balance)}
        </p>
        <p className="text-center text-xs font-bold">Saldo</p>
      </div>

      <footer className="bg-indigo-400 px-4 py-2 dark:bg-header">
        <div className="flex items-center justify-end">
          <Button
            size="xs"
            leftIcon={<IconFolder size={14} />}
            onClick={() => dispatch(mountGlobalTransactions())}
          >
            Ver Transacciones
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default MainBox;
