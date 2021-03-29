/**
 * app
 */

/* Must be first included package */
import './pinoDebug';

/* Node modules */

/* Third-party modules */

/* Files */
import AMQP from './amqp';
import config from './config';
import health from './health';
import logger from './logger';
import OpenFaaS from './openfaas';

async function main() {
  logger.info({ config }, 'Starting connector');

  if (config.amqp.response.sendReply && config.openfaas.async) {
    throw new Error('Cannot send reply to message queue if OpenFaaS is in async-mode');
  }

  const openfaas = new OpenFaaS(config.openfaas, logger);

  const amqp = new AMQP(config.amqp, logger, openfaas);

  health(config.health, logger, amqp);
}

main().catch((err) => {
  logger.fatal({ err }, 'Unable to start application');
  process.exit();
});
