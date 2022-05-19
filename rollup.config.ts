/** @format */

import withSolid from 'rollup-preset-solid';

export default withSolid({
  targets: ['cjs', 'esm', 'umd'],
  printInstructions: true,
});
