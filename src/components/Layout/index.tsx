import Head from 'next/head';
import Header from './Header';
import LayoutBody from './LayoutBody';
import LayoutContent from './LayoutContent';

interface Props {
  title?: string;
  children?: React.ReactNode;
}

export default function Layout({ title, children }: Props) {
  const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME;
  const TITLE = title ? `${title} - ${APP_NAME}` : APP_NAME;

  return (
    <>
      <Head>
        <title>{TITLE}</title>
      </Head>

      <LayoutBody>
        <Header title={title} />
        <LayoutContent>{children}</LayoutContent>
      </LayoutBody>
    </>
  );
}
