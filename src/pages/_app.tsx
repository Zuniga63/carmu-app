import '../styles/globals.css';
import '@/config/dates.config';

import type { AppProps } from 'next/app';

import queryClient from '@/config/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { createWrapper } from 'next-redux-wrapper';

import { rootConfig } from '@/config/root-config';
import ThemeProvider from '@/context/CustomThemeProvider';
import { emCache } from '@/utils/emotionCache';
import { inter, poppins } from '@/config/fonts.config';

import { theme } from '@/config/chakra-theme';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider } from '@chakra-ui/react';

rootConfig();

export function MyApp({ Component, pageProps }: AppProps) {
  emCache();

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ThemeProvider>
          <CacheProvider prepend={false}>
            <ChakraProvider theme={theme}>
              <div className={`${inter.variable} ${poppins.variable} font-sans ${inter.className}`}>
                <Component {...pageProps} />
              </div>
            </ChakraProvider>
          </CacheProvider>
        </ThemeProvider>
      </Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default createWrapper(() => store).withRedux(MyApp);
