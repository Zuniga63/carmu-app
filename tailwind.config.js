/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  darkMode: 'class',
  content: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xxs: '180px',
      ...defaultTheme.screens,
      '3xl': '1920px',
    },
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif', ...defaultTheme.fontFamily.sans],
      },
      zIndex: {
        back: '-1',
        fixed: '100',
        modal: '1000',
        preload: '1100',
      },
      colors: {
        'defaul-body': '#0d1117',
        'gray-dark': '#343a40',
        'yellow-light': '#f1c40f',
        dark: '#212529',
        light: '#f8f9fa',
        header: '#161b22',
        'btn-bg': '#21262d',
      },
    },
  },
};
