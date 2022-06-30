module.exports = {
	preset: '@shelf/jest-mongodb',
	watchPathIgnorePatterns: ['globalConfig'],
	collectCoverage: true,
	collectCoverageFrom: ['./src/**/*.js'],
	coverageReporters: ['json', 'html', 'text', 'text-summary'],
	coveragePathIgnorePatterns: [
		'node_modules',
		'<rootDir>/src/app.js',
		'<rootDir>/src/main.js',
		'<rootDir>/src/server.js'
	],
	moduleFileExtensions: ['js', 'json'],
	testMatch: ['**/?(*.)+(spec|test).js'],
	testEnvironment: 'node',
	setupFiles: ['<rootDir>/__tests__/setup-jest.js'],
	coverageDirectory: '<rootDir>/coverage',
	coverageThreshold: {
		global: {
			branches: 50,
			functions: 50,
			lines: 50,
			statements: 50
		}
	}
};
