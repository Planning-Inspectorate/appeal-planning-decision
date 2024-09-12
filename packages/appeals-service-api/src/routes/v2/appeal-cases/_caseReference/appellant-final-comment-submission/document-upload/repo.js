const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import('@prisma/client').AppellantFinalCommentSubmission} AppellantFinalCommentSubmission
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
	 * Create submission document for given Appellant Final Comment Submission
	 *
	 * @param {string} caseReference
	 * @param {DocumentUploadData} uploadData
	 * @returns {Promise<AppellantFinalCommentSubmission>}
	 */
	async createSubmissionDocument(caseReference, uploadData) {
		const { name, fileName, originalFileName, location, type, id: storageId } = uploadData;

		return await this.dbClient.appellantFinalCommentSubmission.update({
			where: {
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
	 * @param {string} caseReference
	 * @param {string} documentId
	 * @returns {Promise<AppellantFinalCommentSubmission>}
	 */
	async deleteSubmissionDocument(caseReference, documentId) {
		return await this.dbClient.appellantFinalCommentSubmission.update({
			where: {
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
