module.exports = {
  appealsService: {
    url: process.env.APPEALS_SERVICE_URL,
  },
  documentService: {
    url: process.env.DOCUMENT_SERVICE_URL,
  },
  horizon: {
    url: process.env.HORIZON_URL,
  },
  amqp: {
    url: process.env.AMQPLIB_URL,
  },
  logger: {
    level: process.env.LOGGER_LEVEL || 'info',
  },
};
