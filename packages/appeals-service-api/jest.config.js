const sharedConfig = require('../../jest.config.js');

module.exports = {
	...sharedConfig,
	collectCoverageFrom: ['./src/**/*.js'],
	coveragePathIgnorePatterns: [
		'node_modules',
		'<rootDir>/src/app.js',
		'<rootDir>/src/main.ts',
		'<rootDir>/src/server.js',
		'<rootDir>/src/.*\\.spec\\.js$',
		'<rootDir>/src/.*\\.test\\.js$'
	],
	// to improve
	coverageThreshold: {
		global: {
			statements: 50.0,
			branches: 29.5,
			functions: 42.0,
			lines: 50.0
		}
	},
	globalSetup: '<rootDir>/__tests__/developer/globalSetup.js',
	globalTeardown: '<rootDir>/__tests__/developer/globalTeardown.js',
	preset: '@shelf/jest-mongodb',
	setupFiles: ['<rootDir>/__tests__/setup-jest.js'],
	roots: ['<rootDir>/__tests__/developer/', '<rootDir>/__tests__/unit/', '<rootDir>/src/'],
	testMatch: [
		'**/__tests__/unit/**/*.test.js',
		'**/__tests__/developer/**/*.test.js',
		'**/src/**/*.test.js'
	],
	transform: {
		'\\.[jt]sx?$': 'babel-jest'
	}
};
