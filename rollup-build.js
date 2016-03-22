const rollup = require('rollup').rollup;

const babel = require('rollup-plugin-babel');
// const uglify = require('rollup-plugin-uglify');

rollup({
	entry: 'src/index.js',
	plugins: [
		babel({
			exclude: 'node_modules/**',
			presets: 'es2015-rollup',
			babelrc: false,
		}),
		// uglify(),
	],
}).then((bundle) =>
	bundle.write({
		format: 'umd',
		dest: 'dist/Tween.js',
		moduleName: 'TWEEN',
	})
).then(() => {
	console.log('Bundle created');
})
.catch((err) => console.log(err));
