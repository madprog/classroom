const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractHtml = new ExtractTextPlugin('[name]');
const extractScss = new ExtractTextPlugin('[name]');

module.exports = {
  cache: true,
  devtool: 'source-map',
  entry: {
    'index.html': './src/index.html',
    'index.js': './src/app/index.js',
    'index.css': './src/style/index.scss',
  },
  module: {
    loaders: [
      {
        test: /\.html$/,
        loader: extractHtml.extract(['html-loader']),
      },
      { test: /\.js$/, exclude: /node_modules/, loaders: [
        'babel-loader?presets[]=react&presets[]=es2015&plugins[]=transform-object-rest-spread',
        'eslint-loader?{configFile:".eslintrc.json"}',
      ] },
      {
        test: /\.scss$/,
        loader: extractScss.extract(['css-loader', 'sass-loader']),
      },
    ],
  },
  output: {
    path: 'www/',
    filename: '[name]',
  },
  plugins: [
    extractHtml,
    extractScss,
  ],
};
