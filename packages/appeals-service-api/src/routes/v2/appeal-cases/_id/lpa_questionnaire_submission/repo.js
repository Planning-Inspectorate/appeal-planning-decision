const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import('@prisma/client').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 */

class LPAQuestionnaireSubmissionRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get questionnaire for given appeal
	 *
	 * @param {string} id
	 * @returns {Promise<LPAQuestionnaireSubmission|null>}
	 */
	async getLPAQuestionnaireByAppealId(id) {
		try {
			return await this.dbClient.lPAQuestionnaireSubmission.findUnique({
				where: {
					appealCaseId: id
				}
			});
		} catch (e) {
			if (e instanceof PrismaClientKnownRequestError) {
				if (e.code === 'P2023') {
					// probably an invalid ID/GUID
					return null;
				}
			}
			throw e;
		}
	}

	/**
	 * Create questionnaire for given appeal
	 *
	 * @param {string} id
	 * @returns {Promise<LPAQuestionnaireSubmission|null>}
	 */
	async createQuestionnaire(id) {
		return await this.dbClient.lPAQuestionnaireSubmission.create({
			data: {
				appealCaseId: id
			}
		});
	}

	/**
	 *
	 * @param {*} id
	 * @param {*} data
	 * @returns
	 */
	async putLPAQuestionnaireByAppealId(id, data) {
		return await this.dbClient.lPAQuestionnaireSubmission.upsert({
			create: { ...data, appealCaseId: id },
			update: data,
			where: {
				appealCaseId: id
			}
		});
	}
}

module.exports = { LPAQuestionnaireSubmissionRepository };
