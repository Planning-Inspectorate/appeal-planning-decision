const sharedConfig = require('../../jest.config.js');

module.exports = {
	...sharedConfig,
	collectCoverageFrom: ['./src/**/*.js'],
	coveragePathIgnorePatterns: ['node_modules', '<rootDir>/src/app.js', '<rootDir>/src/server.js'],
	setupFiles: ['<rootDir>/__tests__/setup-jest.js']
};
