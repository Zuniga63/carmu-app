'use client';

import '@/config/dates.config';
import queryClient from '@/config/queryClient';
import { useAuthStore } from '@/store/auth-store';
import { useAppStore } from '@/stores/app-store';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import { Suspense, useEffect } from 'react';

type Props = {
  children: React.ReactNode;
  session: Session | null;
};

export function Providers({ children, session }: Props) {
  const setUser = useAppStore(state => state.setUser);
  const setCredentials = useAppStore(state => state.setCredentials);

  useEffect(() => {
    setUser(session?.user ?? null);
    setCredentials({ accessToken: session?.accessToken || '', oldAccessToken: session?.oldAccessToken || '' });
  }, [session]);

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Suspense fallback={<div>Cargando...</div>}>
          <ProgressBar options={{ showSpinner: false }} shallowRouting />
        </Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
