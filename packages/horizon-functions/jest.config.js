const sharedConfig = require('../../jest.config.js');

module.exports = {
	...sharedConfig,
	collectCoverageFrom: ['./src/**/*.js'],
	rootDir: '.',
	setupFiles: ['./horizon-householder-appeal-publish/__setups__/date.js']
};
