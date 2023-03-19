import axios from 'axios';
import dayjs from 'dayjs';
import 'dayjs/locale/es-do';
import relativeTime from 'dayjs/plugin/relativeTime';
import type { AppProps } from 'next/app';
import {
  ColorScheme,
  ColorSchemeProvider,
  MantineProvider,
} from '@mantine/core';
import { toast, ToastContainer } from 'react-toastify';

// For route progress with NProgress
import Router from 'next/router';
import NProgress from 'nprogress';

// Store
import { Provider } from 'react-redux';
import { store } from 'src/store';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'src/store/hooks';
import { createWrapper } from 'next-redux-wrapper';

// Styles
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';
import 'nprogress/nprogress.css';
import { emCache } from 'src/utils/emotionCache';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import {
  authSelector,
  authSuccessIsNotify,
  authenticate,
} from 'src/features/Auth';
import { fetchCommercialPremises } from 'src/features/Config';

// Config
axios.defaults.baseURL = process.env.NEXT_PUBLIC_URL_API;
dayjs.locale('es-do');
dayjs.extend(relativeTime);
NProgress.configure({ showSpinner: false });

export function MyApp({ Component, pageProps }: AppProps) {
  const dispatch = useAppDispatch();
  const { user, authIsSuccess, isAuth } = useAppSelector(authSelector);

  // --------------------------------------------------------------------------
  // SET THEME APP
  // --------------------------------------------------------------------------
  emCache();
  const KEY_THEME = 'mantine-color-scheme';

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: KEY_THEME,
    defaultValue: 'dark',
    getInitialValueInEffect: true,
  });

  const setGlobalDarkTheme = (value?: ColorScheme) => {
    let theme: ColorScheme = value || 'dark';

    if (!value && window) {
      const localTheme = JSON.parse(localStorage[KEY_THEME] || null);
      if (localTheme && localTheme === 'light') theme = 'light';
    }

    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleColorScheme = (value?: ColorScheme) => {
    const theme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    setColorScheme(theme);
    setGlobalDarkTheme(theme);
  };

  useHotkeys([['mod+J', () => toggleColorScheme()]]);

  // --------------------------------------------------------------------------
  // EFFECTS
  // --------------------------------------------------------------------------
  useEffect(() => {
    dispatch(authenticate());
    setGlobalDarkTheme();

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

  useEffect(() => {
    if (authIsSuccess) {
      const message = (
        <span>
          ¡Bienvenido <strong className="font-bold">{user?.name}</strong>!
        </span>
      );
      toast.success(message, { position: 'top-right' });
      dispatch(authSuccessIsNotify());
    }
  }, [authIsSuccess]);

  useEffect(() => {
    dispatch(fetchCommercialPremises());
  }, [isAuth]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        theme={{
          /** Put your mantine theme override here */
          colorScheme,
          fontFamily: 'inherit',
          loader: 'bars',
        }}
      >
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
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
    </ColorSchemeProvider>
  );
}

export default createWrapper(() => store).withRedux(MyApp);
