const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import('@prisma/client').Prisma.LPAQuestionnaireSubmissionGetPayload<
 * {
 * 	include: {
 *		AppealCase: {
 *			select: {
 *				LPACode: true
 *			}
 *		}
 * 	}
 * }
 * >} LPAQuestionnaireSubmission
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
	async getLPAQuestionnaireByAppealRef(caseReference) {
		try {
			return await this.dbClient.lPAQuestionnaireSubmission.findUnique({
				where: {
					appealCaseReference: caseReference
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
	 * @returns {Promise<LPAQuestionnaireSubmission>}
	 */
	async createQuestionnaire(caseReference) {
		return await this.dbClient.lPAQuestionnaireSubmission.create({
			data: {
				appealCaseReference: caseReference
			},
			include: {
				AppealCase: {
					select: {
						LPACode: true
					}
				}
			}
		});
	}

	/**
	 *
	 * @param {*} caseReference
	 * @param {*} data
	 * @returns {Promise<LPAQuestionnaireSubmission>}
	 */
	async patchLPAQuestionnaireByAppealId(caseReference, data) {
		return await this.dbClient.lPAQuestionnaireSubmission.update({
			where: {
				appealCaseReference: caseReference
			},
			data,
			include: {
				AppealCase: {
					select: {
						LPACode: true
					}
				}
			}
		});
	}
}

module.exports = { LPAQuestionnaireSubmissionRepository };
