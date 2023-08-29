import 'react-toastify/dist/ReactToastify.css';
import 'nprogress/nprogress.css';

import { ColorScheme, ColorSchemeProvider, MantineProvider } from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { ReactNode, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

// For route progress with NProgress
import Router from 'next/router';
import NProgress from 'nprogress';

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const KEY_THEME = 'mantine-color-scheme';

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: KEY_THEME,
    defaultValue: 'dark',
    getInitialValueInEffect: true,
  });
  useHotkeys([['mod+J', () => toggleColorScheme()]]);

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

  useEffect(() => {
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

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider
        withGlobalStyles
        theme={{
          /** Put your mantine theme override here */
          colorScheme,
          fontFamily: 'inherit',
          loader: 'oval',
        }}
      >
        {children}
      </MantineProvider>

      <ToastContainer
        position="top-left"
        theme={colorScheme}
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
