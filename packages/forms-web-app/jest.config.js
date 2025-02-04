const sharedConfig = require('../../jest.config.js');

module.exports = {
	...sharedConfig,
	clearMocks: true,
	collectCoverageFrom: ['./src/**/*.js'],
	coveragePathIgnorePatterns: [
		'node_modules',
		'<rootDir>/src/app.js',
		'<rootDir>/src/server.js',
		'<rootDir>/src/public'
	],
	coverageThreshold: {
		global: {
			statements: 81,
			branches: 71,
			functions: 69,
			lines: 82
		}
	},
	setupFilesAfterEnv: ['<rootDir>/__tests__/setupTests.js']
};
