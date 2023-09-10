import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { fetchPremiseStores } from '@/features/Config';
import { useAppDispatch } from '@/store/hooks';
import { useAuthStore } from '@/store/auth-store';
import { useAuthenticateToken } from './react-query/auth.hooks';
import { getTokenFromCookies } from '@/logic/auth-logic';

export function useInitialAuth() {
  const isAuth = useAuthStore(state => state.isAuth);
  const user = useAuthStore(state => state.user);
  const { mutate: authenticate2, isSuccess } = useAuthenticateToken();

  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = getTokenFromCookies();
    if (!isAuth) authenticate2(token);
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
    dispatch(fetchPremiseStores());
  }, [isAuth]);
}
