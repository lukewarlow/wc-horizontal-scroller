const plugin = require('tailwindcss/plugin');

module.exports = {
	content: [
		'./src/**/*.ts',
	],
	corePlugins: {
		preflight: true,
	},
	plugins: [
		plugin(function({ addUtilities }) {
			addUtilities([
				{
					'.scrollbar-auto': {
						'scrollbar-width': 'auto',
					},
					'.scrollbar-none': {
						'scrollbar-width': 'none',
						'&::-webkit-scrollbar': {
							'display': 'none'
						}
					},
					'.scrollbar-thin': {
						'scrollbar-width': 'thin'
					},
				}
			])
		}),
	]
};
