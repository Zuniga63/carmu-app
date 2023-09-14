import React, { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { updateBoxes } from '@/features/BoxPage';
import BoxListHeader from './BoxListHeader';
import BoxListBody from './BoxListBody';
import BoxListFooter from './BoxListFooter';
import BoxListLoading from './BoxListLoading';
import { useGetAllBoxes } from '@/hooks/react-query/boxes.hooks';

const BoxList = () => {
  const { isInitialLoading, data } = useGetAllBoxes();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (data) dispatch(updateBoxes(data));
  }, [data]);
  return (
    <div>
      <BoxListHeader />
      {isInitialLoading ? <BoxListLoading /> : <BoxListBody />}
      <BoxListFooter />
    </div>
  );
};

export default BoxList;
