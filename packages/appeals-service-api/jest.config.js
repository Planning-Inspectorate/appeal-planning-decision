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
	// to improve
	coverageThreshold: {
		global: {
			branches: 36.65,
			functions: 11.6,
			lines: 34.08,
			statements: 33.92
		}
	},
	setupFiles: ['<rootDir>/__tests__/setup-jest.js'],
	roots: ['<rootDir>/__tests__/unit/'],
	transform: {
		'\\.[jt]sx?$': 'babel-jest'
	}
};
