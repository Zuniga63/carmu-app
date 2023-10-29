import { useState, useEffect } from 'react';
import { useRouter } from 'next-nprogress-bar';
import { useAuthenticateUser } from '@/hooks/react-query/auth.hooks';

export function useLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEnabledLogin, setIsEnabledLogin] = useState(false);
  const router = useRouter();

  const { mutate, isPending, isSuccess } = useAuthenticateUser();

  const validateInputs = (email: string, password: string) => {
    const emailRegex = /^[^\s@]+@[^s@]+\.[^\s@]+$/;
    const emailIsOk = emailRegex.test(email);

    const passwordIsOk = password.length >= 1;

    setIsEnabledLogin(emailIsOk && passwordIsOk);
  };

  const loginUser = () => {
    if (!isEnabledLogin) return;

    mutate({ email, password });
  };

  const updateEmail = (value: string) => {
    setEmail(value);
  };

  const updatePassword = (value: string) => {
    setPassword(value);
  };

  useEffect(() => {
    validateInputs(email, password);
  }, [email, password]);

  useEffect(() => {
    if (!isSuccess) return;
    router.push('/');
  }, [isSuccess]);

  return {
    email,
    password,
    loading: isPending,
    isEnabledLogin,
    updateEmail,
    updatePassword,
    loginUser,
  };
}
