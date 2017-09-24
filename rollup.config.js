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
  entry: 'src/index.js',
  format: 'umd',
  dest: 'full/Tween.js',
  globals: {
	'intertween': 'InterTween'
  },
  sourceMap: true,
  context: 'this',
  moduleName: 'TWEEN',
  plugins: plugins
}