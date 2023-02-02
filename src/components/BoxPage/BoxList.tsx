import React from 'react';
import { useAppSelector } from 'src/store/hooks';
import { boxPageSelector } from 'src/features/BoxPage';
import BoxListHeader from './BoxListHeader';
import BoxListBody from './BoxListBody';
import BoxListFooter from './BoxListFooter';
import BoxListLoading from './BoxListLoading';

const BoxList = () => {
  const { fetchLoading } = useAppSelector(boxPageSelector);
  return (
    <div>
      <BoxListHeader />
      {fetchLoading ? <BoxListLoading /> : <BoxListBody />}
      <BoxListFooter />
    </div>
  );
};

export default BoxList;
