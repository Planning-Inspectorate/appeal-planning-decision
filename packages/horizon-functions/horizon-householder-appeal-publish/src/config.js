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
    create_contact: {
      url: process.env.AZURE_CREATE_CONTACT_FUNCTION_URL,
      key: process.env.AZURE_CREATE_CONTACT_FUNCTION_KEY,
    },
    add_document: {
      url: process.env.AZURE_ADD_DOCUMENT_FUNCTION_URL,
      key: process.env.AZURE_ADD_DOCUMENT_FUNCTION_KEY,
    },
  },
  logger: {
    level: process.env.LOGGER_LEVEL || 'info',
  },
};
