import buble from 'rollup-plugin-buble'
import uglify from 'rollup-plugin-uglify'
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
	})
]

if ( isMinify ) {
	plugins.push(
	// Minify
	uglify({
		sourceMap: {
			filename: `src/Tween.Lite.js`,
			url: `dist/Tween.Lite${minSuffix}.js.map`
		}
	}, minify)
	);
}

export default {
  entry: 'src/Tween.Lite.js',
  format: 'umd',
  sourceMap: true,
  context: 'this',
  dest: `dist/Tween.Lite${minSuffix}.js`,
  moduleName: 'TWEEN',
  plugins: plugins
}
