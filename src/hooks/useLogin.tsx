import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { authSelector, signin } from '@/features/Auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LoginData } from '@/types';

export function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { error, isAuth } = useAppSelector(authSelector);
  const [isValid, setIsValid] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const updateEmail = (value: string) => {
    setEmail(value);
  };

  const updatePassword = (value: string) => {
    setPassword(value);
  };

  const isValidData = () => {
    const emailRegex = /^[^\s@]+@[^s@]+\.[^\s@]+$/;
    const emailIsOk = emailRegex.test(email);

    const passwordIsOk = password.length >= 8;

    setIsValid(emailIsOk && passwordIsOk);
  };

  const loginUser = () => {
    const data: LoginData = { email, password };
    dispatch(signin(data));
  };

  useEffect(() => {
    if (!error) return;
    setPassword('');
    toast.error(error);
  }, [error]);

  useEffect(() => {
    const token = getCookie('access_token');
    if (isAuth && token) {
      router.push('/');
    }
  }, [isAuth]);

  useEffect(() => {
    isValidData();
  }, [email, password]);

  return { email, updateEmail, password, updatePassword, loginUser, isValid };
}
