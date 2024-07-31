const { DocumentsApiClient } = require('@pins/common/src/client/documents-api-client');
const config = require('../configuration/config');

const docsApiClient = new DocumentsApiClient(config.documents.url, {}, config.documents.timeout);

module.exports = {
	docsApiClient
};
