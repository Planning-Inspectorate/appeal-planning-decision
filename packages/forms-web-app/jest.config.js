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
			branches: 69.72,
			functions: 60,
			lines: 80,
			statements: 80
		}
	},
	setupFilesAfterEnv: ['<rootDir>/__tests__/setupTests.js']
};
