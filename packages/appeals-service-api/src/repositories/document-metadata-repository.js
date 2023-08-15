const { MongoRepository } = require('./mongo-repository');

class DocumentMetadataRepository extends MongoRepository {
	constructor() {
		super('documentMetadata');
	}
	/**
	 * @typedef {'Supporting Documents' | 'Appeal Statement' | 'Planning application form' | 'Decision notice'} DocumentType
	 */

	/**
	 *
	 * @param {string} caseRef
	 * @param {DocumentType} documentType
	 * @return {Promise<any>}
	 */
	async getDocumentMetadata(caseRef, documentType, returnMultipleDocuments) {
		const query = {
			caseRef: caseRef,
			documentType: documentType,
			virusCheckStatus: 'scanned',
			redactedStatus: 'redacted',
			publishedStatus: 'published'
		};
		const version = {
			version: -1
		};

		if (returnMultipleDocuments) {
			try {
				return await this.getAllDocumentsThatMatchQuery(query, version);
			} catch (e) {
				console.log(e);
			}
		} else {
			try {
				return await this.findOneByQuery(query, version);
			} catch (e) {
				console.log(e);
			}
		}
	}
}

module.exports = { DocumentMetadataRepository };
