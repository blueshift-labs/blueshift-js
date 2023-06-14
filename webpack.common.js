// webpack.common.js

const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'blueshift',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  plugins: [
    new Dotenv()
  ],
};
