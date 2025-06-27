const DocumentGateway = require('../gateway/document.gateway');
const logger = require('../lib/logger');

class DocumentService {
	#documentGateway;

	constructor() {
		this.#documentGateway = new DocumentGateway();
	}

	async getAppealDocumentInBase64Encoding(appealId, documentId) {
		logger.debug(
			`Getting document with ID ${documentId} for the appeal with ID ${appealId} in base64 encoding`
		);
		return await this.#documentGateway.getDocumentInBase64Encoding(appealId, documentId);
	}
}

module.exports = DocumentService;
