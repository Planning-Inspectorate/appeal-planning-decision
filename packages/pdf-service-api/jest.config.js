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
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
