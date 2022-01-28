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
    create_contact: {
      url: process.env.AZURE_CREATE_CONTACT_FUNCTION_URL,
      key: process.env.AZURE_CREATE_CONTACT_FUNCTION_KEY,
    },
    add_document: {
      url: process.env.AZURE_ADD_DOCUMENT_FUNCTION_URL,
      key: process.env.AZURE_ADD_DOCUMENT_FUNCTION_KEY,
    },
  },
};
