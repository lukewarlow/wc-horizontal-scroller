const { scrollbarWidth } = require('tailwind-scrollbar-utilities');
const { mediaQueries } = require('tailwind-mq');

module.exports = {
	content: [
		'./src/**/*.ts',
	],
	corePlugins: {
		preflight: true,
	},
	plugins: [
		scrollbarWidth(),
		mediaQueries(),
	]
};
