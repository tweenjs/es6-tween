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
  plugins: [
    babel({
      babelrc: false,
      exclude: ['node_modules/**', 'bundles/**'],
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
            shippedProposals: true
          }
        ]
      ],
      plugins: [
        '@babel/plugin-proposal-class-properties'
      ]
    })
  ]
}
