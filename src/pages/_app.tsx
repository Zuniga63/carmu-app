import '../styles/globals.css';

import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { createWrapper } from 'next-redux-wrapper';

import { store } from '@/store';
import { useInitialAuth } from '@/hooks/useInitialAuth';
import { rootConfig } from '@/config/root-config';
import ThemeProvider from '@/context/CustomThemeProvider';
import { emCache } from '@/utils/emotionCache';
import { inter, poppins } from '@/config/fonts.config';

rootConfig();

export function MyApp({ Component, pageProps }: AppProps) {
  useInitialAuth();
  emCache();

  return (
    <ThemeProvider>
      <Provider store={store}>
        <div className={`${inter.variable} ${poppins.variable} font-sans`}>
          <Component {...pageProps} />
        </div>
      </Provider>
    </ThemeProvider>
  );
}

export default createWrapper(() => store).withRedux(MyApp);
