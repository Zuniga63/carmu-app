import { ReactNode } from 'react';
import Head from 'next/head';
import Header from './Header';
import { ScrollArea } from '@mantine/core';
import Sidebar from './Sidebar';

interface Props {
  title?: string;
  children?: ReactNode;
}

export default function Layout({ title, children }: Props) {
  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
  const TITLE = title ? `${title} - ${APP_NAME}` : APP_NAME;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>

      <div className="relative xl:h-screen xl:overflow-hidden">
        <Header title={title} />
        <div className="flex h-[calc(100vh-62px)]">
          <Sidebar />
          <div className="h-full flex-grow overflow-y-auto transition-all duration-200">
            <ScrollArea className="h-full">
              {/* 208 px is the width of sidebar in xl */}
              <main className="w-screen xl:w-[calc(100vw-208px)]">{children}</main>
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
}
