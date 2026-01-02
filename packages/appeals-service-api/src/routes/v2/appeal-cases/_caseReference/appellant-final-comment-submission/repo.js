const { createPrismaClient } = require('#db-client');
const { Prisma } = require('@pins/database/src/client/client');

/**
* @typedef {import('./appellant-final-comment-submission').AppellantFinalCommentSubmission} AppellantFinalCommentSubmission

 */

/**
 * @typedef {Object} FinalCommentData
 * @property {boolean} [appellantFinalComment]
 * @property {string} [appellantFinalCommentDetails]
 * @property {boolean} [appellantFinalCommentDocuments]
 */

class AppellantFinalCommentSubmissionRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get appellant final comment for given appeal
	 *
	 * @param {string} caseReference
	 * @returns {Promise<AppellantFinalCommentSubmission|null>}
	 */
	async getAppellantFinalCommentByAppealRef(caseReference) {
		try {
			return await this.dbClient.appellantFinalCommentSubmission.findUnique({
				where: {
					caseReference
				},
				include: {
					AppealCase: {
						select: {
							LPACode: true,
							appealTypeCode: true,
							finalCommentsDueDate: true,
							siteAddressLine1: true,
							siteAddressLine2: true,
							siteAddressTown: true,
							siteAddressCounty: true,
							siteAddressPostcode: true,
							applicationReference: true
						}
					},
					SubmissionDocumentUpload: true
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
	 * Create appellant final comment for given appeal
	 *
	 * @param {string} caseReference
	 * @param {FinalCommentData} data
	 * @returns {Promise<Omit<AppellantFinalCommentSubmission, 'SubmissionDocumentUpload'>>}
	 */
	async createAppellantFinalComment(caseReference, data) {
		return await this.dbClient.appellantFinalCommentSubmission.create({
			data: {
				caseReference,
				...data
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
	 * @param {string} caseReference
	 * @param {FinalCommentData} data
	 * @returns {Promise<Omit<AppellantFinalCommentSubmission, 'SubmissionDocumentUpload'>>}
	 */
	async patchAppellantFinalCommentByAppealId(caseReference, data) {
		return await this.dbClient.appellantFinalCommentSubmission.update({
			where: {
				caseReference
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
	 * @param {string} appellantCommentsSubmittedDate date time string of date submitted to FO
	 * @returns {Promise<{id: string}>}
	 */
	markAppellantFinalCommentAsSubmitted(caseReference, appellantCommentsSubmittedDate) {
		return this.dbClient.appellantFinalCommentSubmission.update({
			where: {
				caseReference
			},
			data: {
				submitted: true,
				AppealCase: {
					update: {
						where: {
							caseReference
						},
						data: {
							appellantCommentsSubmittedDate
						}
					}
				}
			},
			select: {
				id: true
			}
		});
	}
}

module.exports = { AppellantFinalCommentSubmissionRepository };
