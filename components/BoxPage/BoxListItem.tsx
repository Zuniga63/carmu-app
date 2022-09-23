import React, { useEffect, useState } from 'react';
import { IBoxWithDayjs } from 'types';
import {
  IconAlertTriangle,
  IconAward,
  IconDeviceFloppy,
  IconEditCircle,
  IconFolder,
  IconLock,
  IconLockOpen,
  IconTrash,
} from '@tabler/icons';
import { currencyFormat } from 'utils';
import { useAppDispatch } from 'store/hooks';
import { destroyBox, mountBoxToClose, mountBoxToOpen, mountSelectedBox } from 'store/reducers/BoxPage/creators';
import { Button } from '@mantine/core';

interface Props {
  box: IBoxWithDayjs;
}

const BoxListItem = ({ box }: Props) => {
  const [openFromNow, setOpenFromNow] = useState('');
  const [closedFronNow, setClosedFromNow] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');

  const dispatch = useAppDispatch();

  const setDateString = () => {
    if (box.openBox) setOpenFromNow(box.openBox.fromNow());
    if (box.closed) setClosedFromNow(box.closed.fromNow());
    setCreatedAt(box.createdAt.fromNow());
    setUpdatedAt(box.updatedAt.fromNow());
  };

  useEffect(() => {
    setDateString();
    let intervalId: NodeJS.Timer;

    if (box.dateRefreshRate) {
      intervalId = setInterval(setDateString, box.dateRefreshRate);
    }

    return () => {
      console.log('Clear interval of %s: %s', box.name, intervalId);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timer | undefined = undefined;

    setDateString();
    if (box.dateRefreshRate) {
      intervalId = setInterval(setDateString, box.dateRefreshRate);
    }

    return () => {
      console.log('Clear interval in second hook of %s: %s', box.name, intervalId);
      clearInterval(intervalId);
    };
  }, [box.openBox, box.closed, box.createdAt, box.updatedAt]);
  return (
    <li className="mb-4">
      <div className="overflow-hidden rounded-lg border border-header shadow-sm shadow-gray-500">
        <header className="relative bg-header px-4 py-2">
          <h1 className="text-center font-bold tracking-wider">{box.name}</h1>
          {box.openBox && (
            <div className="flex items-center justify-center gap-x-2 text-gray-400">
              <IconAward size={18} />
              <p className="text-xs">{box.cashier ? box.cashier.name : box.cashierName}</p>
            </div>
          )}

          {!box.openBox && (
            <button
              onClick={() => dispatch(destroyBox(box))}
              className="absolute top-2 right-4 rounded-full border border-gray-600 p-1 text-gray-600 transition-colors hover:border-red-500 hover:text-red-500 active:border-gray-600 active:text-gray-600"
            >
              <IconTrash size={16} />
            </button>
          )}
        </header>
        {/* Body */}
        <div className="px-4 py-2">
          {!!box.openBox && (
            <>
              <div className="flex justify-between text-xs text-gray-400">
                <p>
                  Base: <span className="font-bold">{currencyFormat(box.base)}</span>
                </p>
                <div className="flex items-center gap-x-2 ">
                  <IconLockOpen size={18} />
                  <span>{openFromNow}</span>
                </div>
              </div>
              <p className="text-center text-2xl font-bold tracking-wider">{currencyFormat(box.balance)}</p>
              <p className="text-center text-xs font-bold">Saldo</p>
            </>
          )}
          {box.closed && (
            <div className="flex flex-col items-center gap-y-3 py-4 text-gray-400">
              <IconLock size={30} stroke={2} />
              <p className="text-xs">Cerrada {closedFronNow}</p>
            </div>
          )}
          {box.neverUsed && (
            <div className="flex flex-col items-center gap-y-3 py-4 text-gray-400">
              <IconAlertTriangle size={30} stroke={2} />
              <p className="text-xs">¡Caja nunca usada!</p>
            </div>
          )}
          <div className="mt-2 flex justify-between text-xs text-gray-400">
            <div className="flex items-center gap-x-2">
              <IconDeviceFloppy size={18} />
              <span>{createdAt}</span>
            </div>
            {!box.createIsSameUpdate && (
              <div className="flex items-center gap-x-2">
                <IconEditCircle size={18} />
                <span>{updatedAt}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-header px-4 py-2">
          <div className="flex items-center justify-between">
            {!box.openBox && (
              <Button
                size="xs"
                leftIcon={<IconLockOpen size={14} />}
                color="green"
                onClick={() => dispatch(mountBoxToOpen(box))}
              >
                Abrir
              </Button>
            )}
            {box.openBox && (
              <>
                <Button
                  size="xs"
                  leftIcon={<IconLock size={14} />}
                  color="orange"
                  onClick={() => dispatch(mountBoxToClose(box))}
                >
                  Cerrar
                </Button>

                <Button size="xs" leftIcon={<IconFolder size={14} />} onClick={() => dispatch(mountSelectedBox(box))}>
                  Ver
                </Button>
              </>
            )}
          </div>
        </footer>
      </div>
    </li>
  );
};

export default BoxListItem;
