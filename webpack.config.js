require('dotenv').config();
const webpack = require('webpack');

module.exports = {
  entry: './connect.js',
  output: {
    path: __dirname + '/bin',
    filename: 'connect.js',
  },
  mode: 'production',
  target: ['node'],
  plugins: [
    new webpack.BannerPlugin({
      banner: '#!/usr/bin/env node',
      raw: true,
    }),
    new webpack.DefinePlugin({
      'process.env.SETTINGS_PATH': `"${process.env.SETTINGS_PATH}"`,
    }),
  ],
};