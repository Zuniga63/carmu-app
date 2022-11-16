import React from 'react';
import { Button, ScrollArea } from '@mantine/core';
import BoxListItem from './BoxListItem';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { openCreateForm } from 'store/reducers/BoxPage/creators';
import MainBox from './MainBox';

const BoxList = () => {
  const { boxes, mainBox } = useAppSelector(state => state.BoxPageReducer);
  const dispatch = useAppDispatch();
  return (
    <div>
      <header className="rounded-t-md border-x border-t border-header bg-header px-4 py-2">
        <h2 className="text-2xl">Listado cajas</h2>
      </header>
      <ScrollArea className="h-96 overflow-y-auto border-x border-header px-4 py-4 3xl:h-[70vh]">
        <ul>
          {boxes.map(box => (
            <BoxListItem box={box} key={box.id} />
          ))}

          {mainBox && <MainBox mainBox={mainBox} />}
        </ul>
      </ScrollArea>
      <footer className="flex min-h-[40px] items-center justify-end gap-x-2 rounded-b-md border-x border-b border-dark bg-header px-4 py-2">
        <Button onClick={() => dispatch(openCreateForm())}>Nueva Caja</Button>
      </footer>
    </div>
  );
};

export default BoxList;
