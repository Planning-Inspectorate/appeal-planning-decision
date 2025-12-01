const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import('@pins/database/src/client').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import('@pins/database/src/client').Prisma.SubmissionLinkedCaseCreateInput} LinkedCaseData
 */

class LinkedCaseRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Create submission address for a given questionnaire
	 *
	 * @param {string} id
	 * @param {LinkedCaseData} linkedCase
	 * @returns {Promise<LPAQuestionnaireSubmission>}
	 */
	async createLinkedCase(id, linkedCase) {
		return await this.dbClient.appellantSubmission.update({
			where: {
				id
			},
			data: {
				SubmissionLinkedCase: {
					create: {
						...linkedCase
					}
				}
			},
			include: {
				SubmissionDocumentUpload: true,
				SubmissionAddress: true,
				SubmissionLinkedCase: true
			}
		});
	}

	/**
	 * Delete address
	 *
	 * @param {string} id
	 * @param {string} linkedCaseId
	 * @returns {Promise<LPAQuestionnaireSubmission>}
	 */
	async deleteLinkedCase(id, linkedCaseId) {
		return await this.dbClient.appellantSubmission.update({
			where: {
				id: id
			},
			data: {
				SubmissionLinkedCase: {
					delete: {
						id: linkedCaseId
					}
				}
			},
			include: {
				SubmissionDocumentUpload: true,
				SubmissionAddress: true,
				SubmissionLinkedCase: true
			}
		});
	}
}

module.exports = { LinkedCaseRepository };
