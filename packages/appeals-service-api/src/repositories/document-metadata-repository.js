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
	async getDocumentMetadata(caseRef, documentType) {
		try {
			return await this.findOneByQuery(
				{
					caseRef: caseRef,
					documentType: documentType,
					virusCheckStatus: 'scanned',
					redactedStatus: 'redacted',
					publishedStatus: 'published'
				},
				{
					version: -1
				}
			);
		} catch (e) {
			console.log(e);
		}
	}
}

module.exports = { DocumentMetadataRepository };
