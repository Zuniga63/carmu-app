import { signIn } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';

// import { AuthProvidersEnum } from '@modules/core/config';
import { registerNewUser, type SignupData } from '../register-user.service';
import { AuthProvidersEnum } from '../../config';

interface Options {
  callbackUrl?: string;
}

export function useSignUp({ callbackUrl }: Options = {}) {
  return useMutation({
    mutationFn: async (data: SignupData) => {
      const user = await registerNewUser(data);
      if (!user) throw new Error('No se ha podido registrar el usuario');

      const { email, password } = data;
      return signIn(AuthProvidersEnum.CREDENTIALS, { email, password, callbackUrl, redirect: false });
    },
  });
}
