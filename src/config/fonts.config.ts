import { Inter, Poppins } from 'next/font/google';

export const fontDisplay = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['400', '500', '700'],
});

export const fontSans = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '700'],
  variable: '--font-display',
});
