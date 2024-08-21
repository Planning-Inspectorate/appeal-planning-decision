const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import('@prisma/client').LPAStatementSubmission} LPAStatementSubmission
 */

/**
 * @typedef {Object} DocumentUploadData
 * @property {string} id
 * @property {string} name
 * @property {string} fileName
 * @property {string} originalFileName
 * @property {string} location
 * @property {string} type
 */

class SubmissionDocumentUploadRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Create submission document for given LPA statement
	 *
	 * @param {string} id
	 * @param {DocumentUploadData} uploadData
	 * @returns {Promise<LPAStatementSubmission>}
	 */
	async createSubmissionDocument(id, uploadData) {
		const { name, fileName, originalFileName, location, type, id: storageId } = uploadData;

		return await this.dbClient.lPAStatementSubmission.update({
			where: {
				id
			},
			data: {
				SubmissionDocumentUpload: {
					create: {
						name,
						fileName,
						originalFileName,
						location,
						type,
						storageId
					}
				}
			},
			include: {
				SubmissionDocumentUpload: true
			}
		});
	}

	/**
	 * Delete submission document
	 *
	 * @param {string} id
	 * @param {string} documentId
	 * @returns {Promise<LPAStatementSubmission>}
	 */
	async deleteSubmissionDocument(id, documentId) {
		return await this.dbClient.lPAStatementSubmission.update({
			where: {
				id
			},
			data: {
				SubmissionDocumentUpload: {
					delete: {
						id: documentId
					}
				}
			},
			include: {
				SubmissionDocumentUpload: true
			}
		});
	}
}

module.exports = { SubmissionDocumentUploadRepository };
