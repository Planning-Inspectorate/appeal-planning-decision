module.exports = {
  watchPathIgnorePatterns: ['globalConfig'],
  collectCoverage: true,
  collectCoverageFrom: ['./src/**/*.js'],
  coveragePathIgnorePatterns: ['node_modules', '<rootDir>/src/main.js', '<rootDir>/src/server.js'],
  coverageDirectory: '<rootDir>/coverage',
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/?(*.)+(spec|test).js'],
  testEnvironment: 'node',
};
