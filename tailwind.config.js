/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme');
import { colorPalette } from './src/config/color-palette';

module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xxs: '180px',
      ...defaultTheme.screens,
      '3xl': '1920px',
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-poppins)', 'cursive', ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        header: 'var(--header-height)',
        'without-header': 'calc(100vh - var(--header-height))',
      },
      zIndex: {
        back: '-1',
        fixed: '100',
        modal: '1000',
        preload: '1100',
      },
      colors: {
        dark: '#212529',
        header: '#161b22',
        light: '#f8f9fa',
        'defaul-body': '#0d1117',
        'gray-dark': '#343a40',
        'yellow-light': '#f1c40f',
        'btn-bg': '#21262d',
        ...colorPalette,
      },
    },
  },
};
