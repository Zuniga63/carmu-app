import { extendTheme } from '@chakra-ui/react';
import { inter, poppins } from '@/config/fonts.config';
import { colorPalette } from './color-palette';

export const theme = extendTheme({
  fonts: {
    heading: poppins.style.fontFamily,
    body: inter.style.fontFamily,
  },
  initialColorMode: 'light',
  useSystemColorMode: false,
  breakpoints: {
    xs: '425px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  colors: colorPalette,
});
