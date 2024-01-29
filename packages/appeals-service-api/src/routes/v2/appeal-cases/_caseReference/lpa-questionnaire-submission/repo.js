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
	 * @param {string} caseReference
	 * @returns {Promise<LPAQuestionnaireSubmission|null>}
	 */
	async getLPAQuestionnaireByAppealId(caseReference) {
		try {
			return await this.dbClient.lPAQuestionnaireSubmission.findUnique({
				where: {
					appealCaseReference: caseReference
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
	 * @param {string} caseReference
	 * @param {string} lpaCode
	 * @returns {Promise<LPAQuestionnaireSubmission|null>}
	 */
	async createQuestionnaire(caseReference, lpaCode) {
		return await this.dbClient.lPAQuestionnaireSubmission.create({
			data: {
				appealCaseReference: caseReference,
				lpaCode
			}
		});
	}

	/**
	 *
	 * @param {*} caseReference
	 * @param {*} data
	 * @returns
	 */
	async patchLPAQuestionnaireByAppealId(caseReference, data) {
		return await this.dbClient.lPAQuestionnaireSubmission.update({
			where: {
				appealCaseReference: caseReference
			},
			data
		});
	}
}

module.exports = { LPAQuestionnaireSubmissionRepository };
