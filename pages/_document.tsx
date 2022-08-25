import { createGetInitialProps } from '@mantine/next';
import Document, { Html, Head, Main, NextScript } from 'next/document';

const getInitialProps = createGetInitialProps();

class MyDocument extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html lang="es">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Roboto:ital,wght@0,400;0,500;0,700;1,400&family=Zen+Dots&display=swap"
            rel="stylesheet"
          />
          {/* <link
            rel="shortcut icon"
            href="https://res.cloudinary.com/dr8snppzz/image/upload/v1660154188/digital-menu/logo_zby22a.png"
            type="image/x-icon"
          /> */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
