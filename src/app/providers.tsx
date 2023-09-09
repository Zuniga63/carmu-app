'use client';

import { theme } from '@/config/chakra-theme';
import queryClient from '@/config/queryClient';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';
import '@/config/dates.config';

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
