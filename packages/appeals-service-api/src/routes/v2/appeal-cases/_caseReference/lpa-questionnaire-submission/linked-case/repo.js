const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import('@prisma/client').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import('@prisma/client').Prisma.SubmissionLinkedCaseCreateInput} LinkedCaseData
 */

class LinkedCaseRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Create submission address for a given questionnaire
	 *
	 * @param {string} caseReference
	 * @param {LinkedCaseData} linkedCase
	 * @returns {Promise<LPAQuestionnaireSubmission>}
	 */
	async createLinkedCase(caseReference, linkedCase) {
		return await this.dbClient.lPAQuestionnaireSubmission.update({
			where: {
				appealCaseReference: caseReference
			},
			data: {
				SubmissionLinkedCase: {
					create: {
						...linkedCase
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
				SubmissionLinkedCase: true
			}
		});
	}

	/**
	 * Delete address
	 *
	 * @param {string} caseReference
	 * @param {string} linkedCaseId
	 * @returns {Promise<LPAQuestionnaireSubmission>}
	 */
	async deleteLinkedCase(caseReference, linkedCaseId) {
		return await this.dbClient.lPAQuestionnaireSubmission.update({
			where: {
				appealCaseReference: caseReference
			},
			data: {
				SubmissionLinkedCase: {
					delete: {
						id: linkedCaseId
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
				SubmissionLinkedCase: true
			}
		});
	}
}

module.exports = { LinkedCaseRepository };
