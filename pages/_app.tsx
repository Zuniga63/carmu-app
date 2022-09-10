import axios from 'axios';
import type { AppProps } from 'next/app';
import { createEmotionCache, MantineProvider } from '@mantine/core';
import { ToastContainer } from 'react-toastify';

// Store
import { Provider } from 'react-redux';
import { store, wrapper } from 'store';
import { useEffect } from 'react';
import { useAppDispatch } from 'store/hooks';
import { authenticate } from 'store/reducers/Auth/creators';

// Styles
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

const appendCache = createEmotionCache({ key: 'mantine', prepend: false });
axios.defaults.baseURL = process.env.NEXT_PUBLIC_URL_API;

function MyApp({ Component, pageProps }: AppProps) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(authenticate());
  }, []);

  return (
    <Provider store={store}>
      <MantineProvider
        emotionCache={appendCache}
        withGlobalStyles
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'light',
          fontFamily: 'inherit',
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>

      <ToastContainer
        position="bottom-right"
        theme="dark"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Provider>
  );
}

export default wrapper.withRedux(MyApp);
