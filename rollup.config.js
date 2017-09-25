var rollup = require('rollup')
var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');

var plugins = [
	nodeResolve({
      main: true,
	  jsnext: true
    }),
    commonjs({
      include: ['node_modules/intertween/index.js']
    })
]

export default {
  input: 'src/index.js',
  output: {
  format: 'umd',
  file: 'full/Tween.js'
  },
  globals: {
	'intertween': 'InterTween'
  },
  sourcemap: true,
  context: 'this',
  name: 'TWEEN',
  plugins: plugins
}