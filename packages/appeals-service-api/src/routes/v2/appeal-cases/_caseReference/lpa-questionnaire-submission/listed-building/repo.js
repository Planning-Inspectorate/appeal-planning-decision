const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import('@pins/database/src/client').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 * @typedef {import('@pins/database/src/client').Prisma.SubmissionListedBuildingCreateInput} ListedBuilding
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
	 * @param {ListedBuilding} linkedBuilding
	 * @returns {Promise<LPAQuestionnaireSubmission>}
	 */
	async createListedBuilding(caseReference, linkedBuilding) {
		return await this.dbClient.lPAQuestionnaireSubmission.update({
			where: {
				appealCaseReference: caseReference
			},
			data: {
				SubmissionListedBuilding: {
					create: {
						...linkedBuilding
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
	 * Delete address
	 *
	 * @param {string} caseReference
	 * @param {string} listedBuildingId
	 * @returns {Promise<LPAQuestionnaireSubmission>}
	 */
	async deleteListedBuilding(caseReference, listedBuildingId) {
		return await this.dbClient.lPAQuestionnaireSubmission.update({
			where: {
				appealCaseReference: caseReference
			},
			data: {
				SubmissionListedBuilding: {
					delete: {
						id: listedBuildingId
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

module.exports = { LinkedCaseRepository };
