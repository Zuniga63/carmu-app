import '../styles/globals.css';

import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { createWrapper } from 'next-redux-wrapper';

import { store } from 'src/store';
import { useInitialAuth } from 'src/hooks/useInitialAuth';
import { rootConfig } from 'src/config/root-config';
import ThemeProvider from 'src/context/CustomThemeProvider';
import { emCache } from 'src/utils/emotionCache';

rootConfig();

export function MyApp({ Component, pageProps }: AppProps) {
  useInitialAuth();
  emCache();

  return (
    <ThemeProvider>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ThemeProvider>
  );
}

export default createWrapper(() => store).withRedux(MyApp);
