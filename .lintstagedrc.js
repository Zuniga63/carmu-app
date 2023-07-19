const path = require('path');

const buildEslintCommand = filenames =>
  `next lint --fix --file ${filenames.map(f => path.relative(process.cwd(), f)).join(' --file ')}`;

const buildPrettierCommand = filenames =>
  `prettier --write ${filenames.map(f => path.relative(process.cwd(), f)).join(' ')}`;

module.exports = {
  // Type check TypeScript files
  '**/*.(ts|tsx)': () => 'pnpm tsc --noEmit',

  // Lint & Prettify TS and JS files
  '*.{js,jsx,ts,tsx}': [buildEslintCommand, buildPrettierCommand],
};
