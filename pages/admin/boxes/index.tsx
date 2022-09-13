import BoxList from 'components/BoxPage/BoxList';
import CreateForm from 'components/BoxPage/CreateForm';
import Layout from 'components/Layout';
import { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';
import { useAppDispatch } from 'store/hooks';
import { setBoxes, setMainBox } from 'store/reducers/BoxPage/creators';
import { IBox, IMainBox } from 'types';

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
  }, []);
  return (
    <>
      <Layout title="Cajas">
        <div className="flex px-4 py-2 text-white">
          <BoxList />
        </div>
      </Layout>
      <CreateForm />
    </>
  );
};

export default BoxesPage;
