process.env.TZ = 'GMT';

module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setupTests.js'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageReporters: ['json', 'html', 'text', 'text-summary'],
  coveragePathIgnorePatterns: ['node_modules', 'src/public/javascripts'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleDirectories: ['node_modules', 'src'],
};
