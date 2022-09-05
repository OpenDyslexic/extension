module.exports = {
	enabled: true,
	content: ['./app/**/*.html', './app/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		screens: {
			xs: { max: '575px' }, // Mobile (iPhone 3 - iPhone XS Max).
			sm: { min: '576px', max: '897px' }, // Mobile (matches max: iPhone 11 Pro Max landscape @ 896px).
			md: { min: '898px', max: '1199px' }, // Tablet (matches max: iPad Pro @ 1112px).
			lg: { min: '1200px' }, // Desktop smallest.
			xl: { min: '1159px' }, // Desktop wide.
			xxl: { min: '1359px' } // Desktop widescreen.
		}
	},
	daisyui: {
		styled: true,
		themes: true,
		base: false,
		utils: true,
		logs: true,
		rtl: false,
		darkTheme: 'dark',
		themes: ['light'],
		rtl: false
	},

	plugins: [require('daisyui')]
};
