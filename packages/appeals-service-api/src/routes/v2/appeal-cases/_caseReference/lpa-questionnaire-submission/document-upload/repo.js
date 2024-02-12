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
		const { name, fileName, originalFileName, location, type } = uploadData;

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
						type
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
				SubmissionNeighbourAddress: true
			}
		});
	}
}

module.exports = { SubmissionDocumentUploadRepository };
