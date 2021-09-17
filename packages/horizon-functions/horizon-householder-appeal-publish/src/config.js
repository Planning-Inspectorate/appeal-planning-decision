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
  openfaas: {
    gatewayUrl: process.env.GATEWAY_URL,
  },
  azure: {
    url: process.env.AZURE_FUNCTION_URL,
  },
  logger: {
    level: process.env.LOGGER_LEVEL || 'info',
  },
};
