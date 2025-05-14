const sharedConfig = require('../../jest.config.js');

module.exports = {
	...sharedConfig,
	clearMocks: true,
	collectCoverageFrom: ['./src/**/*.js'],
	coveragePathIgnorePatterns: [
		'node_modules',
		'<rootDir>/src/app.js',
		'<rootDir>/src/server.js',
		'<rootDir>/src/public',
		'packages/forms-web-app/src/dynamic-forms/s78-questionnaire/journey.js',
		'packages/forms-web-app/src/dynamic-forms/s20-lpa-questionnaire/journey.js'
	],
	coverageThreshold: {
		global: {
			statements: 81,
			branches: 71,
			functions: 69,
			lines: 82
		}
	},
	setupFilesAfterEnv: ['<rootDir>/__tests__/setupTests.js'],
	moduleNameMapper: {
		'^@pins/common(.*)$': '<rootDir>/../common$1',
		'^@pins/business-rules(.*)$': '<rootDir>/../business-rules$1'
	}
};
