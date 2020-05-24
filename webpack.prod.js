const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      title: '[APP NAME]',
      template: './app/public/index.html',
      favicon: './app/public/favicon.ico',
      appMountId: 'root',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
      },
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: 'initial',
    },
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
});
