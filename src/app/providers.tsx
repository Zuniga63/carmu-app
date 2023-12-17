'use client';

import '@/config/dates.config';
import queryClient from '@/config/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

type Props = {
  children: React.ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ProgressBar options={{ showSpinner: false }} shallowRouting />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
