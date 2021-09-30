module.exports = {
  watchPathIgnorePatterns: ['globalConfig'],
  collectCoverage: true,
  collectCoverageFrom: ['./src/**/*.js'],
  coveragePathIgnorePatterns: [
    'node_modules',
    '<rootDir>/src/app.js',
    '<rootDir>/src/main.js',
    '<rootDir>/src/server.js',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['json', 'html', 'text', 'text-summary'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/?(*.)+(spec|test).js'],
  testEnvironment: 'node',
};
