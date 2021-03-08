const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/lib/client-side/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'src', 'public', 'javascripts'),
  },
};
