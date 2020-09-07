const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
	mode: 'production',
	plugins: [
		new HtmlWebpackPlugin({
			filename: 'generated.html',
			title: '[APP NAME]',
			meta: [
				// viewport meta tag for responsiveness / media queries
				{
					name: 'viewport',
					content: 'width=device-width, initial-scale=1',
				},
			],
			template: require('html-webpack-template'),
			favicon: './src/public/favicon.ico',
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
			chunks: 'all',
		},
		minimize: true,
		minimizer: [new TerserPlugin()],
	},
});
