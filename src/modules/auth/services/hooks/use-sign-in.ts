import { signIn } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { AuthProvidersEnum } from '../../config';

interface UseAuthOptions {
  callbackUrl?: string;
  redirect?: boolean;
  provider?: AuthProvidersEnum;
}

interface SigninCredentials {
  email?: string;
  password?: string;
  provider?: AuthProvidersEnum;
}

export function useSignIn({ callbackUrl, redirect }: UseAuthOptions = {}) {
  return useMutation({
    mutationFn: ({ email, password, provider = AuthProvidersEnum.CREDENTIALS }: SigninCredentials) =>
      signIn(provider, { email, password, callbackUrl, redirect }),
  });
}
