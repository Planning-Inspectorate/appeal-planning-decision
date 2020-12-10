process.env.TZ = 'GMT';

module.exports = {
  clearMocks: true,
  testEnvironment: 'node',
  setupFiles: ['./tests/setupTests.js'],
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.js'],
  coverageReporters: ['json', 'html', 'text', 'text-summary'],
  coverageThreshold: {
    global: {
      branches: 93,
      functions: 92,
      lines: 90,
      statements: 90,
    },
  },
};
