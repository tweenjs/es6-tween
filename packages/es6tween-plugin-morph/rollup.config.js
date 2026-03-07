import buble from 'rollup-plugin-buble'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
	input: 'morph.esmodule.js',
	context: 'this',
	output: {
		format: 'iife',
		globals: {
			'svg-points': 'SVGPoints',
			'es6-tween': 'TWEEN',
			'flubber': 'flubber'
		},
		name: 'es6TweenMorphPlugin',
		file: 'morph.js'
	},
	plugins: [
		buble({
			objectAssign: 'Object.assign',
			transforms: {
				dangerousForOf: true
			}
		}),
		resolve({
			module: true,
			jsnext: true,
			main: true
		}),
		commonjs({
			include: ['node_modules/svg-points', 'node_modules/flubber'],
			exclude: ['node_modules/**']
		})
	],
	external: [
		'es6-tween',
		'flubber'
	]
}