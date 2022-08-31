/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif', ...defaultTheme.fontFamily.sans],
        display: ['Zen Dots', 'cursive', ...defaultTheme.fontFamily.sans],
        hand: ['Dancing Script', 'cursive', ...defaultTheme.fontFamily.sans],
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
  plugins: ['prettier', require('@tailwindcss/line-clamp')],
};
