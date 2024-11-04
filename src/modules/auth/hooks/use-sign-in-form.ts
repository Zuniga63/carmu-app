import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next-nprogress-bar';
import { zodResolver } from '@hookform/resolvers/zod';

import { useSignIn } from '../services';
import { signInFormSchema, SignInFormSchemaType } from '../schemas';

interface Props {
  callbackUrl?: string;
}

export function useSignInForm({ callbackUrl }: Props = {}) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const { mutate: signin, isPending, isSuccess, data } = useSignIn({ redirect: false });

  const form = useForm<SignInFormSchemaType>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleSubmit = form.handleSubmit((data: SignInFormSchemaType) => {
    if (isPending) return;
    setErrorMessage('');
    signin(data);
  });

  useEffect(() => {
    if (!isSuccess) return;

    if (!data?.ok) {
      setErrorMessage('Credenciales incorrectas, por favor intenta de nuevo.');
      return;
    }

    router.push(callbackUrl || '/');
  }, [isSuccess]);

  return {
    form,
    handleSubmit,
    error: errorMessage,
    isLoading: isPending,
  };
}
