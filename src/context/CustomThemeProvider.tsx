import 'react-toastify/dist/ReactToastify.css';
import 'nprogress/nprogress.css';

import { MantineProvider } from '@mantine/core';
import { ReactNode, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';

// For route progress with NProgress
import Router from 'next/router';
import NProgress from 'nprogress';
import { useInitialAuth } from '@/hooks/useInitialAuth';

export default function ThemeProvider({ children }: { children: ReactNode }) {
  useInitialAuth();

  useEffect(() => {
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
    <>
      <MantineProvider
        withGlobalStyles
        theme={{
          colorScheme: 'dark',
          fontFamily: 'inherit',
          loader: 'oval',
        }}
      >
        {children}
      </MantineProvider>

      <ToastContainer
        position="top-left"
        theme={'dark'}
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}
