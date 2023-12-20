const sharedConfig = require('../../jest.config.js');

module.exports = {
	...sharedConfig,
	clearMocks: true,
	collectCoverageFrom: ['./src/**/*.js'],
	coverageThreshold: {
		global: {
			branches: 96,
			functions: 100,
			lines: 97,
			statements: 97
		}
	},
	setupFilesAfterEnv: ['<rootDir>/setupTests.js']
};
