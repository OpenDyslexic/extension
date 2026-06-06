const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const targetBrowser = process.env.browser || 'chrome';
const distDir = path.resolve(__dirname, 'dist', targetBrowser);
const manifestLocation = getManifestLocation(targetBrowser);
const manifest = require(`./config/${manifestLocation}`);
const versionNumber = manifest.version.split('.').join('-');

function getManifestLocation(browser) {
	switch (browser) {
		case 'firefox':
			return 'firefox-manifest.json';
		case 'edge':
			return 'edge-manifest.json';
		default:
			return 'chrome-manifest.json';
	}
}

module.exports = {
	mode: 'production',
	context: path.resolve(__dirname, 'app'),
	output: {
		path: distDir,
		filename: '[name].js'
	},
	entry: {
		'background': {
			import: './scripts/background/index.js',
			filename: 'scripts/background.js'
		},
		'scripts/engine': './scripts/content/engine.js',

		'scripts/popup': './scripts/popup.js'
	},

	module: {
		rules: [
			{
				test: /\.styl(us)?$/,
				use: ['style-loader', 'css-loader', 'stylus-loader']
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					esModule: true
				}
			},
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
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
			},
			{
				test: /\.(txt|pdf)$/i,
				use: 'raw-loader'
			},
			{
				test: /\.(png|jpe?g|gif)$/i,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'images/[name].[ext]',
							publicPath: '..'
						}
					}
				]
			}
		]
	},
	plugins: [
		new VueLoaderPlugin(),
		new CopyPlugin({
			patterns: [
				{
					context: path.resolve(__dirname, 'config'),

					from: manifestLocation,
					to: `${distDir}/manifest.json`
				},
				{
					from: './assets/fonts/',
					to: path.resolve(distDir, 'assets/fonts/')
				},

				{
					from: './assets/styles/',
					to: path.resolve(distDir, 'assets/css/')
				},
				{
					from: './_locales/',
					to: path.resolve(distDir, '_locales/')
				},
				{
					from: './assets/images/',
					to: path.resolve(distDir, 'assets/images/')
				},
				{
					from: 'index.html',
					to: path.resolve(distDir)
				}
			]
		}),

		new ZipPlugin({
			path: `../build/${versionNumber}/`,
			filename: `opendyslexic-${targetBrowser}-${versionNumber}.zip`,
			include: [
				/\.js$/,
				/\.json$/,
				/\.css$/,
				/\.html$/,
				/\.otf$/,
				/\.png$/,
				/\.jpg$/,
				/\.jpeg$/,
				/\.gif$/
			]
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
