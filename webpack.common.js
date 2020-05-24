const path = require('path');

module.exports = {
  entry: {
    main: './app/index.tsx',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve('build'),
  },
  resolve: {
    modules: ['node_modules', path.join(__dirname, 'app'), 'shared'],
    // Add `.ts` and `.tsx` as a resolvable extension.
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.module\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: { modules: true, localsConvention: 'camelCaseOnly' },
          },
        ],
      },
      {
        // Include ts, tsx, js, and jsx files.
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg)$/,
        use: 'file-loader',
      },
    ],
  },
};
