const { MongoRepository } = require('./mongo-repository');

/**
 * @typedef {import('@pins/common/schema/documentMetadata.js').DocumentMetadata} DocumentMetadata
 * @typedef {import('@pins/common/schema/documentMetadata.js').DocumentType} DocumentType
 * @typedef {import('./mongo-repository').UpdateResult} UpdateResult
 */

class DocumentMetadataRepository extends MongoRepository {
	constructor() {
		super('documentMetadata');
	}

	/**
	 *
	 * @param {string} caseRef
	 * @param {DocumentType} documentType
	 * @return {Promise<Array.<DocumentMetadata>|DocumentMetadata|undefined>}
	 */
	async getDocumentMetadata(caseRef, documentType, returnMultipleDocuments) {
		if (returnMultipleDocuments) {
			try {
				return await this.getAllDocumentsThatMatchQuery(
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
		} else {
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

	/**
	 * Upsert document metadata
	 * @param {DocumentMetadata} documentMetadata
	 * @returns {Promise<UpdateResult>}
	 */
	async createUpdateDocumentMetadata(documentMetadata) {
		const filter = {
			caseRef: `${documentMetadata.caseRef}`,
			documentId: `${documentMetadata.documentId}`
		};

		return await this.updateOne(filter, {
			$set: documentMetadata
		});
	}
}

module.exports = { DocumentMetadataRepository };
