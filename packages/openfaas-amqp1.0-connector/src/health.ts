/**
 * health
 */

/* Node modules */

/* Third-party modules */
import * as express from 'express';
import { Logger } from 'pino';

/* Files */
import { IAMQP, IHealthConfig } from './interfaces';

export default (config: IHealthConfig, logger: Logger, amqp: IAMQP) => {
  const app = express();

  app.get('/health', (req, res) => {
    const status = amqp.connectionStatus();

    const services = Object.keys(status).map((name) => ({
      name,
      isHealthy: status[name],
    }));
    const isHealthy = services.every((item) => item.isHealthy);

    logger.debug({ isHealthy, status }, 'Check health of AMQP service');

    if (!isHealthy) {
      res.status(503);
      logger.warn({ services }, 'Service is unhealthy');
    }

    res.send({
      status: isHealthy ? 'ok' : 'error',
      services,
    });
  });

  app.listen(config.port, () => {
    logger.info('Health checks listening');
  });
};
