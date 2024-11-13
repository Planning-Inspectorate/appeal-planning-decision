const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import('@prisma/client').Rule6StatementSubmission} Rule6StatementSubmission
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
	 * Create submission document for given Rule 6 Party Statement Submission
	 *
	 * @param {string} userId
	 * @param {string} caseReference
	 * @param {DocumentUploadData} uploadData
	 * @returns {Promise<Rule6StatementSubmission>}
	 */
	async createSubmissionDocument(userId, caseReference, uploadData) {
		const { name, fileName, originalFileName, location, type, id: storageId } = uploadData;

		return await this.dbClient.rule6StatementSubmission.update({
			where: {
				userId,
				caseReference: caseReference
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
				AppealCase: {
					select: {
						LPACode: true
					}
				},
				SubmissionDocumentUpload: true
			}
		});
	}

	/**
	 * Delete submission document
	 *
	 * @param {string} userId
	 * @param {string} caseReference
	 * @param {string} documentId
	 * @returns {Promise<Rule6StatementSubmission>}
	 */
	async deleteSubmissionDocument(userId, caseReference, documentId) {
		return await this.dbClient.rule6StatementSubmission.update({
			where: {
				userId,
				caseReference: caseReference
			},
			data: {
				SubmissionDocumentUpload: {
					delete: {
						id: documentId
					}
				}
			},
			include: {
				AppealCase: {
					select: {
						LPACode: true
					}
				},
				SubmissionDocumentUpload: true
			}
		});
	}
}

module.exports = { SubmissionDocumentUploadRepository };
