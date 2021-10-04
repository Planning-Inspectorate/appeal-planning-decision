const pino = require('pino');
const logger = require('./logger');
const config = require('../config');

jest.mock('pino', () =>
  jest.fn().mockReturnValue({
    info: jest.fn(),
  })
);

describe('lib/logger', () => {
  it('should call pino with the correct params', () => {
    logger.info('Generating pdf');

    expect(pino).toBeCalledTimes(1);
    expect(pino).toBeCalledWith({
      level: config.logger.level,
    });
  });
});
