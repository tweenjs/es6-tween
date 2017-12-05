var rollup = require('rollup')

export default {
  input: 'src/index.js',
  output: {
  format: 'umd',
  file: 'bundled/Tween.js'
  },
  sourcemap: true,
  context: 'this',
  name: 'TWEEN'
}