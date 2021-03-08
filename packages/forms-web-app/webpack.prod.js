const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.GOOGLE_ANALYTICS_ID': JSON.stringify('G-RTYZW789M0'),
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
});
