import { Button } from '@mantine/core';
import { IconFolder } from '@tabler/icons';
import React from 'react';
import { useAppDispatch } from 'store/hooks';
import { mountMainBox } from 'store/reducers/BoxPage/creators';
import { IMainBox } from 'types';
import { currencyFormat } from 'utils';

interface Props {
  mainBox: IMainBox;
}

const MainBox = ({ mainBox }: Props) => {
  const dispatch = useAppDispatch();
  return (
    <div className="overflow-hidden rounded-lg border border-header shadow-sm shadow-gray-500">
      <header className="relative bg-header px-4 py-2">
        <h2 className="text-center font-bold tracking-wider">{mainBox.name}</h2>
      </header>
      <div className="px-4 py-2">
        <p className="text-center text-2xl font-bold tracking-wider">{currencyFormat(mainBox.balance)}</p>
        <p className="text-center text-xs font-bold">Saldo</p>
      </div>

      <footer className="bg-header px-4 py-2">
        <div className="flex items-center justify-end">
          <Button size="xs" leftIcon={<IconFolder size={14} />} onClick={() => dispatch(mountMainBox())}>
            Ver Transacciones
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default MainBox;
