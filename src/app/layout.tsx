import { Providers } from './providers';
import './globals.css';
import { Metadata } from 'next';
import { inter, poppins } from '@/config/fonts.config';

export const metadata: Metadata = {
  title: {
    template: `%s | ${process.env.NEXT_PUBLIC_APP_NAME}`,
    default: process.env.NEXT_PUBLIC_APP_NAME || 'Default',
  },
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
  icons: {
    icon: '/vercel.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} bg-neutral-100 font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
