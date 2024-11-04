import '../styles/globals.css';
import '@/config/dates.config';

import type { AppProps } from 'next/app';

import queryClient from '@/config/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { rootConfig } from '@/config/root-config';
import ThemeProvider from '@/context/CustomThemeProvider';
import { emCache } from '@/lib/utils/emotionCache';
import { fontDisplay, fontSans } from '@/config/fonts.config';
import { Toaster } from '@/components/ui/toaster';
import { SessionProvider } from 'next-auth/react';

rootConfig();

export default function MyApp({ Component, pageProps }: AppProps) {
  emCache();

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <div className={`${fontDisplay.variable} ${fontSans.variable} font-sans ${fontDisplay.className}`}>
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster />
      </QueryClientProvider>
    </SessionProvider>
  );
}
