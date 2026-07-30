module.exports = {
	testEnvironment: 'jsdom',
	transform: {
		// swc only has to turn the source's ESM into CJS for Jest - the browser
		// bundle needs no transpilation, so webpack ships the source syntax as-is.
		'^.+\\.js$': [
			'@swc/jest',
			{
				jsc: { target: 'es2022' },
				module: { type: 'commonjs' }
			}
		]
	},
	moduleNameMapper: {
		// `?raw` imports resolve to the stylesheet's text, so this must be
		// matched before the alias and bare-css rules below.
		'\\.css\\?raw$': '<rootDir>/tests/__mocks__/cssStringMock.js',
		'^@scripts/(.*)$': '<rootDir>/app/scripts/$1',
		'^@styles/(.*)$': '<rootDir>/app/assets/styles/$1',
		'^@assets/(.*)$': '<rootDir>/app/assets/$1',
		'^@/(.*)$': '<rootDir>/app/$1',
		'\\.css$': '<rootDir>/tests/__mocks__/styleMock.js'
	},
	setupFiles: ['<rootDir>/tests/__mocks__/chromeMock.js'],
	testMatch: ['<rootDir>/tests/**/*.test.js']
};
