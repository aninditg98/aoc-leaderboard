const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
	mode: 'production',
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].bundle.css',
			chunkFilename: '[id].css',
		}),
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
			template: './src/public/index.html',
			favicon: './src/public/favicon.ico',
			appMountId: 'root',
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				conservativeCollapse: true,
			},
		}),
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
					},
					'css-loader',
				],
			},
		],
	},
	optimization: {
		splitChunks: {
			chunks: 'all',
		},
		minimize: true,
		minimizer: [new TerserPlugin()],
	},
});
