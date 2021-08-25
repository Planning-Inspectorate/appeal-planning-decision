module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  coveragePathIgnorePatterns: [
    'node_modules',
    '<rootDir>/src/app.js',
    '<rootDir>/src/server.js',
    '<rootDir>/src/main.js',
  ],
  testMatch: ['**/?(*.)+(spec|test).js'],
  moduleFileExtensions: ['js', 'json'],
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 20,
      lines: 20,
      statements: 20,
    },
  },
};
