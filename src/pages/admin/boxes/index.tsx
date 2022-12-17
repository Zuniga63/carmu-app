import BoxList from 'src/components/BoxPage/BoxList';
import BoxShow from 'src/components/BoxPage/BoxShow';
import CloseBoxForm from 'src/components/BoxPage/CloseBoxForm';
import CreateForm from 'src/components/BoxPage/CreateForm';
import OpenBoxForm from 'src/components/BoxPage/OpenBoxForm';
import Layout from 'src/components/Layout';
import { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';
import { useAppDispatch } from 'src/store/hooks';
import {
  setBoxes,
  setMainBox,
  unmountTransactions,
} from 'src/store/reducers/BoxPage/creators';
import { IBox, IMainBox } from 'src/types';

interface Props {
  data: {
    boxes: IBox[];
    mainBox: IMainBox | null;
  };
}

const BoxesPage: NextPage<Props> = ({ data }: Props) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setBoxes(data.boxes));
    dispatch(setMainBox(data.mainBox));

    return () => {
      dispatch(unmountTransactions());
    };
  }, []);
  return (
    <>
      <Layout title="Cajas">
        <div className="flex gap-x-4 px-8 py-2 text-dark dark:text-light">
          <div className="w-80 flex-shrink-0 flex-grow-0">
            <BoxList />
          </div>
          <div className="flex-grow">
            <BoxShow />
          </div>
        </div>
      </Layout>
      <CreateForm />
      <OpenBoxForm />
      <CloseBoxForm />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async context => {
  const { token } = context.req.cookies;
  const data = {
    boxes: [],
    mainBox: null,
  };

  if (token) {
    const baseUrl = process.env.NEXT_PUBLIC_URL_API;
    const url = `${baseUrl}/boxes`;
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const res = await fetch(url, { headers });
      const resData = await res.json();
      data.boxes = resData.boxes;
      data.mainBox = resData.mainBox;
    } catch (error) {
      console.log(error);
    }
  }

  return {
    props: { data },
  };
};

export default BoxesPage;
