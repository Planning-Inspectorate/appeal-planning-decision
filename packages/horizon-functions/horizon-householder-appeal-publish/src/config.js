module.exports = {
  sqlServer: {
    username: process.env.SQLSERVER_USERNAME,
    password: process.env.SQLSERVER_PASSWORD,
    database: process.env.SQLSERVER_DATABASE,
    server: process.env.SQLSERVER_NAME,
    port: process.env.SQLSERVER_PORT,
  },
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
