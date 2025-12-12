export default {
	globalSetup: '<rootDir>/__tests__/globalSetup.js',
	globalTeardown: '<rootDir>/__tests__/globalTeardown.js',
	moduleFileExtensions: ['js', 'ts', 'json'],
	reporters: ['default', ['jest-junit', { outputDirectory: '<rootDir>/jest-reports' }]],
	coverageReporters: ['cobertura', 'json', 'html', 'text', 'text-summary'],
	roots: ['<rootDir>/'],
	setupFiles: ['<rootDir>/__tests__/setup-jest.js'],
	testEnvironment: 'node',
	testMatch: ['**/?(*.)+(spec|test).(js|ts)'],
	transform: {
		'^.+\\.ts$': ['ts-jest', { useESM: true }]
	},
	collectCoverageFrom: ['./src/**/*.(js|ts)'],
	extensionsToTreatAsEsm: ['.ts'],
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
