import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: {
    format: 'umd',
    file: 'bundled/Tween.js',
    name: 'TWEEN',
    sourcemap: true
  },
  context: 'this',
  plugins: [babel()]
}
