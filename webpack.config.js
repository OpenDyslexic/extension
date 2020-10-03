const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = {
mode: 'development',
//	mode: 'production',
	context: __dirname + '/app/',
	entry: {
		'scripts/content.js': './scripts/content.js',
		'scripts/popup.js': './scripts/popup.js',

	},
	output: {
		path: path.resolve(__dirname, '/dist/help'),
		filename: '[name]'
	},
	resolve: {
		alias: {
			vue$: 'vue/dist/vue.esm.js'
		},
		extensions: ['.ts', '.js', '.vue', '.json']
	},
	module: {
		rules: [{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					loaders: {},
					esModule: true // example of setting to false
				}
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',

				exclude: /(node_modules|bower_components)/
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [{
					loader: 'file-loader',
					options: {
						useRelativePath: false,
						name: '[name].[ext]',
						publicPath: 'fonts/icons/',
						outputPath: 'fonts/'
					}
				}]
			}
		]
	},
	plugins: [
		new CopyPlugin([

			{
				context: __dirname + '/app/',
				from: 'index.html',
				to: 'index.html'
			},
			{
				context: __dirname + '/app/',
				from: 'images/',
				to: 'images/'
			},
			{
				context: __dirname + '/app/',
				from: 'fonts/',
				to: 'fonts/'
			},
			{
				context: __dirname + '/app/',
				from: 'styles/',
				to: 'styles/'
      },
      {
				context: __dirname + '/app/',
				from: 'manifest.json',
				to: ''
			},
			{
				context: __dirname + '/app/',
				from: '_locales/',
				to: '_locales/'
			},
	
		]),

		new VueLoaderPlugin(),
		new ZipPlugin({
			path: '../build',
			initialFile: './dist',
			zipName: 'helperbird.zip'
		})
	],
	output: {
		publicPath: '/',
		filename: '[name]',
		path: path.resolve(__dirname, 'dist')
  }
};