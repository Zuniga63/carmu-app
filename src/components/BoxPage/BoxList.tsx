import React from 'react';
import { Button, ScrollArea } from '@mantine/core';
import BoxListItem from './BoxListItem';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import MainBox from './MainBox';
import { boxPageSelector, showCreateForm } from 'src/features/BoxPage';
import normalizeBox from 'src/utils/normalizeBox';

const BoxList = () => {
  const { boxes, mainBox } = useAppSelector(boxPageSelector);
  const dispatch = useAppDispatch();
  return (
    <div>
      <header className="rounded-t-md border-x border-t border-gray-400 bg-gray-300 px-4 py-2 dark:border-header dark:bg-header">
        <h2 className="text-2xl">Listado cajas</h2>
      </header>
      <ScrollArea className="h-96 overflow-y-auto border-x border-gray-400 px-4 py-4 dark:border-header 3xl:h-[70vh]">
        <ul>
          {boxes.map(box => (
            <BoxListItem box={normalizeBox(box)} key={box.id} />
          ))}

          {mainBox && <MainBox mainBox={mainBox} />}
        </ul>
      </ScrollArea>
      <footer className="flex min-h-[40px] items-center justify-end gap-x-2 rounded-b-md border-x border-b border-gray-400 bg-gray-300 px-4 py-2 dark:border-dark dark:bg-header">
        <Button onClick={() => dispatch(showCreateForm())}>Nueva Caja</Button>
      </footer>
    </div>
  );
};

export default BoxList;
