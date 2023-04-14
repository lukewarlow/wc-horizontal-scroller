const { scrollbarWidth } = require('tailwind-scrollbar-utilities');

module.exports = {
	content: [
		'./src/**/*.ts',
	],
	corePlugins: {
		preflight: true,
	},
	plugins: [
		scrollbarWidth()
	]
};
