import { ScrollArea } from '@mantine/core';
import React from 'react';
import normalizeBox from '@/utils/normalizeBox';
import BoxListItem from './BoxListItem';
import { useGetAllBoxes } from '@/hooks/react-query/boxes.hooks';

const BoxListBody = () => {
  const { data } = useGetAllBoxes();
  const boxes = data?.boxes || [];

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
