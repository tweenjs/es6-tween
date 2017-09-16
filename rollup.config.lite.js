import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'
import { minify } from 'uglify-es'

const { min } = process.env
const isMinify = min === 'true'
const minSuffix = isMinify ? '.min' : ''

let mode = (isMinify ? '' : 'un') + 'compressed'

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
	})
]

if ( isMinify ) {
	plugins.push(
	// Minify
	uglify({
		sourceMap: {
			filename: `src/index.lite.js`,
			url: `lite/Tween${minSuffix}.js.map`
		}
	}, minify)
	);
}

export default {
  input: 'src/index.lite.js',
  output: {
  format: 'umd',
  file: `lite/Tween${minSuffix}.js`
  },
  sourcemap: true,
  context: 'this',
  name: 'TWEEN',
  plugins: plugins
}
