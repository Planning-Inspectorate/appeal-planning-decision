module.exports = {
  preset: '@shelf/jest-mongodb',
  watchPathIgnorePatterns: ['globalConfig'],
  collectCoverage: true,
  collectCoverageFrom: ['./src/**/*.js'],
  coverageReporters: ['json', 'html', 'text', 'text-summary'],
  coveragePathIgnorePatterns: [
    'node_modules',
    '<rootDir>/src/app.js',
    '<rootDir>/src/main.js',
    '<rootDir>/src/server.js',
  ],
  coverageDirectory: '../coverage',
  coverageThreshold: {
    global: {
      branches: 92,
      functions: 87,
      lines: 86,
      statements: 86,
    },
  },
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/?(*.)+(spec|test).js?(x)'],
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/tests/setup-jest.js'],
};
