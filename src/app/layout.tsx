import { Providers } from './providers';
import '@/styles/globals.css';
import { Metadata } from 'next';
import { fontDisplay, fontSans } from '@/config/fonts.config';
import { authOptions } from '@/modules/auth/config';
import { getServerSession } from 'next-auth';

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions());
  return (
    <html lang="es">
      <body className={`${fontDisplay.variable} ${fontSans.variable} min-h-screen bg-background font-sans antialiased dark`}>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
