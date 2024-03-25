const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import('./questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
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
							LPACode: true,
							appealTypeCode: true
						}
					},
					SubmissionDocumentUpload: true,
					SubmissionAddress: true
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
	 * @returns {Promise<Omit<LPAQuestionnaireSubmission, 'SubmissionDocumentUpload' | 'SubmissionAddress'>>}
	 */
	async createQuestionnaire(caseReference) {
		return await this.dbClient.lPAQuestionnaireSubmission.create({
			data: {
				appealCaseReference: caseReference
			},
			include: {
				AppealCase: {
					select: {
						LPACode: true,
						appealTypeCode: true
					}
				}
			}
		});
	}

	/**
	 *
	 * @param {*} caseReference
	 * @param {*} data
	 * @returns {Promise<Omit<LPAQuestionnaireSubmission, 'SubmissionDocumentUpload' | 'SubmissionAddress'>>}
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
						LPACode: true,
						appealTypeCode: true
					}
				}
			}
		});
	}
}

module.exports = { LPAQuestionnaireSubmissionRepository };
