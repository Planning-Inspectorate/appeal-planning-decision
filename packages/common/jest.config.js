const sharedConfig = require('../../jest.config.js');

module.exports = {
	...sharedConfig,
	clearMocks: true,
	collectCoverageFrom: ['./src/**/*.js'],
	coverageThreshold: {
		global: {
			statements: 38,
			branches: 42,
			functions: 29,
			lines: 38
		}
	},
	setupFilesAfterEnv: ['<rootDir>/setupTests.js']
};
