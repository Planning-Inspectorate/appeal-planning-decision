/**
 * logger
 */

/* Node modules */

/* Third-party modules */
import pino from 'pino';

/* Files */
import config from './config';

export default pino({
  level: config.logger.level,
  redact: config.logger.redact,
  serializers: {
    err: pino.stdSerializers.err,
  },
});
