const sharedConfig = require('../../jest.config.js');

module.exports = {
	...sharedConfig,
	collectCoverageFrom: ['./src/**/*.js'],
	coveragePathIgnorePatterns: ['node_modules', '<rootDir>/src/app.js', '<rootDir>/src/server.js'],
	coverageThreshold: {
		global: {
			branches: 60,
			functions: 60,
			lines: 60,
			statements: 60
		}
	},
	setupFiles: ['<rootDir>/__tests__/setup-jest.js']
};
