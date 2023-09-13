import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/store/auth-store';
import { useAuthenticateToken } from './react-query/auth.hooks';
import { getTokenFromCookies } from '@/logic/auth-logic';
import { useGetAllPremiseStore } from './react-query/premise-store.hooks';
import { PREMISE_STORE_KEY } from '@/config/constants';
import { useConfigStore } from '@/store/config-store';
import { IPremiseStore } from '@/types';

export function useInitialAuth() {
  const isAuth = useAuthStore(state => state.isAuth);
  const user = useAuthStore(state => state.user);

  const setPremiseStore = useConfigStore(state => state.setPremiseStore);

  const { mutate: authenticate, isSuccess } = useAuthenticateToken();
  const { data: premiseStores } = useGetAllPremiseStore();

  useEffect(() => {
    const token = getTokenFromCookies();
    if (!isAuth) authenticate(token);
  }, []);

  useEffect(() => {
    if (!isSuccess) return;
    const message = (
      <span>
        ¡Bienvenido <strong className="font-bold">{user?.name}</strong>!
      </span>
    );
    toast.success(message, { position: 'top-right' });
  }, [isSuccess]);

  useEffect(() => {
    if (!premiseStores) return;
    const storeId = localStorage.getItem(PREMISE_STORE_KEY);
    let premiseStore: IPremiseStore | undefined;
    if (storeId) {
      premiseStore = premiseStores.find(item => item.id === storeId);
    }

    setPremiseStore(premiseStore);
  }, [premiseStores]);
}
