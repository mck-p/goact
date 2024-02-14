const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const Dotenv = require('dotenv-webpack')
const webpack = require('webpack')

module.exports = {
  mode: process.env.ENVIRONMENT === 'prod' ? 'production' : 'development',
  entry: './src/entry.tsx',
  devtool: 'inline-source-map',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    publicPath: '/' 
  },
  devServer: {
    port: 8081,
    historyApiFallback: true,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
  },
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      templateContent: `
<!DOCTYPE html>
<html lang="en">
    <head>
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap"
      />
    </head>
    <body>
        <div id="root">
        </div>
    </body>
</html>`,
    }),
  ],
  // optimization: {
  //   runtimeChunk: 'single',
  //   splitChunks: {
  //     chunks: 'all',
  //   },
  // },
}
