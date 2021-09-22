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
  azure: {
    host: process.env.HORIZON_AZURE_HOST_URL,
    functions: {
      contact: process.env.HORIZON_CONTACT_CODE_KEY,
      document: process.env.HORIZON_DOCUMENT_CODE_KEY,
    },
  },
  logger: {
    level: process.env.LOGGER_LEVEL || 'info',
  },
};
