import { Table } from '@mantine/core';
import React from 'react';
import { configSelector } from 'src/features/Config';
import { useAppSelector } from 'src/store/hooks';
import PremiseStoreTableItem from './PremiseStoreTableItem';

const PremiseStoreTable = () => {
  const { premiseStores: list } = useAppSelector(configSelector);
  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          <th>Local</th>
          <th>
            <p className="text-center">Facturas</p>
          </th>
          <th>
            <p className="text-center">Caja</p>
          </th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {list.map(item => (
          <PremiseStoreTableItem key={item.id} premiseStore={item} />
        ))}
      </tbody>
    </Table>
  );
};

export default PremiseStoreTable;
