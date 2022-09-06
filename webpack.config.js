const path = require('path');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

let manifestLocation = './config/chrome-manifest.json';

switch (process.env.browser) {
	case 'chrome': {
		manifestLocation = './config/chrome-manifest.json';
		break;
	}
	case 'firefox': {
		manifestLocation = './config/firefox-manifest.json';
		break;
	}
	case 'edge': {
		manifestLocation = './config/edge-manifest.json';
		break;
	}
	case 'ios': {
		manifestLocation = './config/safari-manifest.json';
		break;
	}
	default: {
		manifestLocation = './config/chrome-manifest.json';
		break;
	}
}
let manifest = require(manifestLocation);

let versionNumber = manifest.version.split('.').join('-');

module.exports = {
	mode: 'production',
	// mode: 'development',
	context: `${__dirname}/app/`,
	entry: {
		'scripts/content.js': './scripts/content/index.js',

		'scripts/background.js': './scripts/background/index.js',

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
				test: /\.(ttf|eot|svg|gif|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,

				loader: 'file-loader'
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
					context: `${__dirname}/app/`,

					from: `.${manifestLocation}`,

					to: 'manifest.json'
				},
				{
					context: `${__dirname}/app/`,
					from: 'assets/css/',
					to: 'assets/css/'
				},
				{
					context: `${__dirname}/app/`,
					from: 'index.html',
					from: 'index.html',
					to: 'index.html'
				},

				{
					context: `${__dirname}/app/`,
					from: 'assets/images/',
					to: 'assets/images/'
				},
				{
					context: `${__dirname}/app/`,
					from: 'assets/fonts/',
					to: 'assets/fonts/'
				},
				{
					context: `${__dirname}/app/`,
					from: 'assets/styles/',
					to: 'assets/styles/'
				},
				{
					context: `${__dirname}/app/`,
					from: '_locales/',
					to: '_locales/'
				}
			]
		}),
		new VueLoaderPlugin(),
		new ZipPlugin({
			path: `../build/${process.env.browser}/${versionNumber}/`,
			filename: `opendyslexic-${process.env.browser}-${versionNumber}.zip`,
			initialFile: path.resolve(__dirname, 'dist')
		})
	],

	output: {
		publicPath: '/',
		filename: '[name]',
		path: path.resolve(__dirname, 'dist')
	}
};
