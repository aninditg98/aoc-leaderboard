const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(common, {
	mode: 'development',
	devtool: 'inline-source-map',
	plugins: [
		new HtmlWebpackPlugin({
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
		}),
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
	devServer: {
		hot: true, // enable hot reloading
		overlay: true, // error overlay
		historyApiFallback: {
			disableDotRule: true,
		},
		proxy: {
			'/api': 'http://0.0.0.0::3030',
		},
		host: '0.0.0.0', //your ip address
		port: 8080,
	},
});
