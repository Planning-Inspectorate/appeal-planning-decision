const sharedConfig = require('../../jest.config.js');

module.exports = {
	...sharedConfig,
	collectCoverageFrom: ['./src/**/*.js'],
	coveragePathIgnorePatterns: [
		'node_modules',
		'<rootDir>/src/app.js',
		'<rootDir>/src/main.js',
		'<rootDir>/src/server.js',
		'<rootDir>/src/configuration',
		'<rootDir>/src/routes'
	],
	coverageThreshold: {
		global: {
			branches: 60,
			functions: 60,
			lines: 60,
			statements: 60
		}
	},
	globalSetup: '<rootDir>/test/developer/globalSetup.js',
	globalTeardown: '<rootDir>/test/developer/globalTeardown.js',
	transform: {
		'\\.[jt]sx?$': 'babel-jest'
	}
};
