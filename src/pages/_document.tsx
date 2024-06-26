import { createGetInitialProps } from '@mantine/next';
import Document, { Html, Head, Main, NextScript } from 'next/document';

const getInitialProps = createGetInitialProps();

class MyDocument extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html lang="es" className="dark">
        <Head>
          <link
            rel="shortcut icon"
            href={process.env.NEXT_PUBLIC_BRAND_LOGO_URL || '/images/logo_62601199d793d.png'}
            type="image/x-icon"
          />
        </Head>
        <body className={`dark bg-light font-sans dark:bg-defaul-body`}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
