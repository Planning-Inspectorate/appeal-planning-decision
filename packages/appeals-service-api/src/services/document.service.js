const DocumentGateway = require('../gateway/document.gateway');
const logger = require('../lib/logger');

class DocumentService {
	#documentGateway;

	constructor() {
		this.#documentGateway = new DocumentGateway();
	}

	async getAppealDocumentsInBase64Encoding(appealId, documentIds) {

		let documents = [];
		for (const documentId of documentIds) {
			logger.debug(`Getting document with ID ${documentId} for the appeal with ID ${appealId} in base64 encoding`);
			const document = await this.#documentGateway.getDocumentInBase64Encoding(
				appealId,
				documentId
			);
			documents.push(document);
		}

		logger.debug(documents, `Documents retrieved in base64 encoding`);
		return documents;
	}
}

module.exports = DocumentService;
