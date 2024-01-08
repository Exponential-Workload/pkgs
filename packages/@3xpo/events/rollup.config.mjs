// rollup config file for library
// only ts plugin needed
// emit declaration file
// emit sourcemap file
// emit esm and cjs module
// emit minified version

import typescript from '@rollup/plugin-typescript';

const footer = `/*Copyright (c) 2023 Expo. Licensed under the MIT License.*/
`

/** @type {import('rollup').RollupOptions} */
export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'esm',
      sourcemap: true,
      footer: footer,
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist/',
    }),
  ],
};
