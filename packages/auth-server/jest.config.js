export default {
	globalSetup: '<rootDir>/__tests__/globalSetup.js',
	globalTeardown: '<rootDir>/__tests__/globalTeardown.js',
	moduleFileExtensions: ['js', 'json'],
	reporters: ['default', ['jest-junit', { outputDirectory: '<rootDir>/jest-reports' }]],
	coverageReporters: ['cobertura', 'json', 'html', 'text', 'text-summary'],
	roots: ['<rootDir>/'],
	setupFiles: ['<rootDir>/__tests__/setup-jest.js'],
	testEnvironment: 'node',
	testMatch: ['**/?(*.)+(spec|test).js'],
	transform: {},
	collectCoverageFrom: ['./src/**/*.js'],
	coverageThreshold: {
		global: {
			statements: 77,
			branches: 66,
			functions: 72,
			lines: 72
		}
	},
	testEnvironmentOptions: {
		globalsCleanup: 'on'
	}
};
