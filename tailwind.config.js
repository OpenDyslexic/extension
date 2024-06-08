module.exports = {
	enabled: true,
	content: [
		'./app/**/*.html',
		'./config/**/*.html',
		'./app/**/*.{vue,js,ts,jsx,tsx}'
	],
	theme: {
		extend: {
			colors: {
				'primary-muted': 'oklch(var(--primary-muted) / <alpha-value>)'
			}
		}
	},
	daisyui: {
		styled: true,
		themes: [
			{
				light: {
					...require('daisyui/src/theming/themes')['light'],
					'base-300': '#ffffff',
					'.bg-helperbird': {
						'background-color': '##FF7F50'
					},
					'--primary-muted': '124 58% 237%'
				}
			}
		],
		base: true,
		utils: true,
		logs: true,
		rtl: false,

		darkTheme: 'light',
		themeRoot: '*' // The element that receives theme color CSS variables
	},

	plugins: [require('daisyui')]
};
