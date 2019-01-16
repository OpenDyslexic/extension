const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  context: __dirname + '/app/',
  entry: {

    'bundle.min.css': [
      '../node_modules/vue-material/dist/vue-material.min.css',
      '../node_modules/vue-material/dist/theme/default.css',
      '../node_modules/material-icons/iconfont/material-icons.css',
      '../app/styles/app.css',
    ],
    'background.js': './scripts.babel/background.js',
    'popup.js': './scripts.babel/popup.js',
  },
  output: {
    path: path.resolve(__dirname, '/dist/help'),
    filename: '[name]'
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'babel-loader'
        }]
      }, {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: 'css-loader'
          })
        },

      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            useRelativePath: false,
            name: '[name].[ext]',
            publicPath: '../fonts/icons/',
            outputPath: 'fonts/'
          }
        }]
      }
    ]
  },

  plugins: [
    new ExtractTextPlugin("bundle.min.css"),

    new UglifyJsPlugin()
  ]
};