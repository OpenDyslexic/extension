const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const manifestLocation = getManifestLocation(process.env.browser);
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
				test: /\.vue$/,
				loader: 'vue-loader',
				options: {
					esModule: true
				}
			},
			{
				// `import x from './foo.css?raw'` yields the stylesheet as a
				// string, for the content script to inject into the page.
				test: /\.css$/,
				resourceQuery: /raw/,
				type: 'asset/source'
			},
			{
				test: /\.css$/,
				resourceQuery: { not: [/raw/] },
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
		new VueLoaderPlugin(),
		new CopyPlugin({
			patterns: [
				{
					context: path.resolve(__dirname, 'config'),

					from: manifestLocation,
					to: `${path.resolve(__dirname, 'dist')}/manifest.json`
				},
				{
					from: './assets/fonts/',
					to: path.resolve(__dirname, 'dist/assets/fonts/')
				},

				{
					from: './assets/styles/',
					to: path.resolve(__dirname, 'dist/assets/css/')
				},
				{
					from: './_locales/',
					to: path.resolve(__dirname, 'dist/_locales/')
				},
				{
					from: './assets/images/',
					to: path.resolve(__dirname, 'dist/assets/images/')
				},
				{
					from: 'index.html',
					to: path.resolve(__dirname, 'dist/')
				}
			]
		}),

		new ZipPlugin({
			path: `../build/${process.env.browser}/${versionNumber}/`,
			filename: `opendyslexic-${process.env.browser}-${versionNumber}.zip`,
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

	// The packaged .zip is the release artefact, not something a browser loads,
	// so exclude it from webpack's asset-size hints. Real bundles are still checked.
	performance: {
		assetFilter: (filename) => !filename.endsWith('.zip')
	},

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
