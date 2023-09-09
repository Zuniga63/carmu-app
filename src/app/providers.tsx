'use client';

import '@/config/dates.config';
import queryClient from '@/config/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { theme } from '@/config/chakra-theme';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

type Props = {
  children: React.ReactNode;
};

export function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      <CacheProvider prepend={false}>
        <ChakraProvider theme={theme}>
          {children}
          <ProgressBar options={{ showSpinner: false }} shallowRouting />
        </ChakraProvider>
      </CacheProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
