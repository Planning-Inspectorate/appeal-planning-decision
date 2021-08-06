process.env.TZ = 'GMT';

module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./__tests__/setupTests.js'],
  collectCoverage: true,
  collectCoverageFrom: ['./src/**/*.js'],
  coveragePathIgnorePatterns: [
    'node_modules',
    '<rootDir>/src/app.js',
    '<rootDir>/src/server.js',
    '<rootDir>/src/public',
  ],
  testMatch: ['**/?(*.)+(spec|test).js'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
