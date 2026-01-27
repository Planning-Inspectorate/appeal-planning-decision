const { createPrismaClient } = require('#db-client');
const { Prisma } = require('@pins/database/src/client/client');

/**
 * @typedef {import('./appellant-statement-submission').AppellantStatementSubmission} AppellantStatementSubmission
 */

/**
 * @typedef {Object} StatementData
 * @property {string} appellantStatement
 * @property {boolean} additionalDocuments
 */

class AppellantStatementSubmissionRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get statement for given appeal
	 *
	 * @param {string} caseReference
	 * @returns {Promise<AppellantStatementSubmission|null>}
	 */
	async getAppellantStatementByAppealRef(caseReference) {
		try {
			return await this.dbClient.appellantStatementSubmission.findUnique({
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
	 * Create statement for given appeal
	 *
	 * @param {string} caseReference
	 * @param {StatementData} data
	 * @returns {Promise<Omit<AppellantStatementSubmission, 'SubmissionDocumentUpload'>>}
	 */
	async createStatement(caseReference, data) {
		return await this.dbClient.appellantStatementSubmission.create({
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
	 * @returns {Promise<Omit<AppellantStatementSubmission, 'SubmissionDocumentUpload'>>}
	 */
	async patchAppellantStatementByAppealId(caseReference, data) {
		return await this.dbClient.appellantStatementSubmission.update({
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
	 * @param {string} appellantStatementSubmittedDate
	 * @returns {Promise<{id: string}>}
	 */
	markAppellantStatementAsSubmitted(caseReference, appellantStatementSubmittedDate) {
		return this.dbClient.appellantStatementSubmission.update({
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
							appellantStatementSubmittedDate
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

module.exports = { AppellantStatementSubmissionRepository };
