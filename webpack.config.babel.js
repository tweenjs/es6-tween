const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const env  = require('yargs').argv.env; // use --env with webpack 2

let libraryName = 'Tween';

let plugins = [], outputFile;

if (env === 'build') {
  plugins.push(new UglifyJsPlugin({ minimize: true, output: {comments: false} }));
  outputFile = libraryName + '.min.js';
} else {
  outputFile = libraryName + '.js';
}

const config = {
  entry: __dirname + '/src/Tween.js',
  devtool: 'source-map',
  output: {
    path: __dirname,
    filename: 'dist/' + outputFile,
	library: 'TWEEN',
	libraryTarget: 'umd'
  },
  module: {
	loaders: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  plugins: plugins
};

module.exports = config;