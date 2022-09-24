import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/es-do';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
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
import { emCache } from 'utils/emotionCache';

// Config
axios.defaults.baseURL = process.env.NEXT_PUBLIC_URL_API;
dayjs.locale('es-do');
dayjs.extend(relativeTime);

function MyApp({ Component, pageProps }: AppProps) {
  const dispatch = useAppDispatch();
  // For cache of mantine
  emCache();
  useEffect(() => {
    dispatch(authenticate());
  }, []);

  return (
    <Provider store={store}>
      <MantineProvider
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
