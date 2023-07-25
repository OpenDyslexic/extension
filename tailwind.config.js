module.exports = {
	enabled: true,
	content: ['./app/**/*.{vue,html}', './assets/**/*.{vue,js,ts,jsx,tsx}'],

	daisyui: {
		styled: true,
		themes: false,
		base: true,
		utils: true,
		logs: true,
		rtl: false,

		darkTheme: 'light'
	},

	plugins: [require('daisyui')]
};
