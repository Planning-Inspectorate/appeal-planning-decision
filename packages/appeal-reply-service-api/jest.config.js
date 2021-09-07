module.exports = {
  preset: '@shelf/jest-mongodb',
  watchPathIgnorePatterns: ['globalConfig'],
  collectCoverage: true,
  collectCoverageFrom: ['./src/**/*.js'],
  coveragePathIgnorePatterns: ['node_modules', '<rootDir>/src/app.js', '<rootDir>/src/server.js'],
  coverageDirectory: '<rootDir>/coverage',
  coverageThreshold: {
    global: {
      branches: 30,
      functions: 30,
      lines: 30,
      statements: 30,
    },
  },
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/?(*.)+(spec|test).js'],
  testEnvironment: 'node',
};
