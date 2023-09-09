import { useState, useEffect } from 'react';
import { useRouter } from 'next-nprogress-bar';
import { useAuthenticateUser } from '@/hooks/react-query/auth.hooks';

export function useLogin() {
  const [email, setEmail] = useState('admin@admin.com');
  const [password, setPassword] = useState('Carmú007');
  const [isEnabledLogin, setIsEnabledLogin] = useState(false);
  const router = useRouter();

  const { mutate, isLoading, isSuccess } = useAuthenticateUser();

  const validateInputs = (email: string, password: string) => {
    const emailRegex = /^[^\s@]+@[^s@]+\.[^\s@]+$/;
    const emailIsOk = emailRegex.test(email);

    const passwordIsOk = password.length >= 8;

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
    loading: isLoading,
    isEnabledLogin,
    updateEmail,
    updatePassword,
    loginUser,
  };
}
