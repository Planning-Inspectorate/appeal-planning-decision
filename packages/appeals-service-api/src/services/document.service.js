const DocumentGateway = require('../gateway/document.gateway');
const logger = require('../lib/logger');

class DocumentService {
	#documentGateway;

	constructor() {
		this.#documentGateway = new DocumentGateway();
	}

	async getAppealDocumentsInBase64Encoding(appealId, documentIds) {
		logger.debug(
			`Getting documents with IDs: ${JSON.stringify(
				documentIds
			)} for appeal with ID ${appealId} in base64 encoding`
		);

		let documents = [];
		for (const documentId of documentIds) {
			logger.debug(`Getting document with ID ${documentId} in base64 encoding`);
			const document = await this.#documentGateway.getDocumentInBase64Encoding(
				appealId,
				documentId
			);
			logger.debug(
				`Adding the following documents to the appeal documents in base64 encoding being returned: ${JSON.stringify(
					document
				)}`
			);
		}

		logger.debug(`Documents retrieved in base64 encoding: ${JSON.stringify(documents)}`);
		return documents;
	}
}

module.exports = DocumentService;
