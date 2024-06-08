const path = require('path');
const { ProvidePlugin, DefinePlugin } = require('webpack');
const { VueLoaderPlugin } = require('vue-loader');
const CopyPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// Set default manifest location
let manifestLocation = './config/chrome-manifest.json';

// Only change if process.env.browser is set to a different browser
switch (process.env.browser) {
	case 'firefox':
		manifestLocation = './config/firefox-manifest.json';
		break;
	case 'edge':
		manifestLocation = './config/edge-manifest.json';
		break;
	case 'ios':
		manifestLocation = './config/safari-manifest.json';
		break;
	// The 'chrome' case and 'default' case are not necessary if the default is already chrome
}

let manifest = require(manifestLocation);

let versionNumber = manifest.version.split('.').join('-');

module.exports = {
	mode: 'production',
	target: 'web',
	devtool: false, // Use 'source-map' instead of 'eval'

	node: {
		global: false
	},
	// mode: 'development',
	context: `${__dirname}/app/`,
	optimization: {
		usedExports: true,
		minimize: true,
		emitOnErrors: false // Will not emit assets that include errors
		// Add this to disable the generation of license files
	},
	entry: {
		'scripts/content': './scripts/content/index.js',

		'scripts/popup': './scripts/popup.js'
	},

	module: {
		rules: [
			{
				test: /\.styl(us)?$/,
				use: ['style-loader', 'css-loader', 'stylus-loader']
			},
			{
				test: /\.(woff(2)?|ttf|eot|otf|gif|png)(\?v=[0-9]\.[0-9]\.[0-9])?/i,
				type: 'asset/resource'
			},
			{
				test: /\.(txt|pdf)$/i,
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
				test: /\.[jt]sx?$/,
				loader: 'esbuild-loader',
				exclude: /(node_modules|bower_components)/,
				options: {
					// JavaScript version to compile to
					target: 'es2015',
					loader: 'js'
				}
			},
			{
				test: /\.(txt|pdf)$/i,
				use: 'raw-loader'
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
									'./postcss.config.js'
								)
							}
						}
					}
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new DefinePlugin({
			global: 'self',
			__VUE_OPTIONS_API__: true,
			__VUE_PROD_DEVTOOLS__: false
		}),
		new ProvidePlugin({
			Buffer: ['buffer', 'Buffer']
		}),

		new VueLoaderPlugin(),
		new CopyPlugin({
			patterns: [
				{
					context: `${__dirname}/app/`,

					from: `.${manifestLocation}`,

					to: 'manifest.json',
					globOptions: {
						ignore: ['**/.DS_Store']
					}
				},
				{
					context: `${__dirname}/app/`,
					from: 'assets/images/',
					to: 'assets/images/',
					globOptions: {
						ignore: ['**/.DS_Store']
					}
				},

				{
					context: `${__dirname}/app/`,
					from: 'assets/fonts/',
					to: 'assets/fonts/',
					globOptions: {
						ignore: ['**/.DS_Store']
					}
				},
				{
					context: `${__dirname}/app/`,
					from: 'assets/styles/',
					to: 'assets/css/',
					globOptions: {
						ignore: ['**/.DS_Store']
					}
				},

				{
					context: `${__dirname}/app/`,
					from:
						process.env.browser === 'ios'
							? '_locales/en/'
							: '_locales/',
					to:
						process.env.browser === 'ios'
							? '_locales/en/'
							: '_locales/',
					globOptions: {
						ignore: ['**/.DS_Store']
					}
				},
				{
					context: `${__dirname}/app/`,
					from: 'index.html',
					to: 'index.html',
					globOptions: {
						ignore: ['**/.DS_Store']
					}
				}
			]
		}),

		new ZipPlugin({
			path: `../build/${process.env.browser}/${versionNumber}/`,
			filename: `opendyslexic-${process.env.browser}-${versionNumber}.zip`
		})
	],

	resolve: {
		extensions: ['.js', '.vue', '.json'],
		alias: {
			'@': path.resolve(__dirname, 'app'),
			'@assets': path.resolve(__dirname, 'app/assets'),
			'@styles': path.resolve(__dirname, 'app/assets/styles'),
			'@scripts': path.resolve(__dirname, 'app/scripts')
		}
	}
};
