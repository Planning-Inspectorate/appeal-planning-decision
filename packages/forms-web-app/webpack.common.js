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
  plugins: [
    new webpack.DefinePlugin({
      'process.env.googleAnalyticsId': JSON.stringify(process.env.GOOGLE_ANALYTICS_ID),
      'process.env.googleTagManager': process.env.FEATURE_FLAG_GOOGLE_TAG_MANAGER === 'true',
    }),
  ],
};
