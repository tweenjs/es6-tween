import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import { minify } from 'uglify-es'

const { min } = process.env
const isMinify = min === 'true'
const minSuffix = isMinify ? '.min' : ''

const plugins = [
	// ES6->ES5 syntax/code transpiler
	buble({
		// Spread to Object merge/assign
		objectAssign: `Object.assign`,
		// Features
		transforms: {
			// For of feature
			dangerousForOf: true
		}
	}),
	nodeResolve({
      main: true
    }),
    commonjs({
      include: ['./node_modules/intertween/index.js']
    })
]

if ( isMinify ) {
	plugins.push(
	// Minify
	uglify({
		sourceMap: {
			filename: `src/Tween.js`,
			url: `dist/Tween${minSuffix}.js.map`
		}
	}, minify)
	);
}

export default {
  entry: 'src/Tween.js',
  format: 'umd',
  sourceMap: true,
  context: 'this',
  dest: `dist/Tween${minSuffix}.js`,
  moduleName: 'TWEEN',
  plugins: plugins
}
