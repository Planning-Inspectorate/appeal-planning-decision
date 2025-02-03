const sharedConfig = require('../../jest.config.js');

module.exports = {
	...sharedConfig,
	clearMocks: true,
	collectCoverageFrom: ['./src/**/*.js'],
	coverageThreshold: {
		global: {
			statements: 90,
			branches: 75,
			functions: 90,
			lines: 90
		}
	}
};
