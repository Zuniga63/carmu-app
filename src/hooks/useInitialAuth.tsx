import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { authSelector, authSuccessIsNotify, authenticate } from '@/features/Auth';
import { fetchPremiseStores } from '@/features/Config';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export function useInitialAuth() {
  const { user, authIsSuccess, isAuth } = useAppSelector(authSelector);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(authenticate());
  }, []);

  useEffect(() => {
    if (authIsSuccess) {
      const message = (
        <span>
          ¡Bienvenido <strong className="font-bold">{user?.name}</strong>!
        </span>
      );
      toast.success(message, { position: 'top-right' });
      dispatch(authSuccessIsNotify());
    }
  }, [authIsSuccess]);

  useEffect(() => {
    dispatch(fetchPremiseStores());
  }, [isAuth]);
}
