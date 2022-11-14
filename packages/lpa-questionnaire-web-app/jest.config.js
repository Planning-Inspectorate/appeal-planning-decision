process.env.TZ = 'GMT';

module.exports = {
	clearMocks: true,
	testEnvironment: 'node',
	setupFiles: ['./__tests__/setupTests.js'],
	collectCoverage: true,
	collectCoverageFrom: ['./src/**/*.js'],
	coveragePathIgnorePatterns: ['node_modules', '<rootDir>/src/app.js', '<rootDir>/src/server.js'],
	moduleFileExtensions: ['js', 'json'],
	testMatch: ['**/?(*.)+(spec|test).js']
};
