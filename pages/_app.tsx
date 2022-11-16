import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/es-do';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { ToastContainer } from 'react-toastify';

// For route progress with NProgress
import Router from 'next/router';
import NProgress from 'nprogress';

// Store
import { Provider } from 'react-redux';
import { store, wrapper } from 'store';
import { useEffect } from 'react';
import { useAppDispatch } from 'store/hooks';
import { authenticate } from 'store/reducers/Auth/creators';

// Styles
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import 'nprogress/nprogress.css';
import { emCache } from 'utils/emotionCache';

// Config
axios.defaults.baseURL = process.env.NEXT_PUBLIC_URL_API;
dayjs.locale('es-do');
dayjs.extend(relativeTime);
NProgress.configure({ showSpinner: false });

function MyApp({ Component, pageProps }: AppProps) {
  const dispatch = useAppDispatch();
  // For cache of mantine
  emCache();
  useEffect(() => {
    dispatch(authenticate());

    // NProgress
    // https://caspertheghost.me/blog/nprogress-next-js
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();

    Router.events.on('routeChangeStart', handleRouteStart);
    Router.events.on('routeChangeComplete', handleRouteDone);
    Router.events.on('routeChangeError', handleRouteDone);

    return () => {
      // Make sure to remove the event handler on unmount!
      Router.events.off('routeChangeStart', handleRouteStart);
      Router.events.off('routeChangeComplete', handleRouteDone);
      Router.events.off('routeChangeError', handleRouteDone);
    };
  }, []);

  return (
    <Provider store={store}>
      <MantineProvider
        withGlobalStyles
        theme={{
          /** Put your mantine theme override here */
          colorScheme: 'dark',
          fontFamily: 'inherit',
          loader: 'bars',
        }}
      >
        <Component {...pageProps} />
      </MantineProvider>

      <ToastContainer
        position="top-left"
        theme="dark"
        autoClose={2000}
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
