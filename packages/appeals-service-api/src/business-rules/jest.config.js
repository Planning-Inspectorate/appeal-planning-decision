const sharedConfig = require('../../jest.config.js');

module.exports = {
	...sharedConfig,
	clearMocks: true,
	collectCoverageFrom: ['./src/**/*.js'],
	coverageThreshold: {
		global: {
			branches: 80,
			functions: 80,
			lines: 80,
			statements: 80
		}
	}
};
