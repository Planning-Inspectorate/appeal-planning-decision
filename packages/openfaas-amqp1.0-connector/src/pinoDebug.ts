/**
 * pinoDebug
 *
 * Maps Debug into Pino. Annoyingly, the Rhea library still
 * uses console for some things
 */

/* Node modules */

/* Third-party modules */
import * as pinoDebug from 'pino-debug';

/* Files */
import logger from './logger';

pinoDebug(logger, {
  auto: true,
  map: {
    'rhea:*': 'debug',
    '*': 'trace',
  },
});
