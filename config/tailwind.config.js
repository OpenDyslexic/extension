module.exports = {
	enabled: true,
	purge: {
		content: ['./app/**/*.html', './app/**/*.{vue,js,ts,jsx,tsx}'],
		enabled: true,
		options: {
			safelist: [/data-theme$/]
		}
	},
	daisyui: {
		styled: true,
		themes: true,
		rtl: false
	},
	theme: {
		extend: { colors: require('daisyui/colors') }
	},
	variants: {
		extend: {}
	},
	plugins: [
		require('daisyui'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/aspect-ratio')
	]
};
