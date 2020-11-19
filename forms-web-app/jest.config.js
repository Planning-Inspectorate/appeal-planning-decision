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
      branches: 85,
      functions: 88,
      lines: 84,
      statements: 84,
    },
  },
};
