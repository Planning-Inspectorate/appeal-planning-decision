const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import('@pins/database/src/client/client').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
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
	 * @param {DocumentUploadData[]} uploadData
	 * @returns {Promise<LPAQuestionnaireSubmission>}
	 */
	async createSubmissionDocument(caseReference, uploadData) {
		const mappedUploadData = uploadData.map((file) => ({
			name: file.name,
			fileName: file.fileName,
			originalFileName: file.originalFileName,
			location: file.location,
			type: file.type,
			storageId: file.id
		}));

		return await this.dbClient.lPAQuestionnaireSubmission.update({
			where: {
				appealCaseReference: caseReference
			},
			data: {
				SubmissionDocumentUpload: {
					createMany: {
						data: mappedUploadData
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
				SubmissionAddress: true,
				SubmissionLinkedCase: true,
				SubmissionListedBuilding: true
			}
		});
	}

	/**
	 * Delete submission document
	 *
	 * @param {string} caseReference
	 * @param {string[]} documentIds
	 * @returns {Promise<LPAQuestionnaireSubmission>}
	 */
	async deleteSubmissionDocument(caseReference, documentIds) {
		return await this.dbClient.lPAQuestionnaireSubmission.update({
			where: {
				appealCaseReference: caseReference
			},
			data: {
				SubmissionDocumentUpload: {
					deleteMany: {
						id: { in: documentIds }
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
				SubmissionAddress: true,
				SubmissionLinkedCase: true,
				SubmissionListedBuilding: true
			}
		});
	}
}

module.exports = { SubmissionDocumentUploadRepository };
