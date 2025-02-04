const sharedConfig = require('../../jest.config.js');

module.exports = {
	...sharedConfig,
	collectCoverageFrom: ['./src/**/*.js'],
	coveragePathIgnorePatterns: ['node_modules'],
	coverageThreshold: {
		global: {
			statements: 90,
			branches: 81,
			functions: 79,
			lines: 90
		}
	}
};
