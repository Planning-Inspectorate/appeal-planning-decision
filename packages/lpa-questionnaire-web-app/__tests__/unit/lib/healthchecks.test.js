jest.mock('@pins/common');

const common = require('@pins/common');
const logger = require('../../../src/lib/logger');
const healthchecks = require('../../../src/lib/healthchecks');

describe('healthchecks', () => {
  it('should configure the health checks', () => {
    const server = jest.fn();

    expect(healthchecks(server)).toBe(undefined);

    expect(common.healthcheck).toBeCalledWith({
      server,
      logger,
      tasks: [],
    });
  });
});
