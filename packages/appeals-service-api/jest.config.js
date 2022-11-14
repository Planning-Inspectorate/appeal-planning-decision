const sharedConfig = require('../../jest.config.js');

module.exports = {
	...sharedConfig,
	collectCoverageFrom: ['./src/**/*.js'],
	coveragePathIgnorePatterns: [
		'node_modules',
		'<rootDir>/src/app.js',
		'<rootDir>/src/main.js',
		'<rootDir>/src/server.js'
	],
	globalSetup: '<rootDir>/__tests__/developer/globalSetup.ts',
	globalTeardown: '<rootDir>/__tests__/developer/globalTeardown.ts',
	preset: '@shelf/jest-mongodb',
	setupFiles: ['<rootDir>/__tests__/setup-jest.js'],
	roots: ['<rootDir>/__tests__/developer/'],
	transform: {
		'^.+\\.ts?$': 'ts-jest',
		'\\.[jt]sx?$': 'babel-jest'
	}
};
