export default {
	moduleFileExtensions: ['js', 'json'],
	reporters: ['default', ['jest-junit', { outputDirectory: '<rootDir>/jest-reports' }]],
	roots: ['<rootDir>/src'],
	testEnvironment: 'node',
	testMatch: ['**/?(*.)+(spec|test).js'],
	transform: {}
};
