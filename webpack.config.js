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
      banner: `#!/usr/bin/env node\n\nSETTINGS_PATH = '/home/pi/midi.settings.json';`,
      raw: true,
    }),
  ],
};