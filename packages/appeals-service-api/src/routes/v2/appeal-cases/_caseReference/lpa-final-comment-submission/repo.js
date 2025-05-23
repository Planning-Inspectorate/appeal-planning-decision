const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import('./lpa-final-comment-submission').LPAFinalCommentSubmission} LPAFinalCommentSubmission
 */

/**
 * @typedef {Object} FinalCommentData
 * @property {boolean} [lpaFinalComment]
 * @property {string} [lpaFinalCommentDetails]
 * @property {boolean} [appellantFinalCommentDocuments]
 */

class LPAFinalCommentSubmissionRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get lpa final comment for given appeal
	 *
	 * @param {string} caseReference
	 * @returns {Promise<LPAFinalCommentSubmission|null>}
	 */
	async getLPAFinalCommentByAppealRef(caseReference) {
		try {
			return await this.dbClient.lPAFinalCommentSubmission.findUnique({
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
	 * Create lpa final comment for given appeal
	 *
	 * @param {string} caseReference
	 * @param {FinalCommentData} data
	 * @returns {Promise<Omit<LPAFinalCommentSubmission, 'SubmissionDocumentUpload'>>}
	 */
	async createLPAFinalComment(caseReference, data) {
		return await this.dbClient.lPAFinalCommentSubmission.create({
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
	 * @returns {Promise<Omit<LPAFinalCommentSubmission, 'SubmissionDocumentUpload'>>}
	 */
	async patchLPAFinalCommentByAppealId(caseReference, data) {
		return await this.dbClient.lPAFinalCommentSubmission.update({
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
	 * @param {string} LPACommentsSubmittedDate date time string of date submitted to FO
	 * @returns {Promise<{id: string}>}
	 */
	markLPAFinalCommentAsSubmitted(caseReference, LPACommentsSubmittedDate) {
		return this.dbClient.lPAFinalCommentSubmission.update({
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
							LPACommentsSubmittedDate
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

module.exports = { LPAFinalCommentSubmissionRepository };
