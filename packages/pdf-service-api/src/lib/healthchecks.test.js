jest.mock('@pins/common');

const common = require('@pins/common');
const logger = require('./logger');
const healthchecks = require('./healthchecks');
const config = require('../config');

const {
  server: { terminationGracePeriod },
} = config;

describe('healthchecks', () => {
  it('should configure the health checks', () => {
    const server = jest.fn();

    expect(healthchecks(server)).toBe(undefined);

    expect(common.healthcheck).toBeCalledWith({
      server,
      logger,
      tasks: [],
      terminationGrace: terminationGracePeriod,
    });
  });
});
