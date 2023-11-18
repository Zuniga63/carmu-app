import BoxListHeader from './BoxListHeader';
import BoxListBody from './BoxListBody';
import BoxListFooter from './BoxListFooter';
import BoxListLoading from './BoxListLoading';
import { useGetAllBoxes } from '@/hooks/react-query/boxes.hooks';

const BoxList = () => {
  const { isPending } = useGetAllBoxes();

  return (
    <div>
      <BoxListHeader />
      {isPending ? <BoxListLoading /> : <BoxListBody />}
      <BoxListFooter />
    </div>
  );
};

export default BoxList;
