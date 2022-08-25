import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { createEmotionCache, MantineProvider } from '@mantine/core';

const appendCache = createEmotionCache({ key: 'mantine', prepend: false });

function MyApp({ Component, pageProps }: AppProps) {
  return (
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
  );
}

export default MyApp;
