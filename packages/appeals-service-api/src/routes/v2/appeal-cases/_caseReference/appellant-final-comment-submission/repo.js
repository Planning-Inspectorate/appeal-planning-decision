const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import('@prisma/client').AppellantFinalCommentSubmission} AppellantFinalCommentSubmission
 */

/**
 * @typedef {Object} FinalCommentData
 * @property {boolean} [appellantFinalComment]
 * @property {string} [appellantFinalCommentDetails]
 * @property {boolean} [additionalDocuments]
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
							appealTypeCode: true
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
	 * @param {string} id
	 * @returns {Promise<{id: string}>}
	 */
	markAppellantFinalCommentAsSubmitted(id) {
		return this.dbClient.appellantFinalCommentSubmission.update({
			where: {
				id: id
			},
			data: {
				submitted: true
			},
			select: {
				id: true
			}
		});
	}
}

module.exports = { AppellantFinalCommentSubmissionRepository };
