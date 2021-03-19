const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    index: './src/lib/client-side/index.js',
    cookiePreferences: './src/lib/client-side/cookie-preferences-page.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'src', 'public', 'javascripts'),
  },
};
