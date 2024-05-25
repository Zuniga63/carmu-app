import {
  IconAlertTriangle,
  IconAward,
  IconDeviceFloppy,
  IconEditCircle,
  IconFolder,
  IconLock,
  IconLockOpen,
  IconTrash,
} from '@tabler/icons-react';
import { MouseEventHandler, useEffect, useState } from 'react';

import { IBoxWithDayjs } from '@/types';
import { Separator } from '../ui/Separator';
import { currencyFormat } from '@/lib/utils';
import { useBoxesPageStore } from '@/store/boxes-page-store';

interface Props {
  box: IBoxWithDayjs;
}

const BoxListItem = ({ box }: Props) => {
  const [openFromNow, setOpenFromNow] = useState('');
  const [closedFronNow, setClosedFromNow] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [opened, setOpened] = useState(false);
  const [mouseIsOver, setMouseIsOver] = useState(false);

  const showDeleteBoxAlert = useBoxesPageStore(state => state.showDeleteBoxAlert);
  const mountBoxToOpen = useBoxesPageStore(state => state.mountBoxToOpen);
  const mountBoxToClose = useBoxesPageStore(state => state.mountBoxToClose);
  const mountBotToInfo = useBoxesPageStore(state => state.mountBoxToInfo);

  const setDateString = () => {
    if (box.openBox) setOpenFromNow(box.openBox.fromNow());
    if (box.closed) setClosedFromNow(box.closed.fromNow());
    setCreatedAt(box.createdAt.fromNow());
    setUpdatedAt(box.updatedAt.fromNow());
  };

  const handleDeleteClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    showDeleteBoxAlert(box.id);
  };

  const handleOpenBoxClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    mountBoxToOpen(box.id);
  };

  const handleCloseBoxClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    mountBoxToClose(box.id);
  };

  const handleShowInfoClick: MouseEventHandler<HTMLButtonElement> = e => {
    e.stopPropagation();
    setOpened(true);
    mountBotToInfo(box.id);
  };

  useEffect(() => {
    setDateString();
    let intervalId: NodeJS.Timeout;

    if (box.dateRefreshRate) {
      intervalId = setInterval(setDateString, box.dateRefreshRate);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined = undefined;

    setDateString();
    if (box.dateRefreshRate) {
      intervalId = setInterval(setDateString, box.dateRefreshRate);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [box.openBox, box.closed, box.createdAt, box.updatedAt]);

  return (
    <li className="mb-4">
      <div
        className={
          box.openBox
            ? 'overflow-hidden rounded-lg border shadow-sm dark:border-header dark:shadow-gray-500'
            : 'overflow-hidden rounded-lg border opacity-40 shadow-sm dark:border-header dark:shadow-gray-500'
        }
        onMouseOver={() => setMouseIsOver(true)}
        onMouseLeave={() => setMouseIsOver(false)}
      >
        <header
          className="relative cursor-pointer bg-gray-300 px-4 py-2 dark:bg-header"
          onClick={() => setOpened(o => !o)}
        >
          <div className="flex items-center gap-x-1">
            {/* BOX NAME */}
            <div className="flex-grow">
              <div className="flex items-center gap-x-1">
                {opened ? <IconLock className="flex-shrink-0 text-amber-400" size={16} /> : null}
                <h1 className=" line-clamp-1 flex-grow text-sm font-bold tracking-wider">{box.name}</h1>
              </div>
            </div>
            {/* BOX ACTIONS */}
            <div className="flex-shrink-0">
              <div className="flex gap-x-1">
                {box.openBox ? (
                  <>
                    {/* CERRAR CAJA */}
                    <button
                      onClick={handleCloseBoxClick}
                      className="rounded-full border border-gray-600 p-1 text-gray-600 transition-colors hover:border-orange-500 hover:text-orange-500 active:border-gray-600 active:text-gray-600"
                    >
                      <IconLock size={14} stroke={2} />
                    </button>

                    {/* VER TRANSACCIONES CAJA */}
                    <button
                      onClick={handleShowInfoClick}
                      className="rounded-full border border-gray-600 p-1 text-gray-600 transition-colors hover:border-blue-500 hover:text-blue-500 active:border-gray-600 active:text-gray-600"
                    >
                      <IconFolder size={14} stroke={2} />
                    </button>
                  </>
                ) : (
                  <>
                    {/* OPEN BOX */}
                    <button
                      onClick={handleOpenBoxClick}
                      className="rounded-full border border-gray-600 p-1 text-gray-600 transition-colors hover:border-green-500 hover:text-green-500 active:border-gray-600 active:text-gray-600"
                    >
                      <IconLockOpen size={14} stroke={2} />
                    </button>

                    {/* DELETE BOX */}
                    <button
                      onClick={handleDeleteClick}
                      className="rounded-full border border-gray-600 p-1 text-gray-600 transition-colors hover:border-red-500 hover:text-red-500 active:border-gray-600 active:text-gray-600"
                    >
                      <IconTrash size={14} stroke={2} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
          {box.openBox && (
            <div className="flex items-center justify-center gap-x-2 text-gray-dark dark:text-gray-400">
              <IconAward size={18} />
              <p className="text-xs">{box.cashier ? box.cashier.name : box.cashierName}</p>
            </div>
          )}
        </header>
        {/* Body */}
        <div className="bg-gradient-to-b from-gray-200 to-indigo-300 px-4 py-2 dark:bg-none">
          {!!box.openBox && (
            <>
              <div className="flex justify-between text-xs text-gray-dark dark:text-gray-400">
                <p>
                  Base: <span className="font-bold">{currencyFormat(box.base)}</span>
                </p>
                <div className="flex items-center gap-x-2 ">
                  <IconLockOpen size={18} />
                  <span>{openFromNow}</span>
                </div>
              </div>
            </>
          )}
          {box.closed && (
            <div className="flex flex-col items-center gap-y-3 py-4 text-gray-dark dark:text-gray-400">
              <IconLock size={30} stroke={2} />
              <p className="text-xs">Cerrada {closedFronNow}</p>
            </div>
          )}
          {box.neverUsed && (
            <div className="flex flex-col items-center gap-y-3 py-4 text-gray-dark dark:text-gray-400">
              <IconAlertTriangle size={30} stroke={2} />
              <p className="text-xs">¡Caja nunca usada!</p>
            </div>
          )}
          <div className="mt-2 flex justify-between text-xs text-gray-dark dark:text-gray-400">
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
        {!opened && box.openBox ? <Separator /> : null}

        {/* Footer */}
        {box.openBox ? (
          <footer className="bg-indigo-400 px-4 py-2 dark:bg-header">
            <p className="text-center text-xl font-bold tracking-wider">{currencyFormat(box.balance || 0)}</p>
          </footer>
        ) : null}
      </div>
    </li>
  );
};

export default BoxListItem;
