import Layout from 'src/components/Layout';
import { NextPage } from 'next';
import StoreConfig from 'src/components/ConfigPage/StoreConfig';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { authSelector } from 'src/features/Auth';
import { fetchBoxes } from 'src/features/BoxPage';
import { useEffect } from 'react';
import { fetchCommercialPremises } from 'src/features/Config';

const ConfigPage: NextPage = () => {
  const { isAuth, isAdmin } = useAppSelector(authSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuth && isAdmin) {
      dispatch(fetchBoxes());
      dispatch(fetchCommercialPremises());
    }
  }, [isAuth, isAdmin]);

  return (
    <Layout title="Configuraciones">
      <StoreConfig />
    </Layout>
  );
};

export default ConfigPage;
