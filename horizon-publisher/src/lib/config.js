module.exports = {
  logger: {
    level: process.env.LOGGER_LEVEL || 'info',
    redact: ['config.queue.connectionString'],
  },
  queue: {
    connectionString: process.env.HORIZON_QUEUE_CONNECTION_STRING,
    delay: Number(process.env.HORIZON_QUEUE_DELAY || 5000),
    name: 'horizon',
  },
};
