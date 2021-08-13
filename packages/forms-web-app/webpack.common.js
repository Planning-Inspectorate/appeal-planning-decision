const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    index: './src/lib/client-side/index.js',
    cookiePreferences: './src/lib/client-side/cookie-preferences-page.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'src', 'public', 'javascripts'),
  },
  plugins: [
    new webpack.plugins({
      'process.env': {
        'googleTagManager': JSON.stringify(JSON.stringify(process.env.googleTagManager || 'false')),
        'googleTagManagerId': JSON.stringify(JSON.stringify(process.env.googleTagManagerId || ''))
      }
    })
  ],
};
