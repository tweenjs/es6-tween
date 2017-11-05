var rollup = require('rollup')

export default {
  input: 'src/index.js',
  output: {
  format: 'umd',
  file: 'full/Tween.js'
  },
  sourcemap: true,
  context: 'this',
  name: 'TWEEN'
}