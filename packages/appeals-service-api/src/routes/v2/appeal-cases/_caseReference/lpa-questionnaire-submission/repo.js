const { createPrismaClient } = require('#db-client');
const { Prisma } = require('@pins/database/src/client');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');

/**
 * @typedef {import('./questionnaire-submission').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 */

class LPAQuestionnaireSubmissionRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * @param {{ caseReference: string, userLpa: string }} params
	 */
	async lpaCanModifyCase({ caseReference, userLpa }) {
		try {
			await this.dbClient.appealCase.findUniqueOrThrow({
				where: {
					caseReference,
					LPACode: userLpa
				},
				select: {
					id: true
				}
			});

			return true;
		} catch (err) {
			logger.error({ err }, 'invalid user access');
			throw ApiError.forbidden();
		}
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
					SubmissionAddress: true,
					SubmissionLinkedCase: true,
					SubmissionListedBuilding: true
				}
			});
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
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

	/**
	 * @param {string} caseReference
	 * @param {string} lpaQuestionnaireSubmittedDate
	 * @returns {Promise<{id: string}>}
	 */
	async markLPAQuestionnaireAsSubmitted(caseReference, lpaQuestionnaireSubmittedDate) {
		return await this.dbClient.lPAQuestionnaireSubmission.update({
			where: {
				appealCaseReference: caseReference
			},
			data: {
				submitted: true,
				AppealCase: {
					update: {
						where: {
							caseReference
						},
						data: {
							lpaQuestionnaireSubmittedDate
						}
					}
				}
			},
			select: {
				id: true
			}
		});
	}

	/**
	 * @param {string} caseReference
	 * @returns {Promise<LPAQuestionnaireSubmission|null>}
	 */
	async getLPAQuestionnaireDownloadDetails(caseReference) {
		try {
			const result = await this.dbClient.lPAQuestionnaireSubmission.findUnique({
				where: {
					appealCaseReference: caseReference
				},
				select: {
					id: true,
					submissionPdfId: true
				}
			});

			return result;
		} catch (err) {
			logger.error({ err }, 'case reference not found');
			throw ApiError.questionnaireDownloadDetailsNotFound;
		}
	}
}

module.exports = { LPAQuestionnaireSubmissionRepository };
