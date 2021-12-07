const axios = require('axios');
const express = require('express');
const logger = require('pino')();
const promClient = require('prom-client');
const uuid = require('uuid');

const { register } = promClient;

const config = {
  metrics: {
    appName: process.env.APP_NAME,
    buildId: process.env.BUILD_ID,
    version: process.env.VERSION,
  },
  ping: {
    // Axios Config object
    method: process.env.PING_METHOD || 'get',
    timeout: Number(process.env.PING_TIMEOUT || 10000),
    url: process.env.PING_URL,
  },
  server: {
    port: Number(process.env.SERVER_PORT || 3000),
  },
};

const metrics = {
  healthGauge: new promClient.Gauge({
    name: 'application_health',
    help: 'Health status - 1 healthy, 0 unhealthy',
  }),
  incomingRequests: new promClient.Counter({
    name: 'incoming_request',
    help: 'Counts number of requests received',
  }),
  requestTimes: new promClient.Histogram({
    name: 'request_times',
    help: 'Time ',
    buckets: [0.1, 0.5, 1, 2, 5, 10],
  }),
};

register.setDefaultLabels({
  service: config.metrics.appName,
  buildId: config.metrics.buildId,
  version: config.metrics.version,
});

const app = express();

app
  .get('/metrics', async (req, res) => {
    res.setHeader('content-type', 'text/plain');
    res.send(await register.metrics());
  })
  .get('/ping', async (req, res) => {
    const end = metrics.requestTimes.startTimer();
    metrics.incomingRequests.inc();

    const log = logger.child({ uuid: uuid.v4() });
    log.info({ url: config.ping.url }, 'Pinging');

    try {
      const { status } = await axios(config.ping);

      log.info({ status }, 'Ping successful');
      metrics.healthGauge.set(1);

      res.send('Connected');
    } catch (err) {
      log.error({ err }, 'Ping failed');
      metrics.healthGauge.set(0);
      res.send('Failed');
    }

    /* Stop the request timer */
    end();
  });

app.listen(config.server.port, () => {
  logger.info({ config }, 'Service listening');
});
