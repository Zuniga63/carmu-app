/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      zIndex: {
        back: '-1',
        fixed: '100',
        modal: '1000',
        preload: '1100'
      }
    }
  },
  plugins: ['prettier']
};
