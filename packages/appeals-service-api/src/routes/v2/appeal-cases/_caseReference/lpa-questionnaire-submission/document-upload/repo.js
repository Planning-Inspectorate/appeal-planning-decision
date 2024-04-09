const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import('@prisma/client').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 */

/**
 * @typedef {Object} DocumentUploadData
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
	 * Create submission document for given questionnaire
	 *
	 * @param {string} caseReference
	 * @param {DocumentUploadData} uploadData
	 * @returns {Promise<LPAQuestionnaireSubmission>}
	 */
	async createSubmissionDocument(caseReference, uploadData) {
		const { name, fileName, originalFileName, location, type, id } = uploadData;

		return await this.dbClient.lPAQuestionnaireSubmission.update({
			where: {
				appealCaseReference: caseReference
			},
			data: {
				SubmissionDocumentUpload: {
					create: {
						name,
						fileName,
						originalFileName,
						location,
						type,
						storageId: id
					}
				}
			},
			include: {
				AppealCase: {
					select: {
						LPACode: true
					}
				},
				SubmissionDocumentUpload: true,
				SubmissionAddress: true
			}
		});
	}

	/**
	 * Delete submission document
	 *
	 * @param {string} caseReference
	 * @param {string} documentId
	 * @returns {Promise<LPAQuestionnaireSubmission>}
	 */
	async deleteSubmissionDocument(caseReference, documentId) {
		return await this.dbClient.lPAQuestionnaireSubmission.update({
			where: {
				appealCaseReference: caseReference
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
				SubmissionDocumentUpload: true,
				SubmissionAddress: true
			}
		});
	}
}

module.exports = { SubmissionDocumentUploadRepository };
