import '../styles/globals.css';
import '@/config/dates.config';

import type { AppProps } from 'next/app';

import queryClient from '@/config/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { rootConfig } from '@/config/root-config';
import ThemeProvider from '@/context/CustomThemeProvider';
import { emCache } from '@/lib/utils/emotionCache';
import { inter, poppins } from '@/config/fonts.config';
import { Toaster } from '@/components/ui/toaster';

rootConfig();

export default function MyApp({ Component, pageProps }: AppProps) {
  emCache();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className={`${inter.variable} ${poppins.variable} font-sans ${inter.className}`}>
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster />
    </QueryClientProvider>
  );
}
