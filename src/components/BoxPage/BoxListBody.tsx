import { ScrollArea } from '@mantine/core';
import React from 'react';
import { boxPageSelector } from 'src/features/BoxPage';
import { useAppSelector } from 'src/store/hooks';
import normalizeBox from 'src/utils/normalizeBox';
import BoxListItem from './BoxListItem';

const BoxListBody = () => {
  const { boxes } = useAppSelector(boxPageSelector);

  return (
    <ScrollArea className="h-96 overflow-y-auto border-x border-gray-400 px-4 py-4 dark:border-header 3xl:h-[70vh]">
      <ul>
        {boxes.map(box => (
          <BoxListItem box={normalizeBox(box)} key={box.id} />
        ))}
      </ul>
    </ScrollArea>
  );
};

export default BoxListBody;
