import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useRouter } from 'next-nprogress-bar';
import { zodResolver } from '@hookform/resolvers/zod';

import { useSignUp } from '../services/hooks';
import { signUpFormSchema, SignUpFormSchemaType } from '../schemas';
import { BadRequestError, DuplicateKeyError } from '@/utils/errors';

interface Props {
  callbackUrl?: string;
}

export function useSignUpForm({ callbackUrl }: Props = {}) {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const { mutate: signup, isPending, isSuccess, data, isError, error } = useSignUp();

  const form = useForm<SignUpFormSchemaType>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      passwordConfirmation: '',
    },
  });

  const handleSubmit = form.handleSubmit((data: SignUpFormSchemaType) => {
    if (isPending) return;
    signup(data);
    setErrorMessage('');
  });

  const handleError = (error: Error) => {
    if (error instanceof BadRequestError || error instanceof DuplicateKeyError) {
      const { name, password, passwordConfirmation, email } = error.errors;
      if (name) form.setError('username', { message: name.message });
      if (email) form.setError('email', { message: email.message });
      if (password) form.setError('password', { message: password.message });
      if (passwordConfirmation) form.setError('passwordConfirmation', { message: passwordConfirmation.message });
      return;
    }

    setErrorMessage('Ha ocurrido un error, por favor intenta de nuevo.');
    console.log(error.message);
  };

  useEffect(() => {
    if (!isError) return;
    handleError(error);
  }, [isError, error]);

  useEffect(() => {
    if (!isSuccess) return;

    if (!data?.ok) {
      setErrorMessage('Ha ocurrido un error al tratar de iniciar sesión, intenta iniciar sesión');
      return;
    }

    router.push(callbackUrl || '/');
  }, [isSuccess]);

  return { form, handleSubmit, error: errorMessage, isLoading: isPending };
}
