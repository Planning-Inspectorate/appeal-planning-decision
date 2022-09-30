const sharedConfig = require('../../jest.config.js');

module.exports = {
	...sharedConfig,
	collectCoverageFrom: ['./src/**/*.js'],
	coveragePathIgnorePatterns: ['node_modules', '<rootDir>/src/main.js', '<rootDir>/src/server.js'],
	coverageThreshold: {
		global: {
			branches: 60,
			functions: 60,
			lines: 60,
			statements: 60
		}
	},
	roots: ['<rootDir>/test/developer/'],
	globalSetup: '<rootDir>/test/developer/globalSetup.ts',
	globalTeardown: '<rootDir>/test/developer/globalTeardown.ts',
	transform: {
		'^.+\\.ts?$': 'ts-jest',
		'\\.[jt]sx?$': 'babel-jest'
	}
};
