const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = [
{
  name: 'ssoIframe',
  entry: './resources/js/sso.js',
  output: {
    filename: 'ssoIframe.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ssoIframe',
    libraryTarget: 'var'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env']
          }
        }
      }
    ]
  },
  // devtool: 'inline-source-map',
  // devServer: {
  //   contentBase: './dist'
  // }
  // ,
  plugins: [
    new UglifyJsPlugin()
  ]
},
{
  name: 'ssoPub',
  entry: './resources/js/sslssso.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'sslssso',
    libraryTarget: 'var'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env']
          }
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: 'file-loader',
          options: {}
        }
      }
    ]
  },
  // devtool: 'inline-source-map',
  // devServer: {
  //   contentBase: './dist'
  // }
  // ,
  plugins: [
    new UglifyJsPlugin()
  ]
}
];
