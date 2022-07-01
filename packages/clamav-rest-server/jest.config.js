const sharedConfig = require('../../jest.config.js');

module.exports = {
	...sharedConfig,
	collectCoverageFrom: ['./src/**/*.js'],
	coveragePathIgnorePatterns: ['node_modules', '<rootDir>/src/app.js', '<rootDir>/src/server.js'],
	coverageThreshold: {
		global: {
			branches: 50,
			functions: 20,
			lines: 50,
			statements: 50
		}
	},
	setupFiles: ['<rootDir>/__tests__/setup-jest.js']
};
