import React from 'react';
import { ScrollArea, Table } from '@mantine/core';
import { ISaleHistory } from 'src/types';
import WeeklyHistoryItem from './WeeklyHistoryItem';

interface Props {
  history: ISaleHistory[];
}

const WeeklyHistory = ({ history }: Props) => {
  return (
    <div className="rounded-b-xl pb-4 dark:bg-header">
      <ScrollArea className="relative mb-2 h-96 overflow-y-auto  3xl:h-[60vh]">
        <Table>
          <thead className="sticky top-0 bg-gray-300 dark:bg-header">
            <tr>
              <th scope="col">
                <div className="text-center">Fecha</div>
              </th>
              <th scope="col">Descripción</th>
              <th scope="col">
                <div className="text-center">Importe</div>
              </th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map(item => (
              <WeeklyHistoryItem item={item} key={item.id} />
            ))}
          </tbody>
        </Table>
      </ScrollArea>
    </div>
  );
};

export default WeeklyHistory;
