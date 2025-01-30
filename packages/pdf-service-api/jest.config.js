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
			statements: 95,
			branches: 95,
			functions: 49,
			lines: 95
		}
	}
};
