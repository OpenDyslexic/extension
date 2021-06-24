const webpack = require('webpack');
const path = require('path');

const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = {
	mode: 'production',
	//	mode: 'production',
	context: __dirname + '/app/',
	entry: {
		'scripts/content.js': './scripts/content.js',
		'scripts/popup.js': './scripts/popup.js'
	},

	resolve: {
		alias: {
			vue: 'vue/dist/vue.runtime.min.js'
		}
	},
	module: {
		rules: [
			{
				test: /\.txt$/i,
				use: 'raw-loader'
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
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
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								config: path.resolve(
									__dirname,
									'./config/postcss.config.js'
								)
							}
						}
					}
				]
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('web')
		}),
		new CopyPlugin({
			patterns: [
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
					from: `../config/${process.env.browser}-manifest.json`,

					to: 'manifest.json'
				},
				{
					context: __dirname + '/app/',
					from: '_locales/',
					to: '_locales/'
				}
			]
		}),

		new VueLoaderPlugin(),
		new ZipPlugin({
			path: `../build/${process.env.browser}`,
			filename: 'opendyslexic.zip',
			initialFile: path.resolve(__dirname, `dist`)
		})
	],
	output: {
		publicPath: '/',
		filename: '[name]',
		path: path.resolve(__dirname, 'dist')
	}
};
