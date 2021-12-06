require('dotenv').config();
const webpack = require('webpack');

module.exports = {
  entry: {
    connect: './src/connect.js',
    screen: './src/screen.js',
  },
  output: {
    path: __dirname + '/bin',
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
    ],
  },
  mode: 'production',
  target: ['node'],
  plugins: [
    new webpack.BannerPlugin({
      banner: `#!/usr/bin/env node\n\nSETTINGS_PATH = '${process.env.SETTINGS_PATH || '/home/pi/midi.settings.json'}';`,
      raw: true,
    }),
  ],
};