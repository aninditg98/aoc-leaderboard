const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: '[APP NAME]',
      template: './app/public/index.html',
      favicon: './app/public/favicon.ico',
      appMountId: 'root',
    }),
  ],
  devServer: {
    proxy: {
      '/api': 'http://localhost:3030',
    },
    contentBase: path.join(__dirname, './build'),
    historyApiFallback: true,
  },
});
