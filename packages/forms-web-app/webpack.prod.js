const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const config = require('./src/config.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.GOOGLE_ANALYTICS_ID': JSON.stringify(config.server.googleAnalyticsId),
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
});
