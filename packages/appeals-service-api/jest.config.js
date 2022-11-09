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
	coverageThreshold: {
		global: {
			branches: 50,
			functions: 50,
			lines: 50,
			statements: 50
		}
	},
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
