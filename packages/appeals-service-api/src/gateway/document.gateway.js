const axios = require('axios');
const config = require('../configuration/config');
const logger = require('../lib/logger');

class DocumentApiGateway {
	constructor() {}

	async getDocumentInBase64Encoding(appealId, documentId) {
		logger.debug(
			`Calling '${config.documents.url}/api/v1/${appealId}/${documentId}/file?base64=true' for a document`
		);
		const documentResponse = await axios.get(
			`${config.documents.url}/api/v1/${appealId}/${documentId}/file?base64=true`
		);
		const result = documentResponse.data;
		logger.debug(`Document retrieved: ${result}`);
		return result;
	}
}

module.exports = DocumentApiGateway;
