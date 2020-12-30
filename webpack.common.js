const path = require('path');

module.exports = {
	entry: {
		main: './src/renderers/dom.tsx',
	},
	output: {
		// publicPath specifies the public URL of the output directory when referenced in a browser
		// Without this, webpack dev server could not locate the bundles when loading the app on a nested entrypoint
		publicPath: '/',
		filename: '[name].[hash].bundle.js',
		path: path.join(__dirname, 'dist'),
	},
	resolve: {
		modules: ['node_modules', path.join(__dirname, 'src'), 'shared'],
		// Add `.ts` and `.tsx` as a resolvable extension.
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.css', 'ico', 'eot', 'ttf', 'woff', 'woff2', 'png', 'jpg', 'svg'],
	},
	module: {
		rules: [
			{
				// Include ts, tsx, js, and jsx files.
				test: /\.(ts|js)x?$/,
				exclude: /node_modules/,
				use: 'babel-loader',
			},
			{
				test: /\.(ico|eot|svg|ttf|woff|woff2|png|jpg)$/,
				use: 'file-loader',
			},
		],
	},
	stats: {
		chunks: true,
		chunkModules: true,
		colors: true,
	},
};
