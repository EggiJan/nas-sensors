const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports =  {
  mode: "production",
  devtool: "source-map",

  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom')
    },
  },

  entry: path.resolve(__dirname, 'src/index.tsx'),

  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkHash].js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [{
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [{
          loader: "ts-loader"
        }]
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/assets/index.html')
    }),
    new Dotenv({
      path: process.env.NODE_ENV === 'production' ? './.env.production' : './.env'
    }),
    new CopyPlugin({
      patterns: [{
        from: 'src/assets/error.html',
        to: 'error.html'
      }]
    })
  ],

  devServer: {
    contentBase: path.join(__dirname, '/'),
    compress: true,
    port: 1234
  }
};