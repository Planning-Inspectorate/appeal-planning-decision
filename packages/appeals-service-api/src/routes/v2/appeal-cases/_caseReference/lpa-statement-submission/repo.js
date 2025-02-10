const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import('./lpa-statement-submission').LPAStatementSubmission} LPAStatementSubmission
 */

/**
 * @typedef {Object} StatementData
 * @property {string} lpaStatement
 * @property {boolean} additionalDocuments
 */

class LPAStatementSubmissionRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get statement for given appeal
	 *
	 * @param {string} caseReference
	 * @returns {Promise<LPAStatementSubmission|null>}
	 */
	async getLPAStatementByAppealRef(caseReference) {
		try {
			return await this.dbClient.lPAStatementSubmission.findUnique({
				where: {
					appealCaseReference: caseReference
				},
				include: {
					AppealCase: {
						select: {
							LPACode: true,
							appealTypeCode: true,
							caseReference: true,
							finalCommentsDueDate: true,
							siteAddressLine1: true,
							siteAddressLine2: true,
							siteAddressTown: true,
							siteAddressCounty: true,
							siteAddressPostcode: true
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
	 * Create statement for given appeal
	 *
	 * @param {string} caseReference
	 * @param {StatementData} data
	 * @returns {Promise<Omit<LPAStatementSubmission, 'SubmissionDocumentUpload'>>}
	 */
	async createStatement(caseReference, data) {
		return await this.dbClient.lPAStatementSubmission.create({
			data: {
				appealCaseReference: caseReference,
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
	 * @param {StatementData} data
	 * @returns {Promise<Omit<LPAStatementSubmission, 'SubmissionDocumentUpload'>>}
	 */
	async patchLPAStatementByAppealId(caseReference, data) {
		return await this.dbClient.lPAStatementSubmission.update({
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
	 * @param {string} lpaStatementSubmittedDate
	 * @returns {Promise<{id: string}>}
	 */
	markLPAStatementAsSubmitted(caseReference, lpaStatementSubmittedDate) {
		return this.dbClient.lPAStatementSubmission.update({
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
							LPAStatementSubmittedDate: lpaStatementSubmittedDate
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

module.exports = { LPAStatementSubmissionRepository };
