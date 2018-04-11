const path = require('path');

module.exports = {
  entry: {
    background: './src/background.js',
    popup: './src/popup.js',
    contentScript: './src/contentScript.js',
    ajaxListener: './src/ajaxListener.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist/js'),
    filename: '[name].js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
};