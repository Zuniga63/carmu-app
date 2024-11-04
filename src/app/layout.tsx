import { Providers } from './providers';
import '@/styles/globals.css';
import { Metadata } from 'next';
import { fontDisplay, fontSans } from '@/config/fonts.config';

export const metadata: Metadata = {
  title: {
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME}`,
    default: process.env.NEXT_PUBLIC_APP_NAME || 'Carmú',
  },
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
  icons: {
    icon: process.env.NEXT_PUBLIC_BRAND_LOGO_URL || '/images/logo_62601199d793d.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fontDisplay.variable} ${fontSans.variable} bg-neutral-100 font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
