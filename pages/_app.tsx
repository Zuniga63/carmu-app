import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { createEmotionCache, MantineProvider } from '@mantine/core';

// Store
import { Provider } from 'react-redux';
import { store, wrapper } from 'store';

const appendCache = createEmotionCache({ key: 'mantine', prepend: false });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <MantineProvider
        emotionCache={appendCache}
        withGlobalStyles
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'light',
          fontFamily: "'Roboto', 'sans-serif'"
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>
    </Provider>
  );
}

export default wrapper.withRedux(MyApp);
