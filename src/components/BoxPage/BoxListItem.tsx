import React, { useEffect, useState } from 'react';
import { IBoxWithDayjs } from 'src/types';
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
import { currencyFormat } from 'src/utils';
import { useAppDispatch } from 'src/store/hooks';
import { Collapse, Divider, Tooltip } from '@mantine/core';
import Swal from 'sweetalert2';
import axios, { AxiosError } from 'axios';
import { fetchBoxes, removeBox, mountBoxToOpen, mountBoxToClose, mountBox } from 'src/features/BoxPage';

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

  const dispatch = useAppDispatch();

  const setDateString = () => {
    if (box.openBox) setOpenFromNow(box.openBox.fromNow());
    if (box.closed) setClosedFromNow(box.closed.fromNow());
    setCreatedAt(box.createdAt.fromNow());
    setUpdatedAt(box.updatedAt.fromNow());
  };

  const deleteBox = async () => {
    const url = `/boxes/${box.id}`;
    const message = /*html */ `La caja "<strong>${box.name}</strong>" será eliminada permanentemente y esta acción no puede revertirse.`;

    const result = await Swal.fire({
      title: '<strong>¿Desea eliminar la caja?',
      html: message,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Si, ¡Eliminala!',
      backdrop: true,
      icon: 'warning',
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const result = { ok: false, message: '' };
        try {
          const res = await axios.delete(url);
          result.ok = true;
          result.message = `La caja <strong>${res.data.cashbox.name}</strong> fue eliminada con éxito.`;
          dispatch(removeBox(box.id));
        } catch (error) {
          if (error instanceof AxiosError) {
            const { response } = error;
            if (response?.status === 404) dispatch(fetchBoxes());
            result.message = response?.data.message;
          } else {
            console.log(error);
          }
        }

        return result;
      },
    });

    if (result.isConfirmed && result.value) {
      const { ok, message } = result.value;
      if (ok) {
        Swal.fire({
          title: '<strong>¡Caja Eliminada!</strong>',
          html: message,
          icon: 'success',
        });
      } else {
        Swal.fire({
          title: '¡Ops, algo salio mal!',
          text: message,
          icon: 'error',
        });
      }
    }
  };

  useEffect(() => {
    setDateString();
    let intervalId: NodeJS.Timer;

    if (box.dateRefreshRate) {
      intervalId = setInterval(setDateString, box.dateRefreshRate);
    }

    return () => {
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
                    <Tooltip label="Cerrar caja" color="orange">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          dispatch(mountBoxToClose(box.id));
                        }}
                        className="rounded-full border border-gray-600 p-1 text-gray-600 transition-colors hover:border-orange-500 hover:text-orange-500 active:border-gray-600 active:text-gray-600"
                      >
                        <IconLock size={14} stroke={2} />
                      </button>
                    </Tooltip>

                    {/* VER TRANSACCIONES CAJA */}
                    <Tooltip label="Ver transacciones" color="blue">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setOpened(true);
                          dispatch(mountBox(box.id));
                        }}
                        className="rounded-full border border-gray-600 p-1 text-gray-600 transition-colors hover:border-blue-500 hover:text-blue-500 active:border-gray-600 active:text-gray-600"
                      >
                        <IconFolder size={14} stroke={2} />
                      </button>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    {/* OPEN BOX */}
                    <Tooltip label="Abrir caja" color="green">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          dispatch(mountBoxToOpen(box.id));
                        }}
                        className="rounded-full border border-gray-600 p-1 text-gray-600 transition-colors hover:border-green-500 hover:text-green-500 active:border-gray-600 active:text-gray-600"
                      >
                        <IconLockOpen size={14} stroke={2} />
                      </button>
                    </Tooltip>

                    {/* DELETE BOX */}
                    <Tooltip label="Eliminar caja" color="red">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          deleteBox();
                        }}
                        className="rounded-full border border-gray-600 p-1 text-gray-600 transition-colors hover:border-red-500 hover:text-red-500 active:border-gray-600 active:text-gray-600"
                      >
                        <IconTrash size={14} stroke={2} />
                      </button>
                    </Tooltip>
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
        <Collapse in={opened || mouseIsOver}>
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
        </Collapse>
        {!opened && box.openBox ? <Divider /> : null}

        {/* Footer */}
        {box.openBox ? (
          <footer className="bg-indigo-400 px-4 py-2 dark:bg-header">
            <Tooltip
              label={
                <div className="flex flex-col items-center">
                  <h4 className="text-sm">Saldo sin la base</h4>
                  <p className="text-xs font-bold tracking-widest">{currencyFormat((box.balance || 0) - box.base)}</p>
                </div>
              }
              withArrow
              hidden={!box.base}
            >
              <p className="text-center text-xl font-bold tracking-wider">{currencyFormat(box.balance || 0)}</p>
            </Tooltip>
          </footer>
        ) : null}
      </div>
    </li>
  );
};

export default BoxListItem;
