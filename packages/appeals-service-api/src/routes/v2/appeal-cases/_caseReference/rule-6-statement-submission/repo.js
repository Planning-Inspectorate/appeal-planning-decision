const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import('./rule-6-statement-submission').Rule6StatementSubmission} Rule6StatementSubmission
 */

/**
 * @typedef {Object} Rule6StatementData
 * @property {string} [rule6Statement]
 * @property {boolean} [rule6AdditionalDocuments]
 * @property {boolean} [uploadRule6StatementDocuments]
 */

class Rule6StatementSubmissionRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get rule6 party statement for given appeal
	 *
	 * @param {string} userId
	 * @param {string} caseReference
	 * @returns {Promise<Rule6StatementSubmission|null>}
	 */
	async getRule6StatementByAppealRef(userId, caseReference) {
		try {
			return await this.dbClient.rule6StatementSubmission.findUnique({
				where: {
					caseReference,
					userId
				},
				include: {
					AppealCase: {
						select: {
							LPACode: true,
							appealTypeCode: true,
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
	 * Create rule 6 statement for given appeal
	 *
	 * @param {string} userId
	 * @param {string} caseReference
	 * @param {Rule6StatementData} data
	 * @returns {Promise<Omit<Rule6StatementSubmission, 'SubmissionDocumentUpload'>>}
	 */
	async createRule6Statement(userId, caseReference, data) {
		return await this.dbClient.rule6StatementSubmission.create({
			data: {
				userId,
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
	 * @param {string} userId
	 * @param {string} caseReference
	 * @param {Rule6StatementData} data
	 * @returns {Promise<Omit<Rule6StatementSubmission, 'SubmissionDocumentUpload'>>}
	 */
	async patchRule6StatementByAppealId(userId, caseReference, data) {
		return await this.dbClient.rule6StatementSubmission.update({
			where: {
				caseReference,
				userId
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
	 * @param {string} userId
	 * @param {string} caseReference
	 * @returns {Promise<{id: string}>}
	 */
	markRule6StatementAsSubmitted(userId, caseReference) {
		return this.dbClient.rule6StatementSubmission.update({
			where: {
				caseReference,
				userId
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

module.exports = { Rule6StatementSubmissionRepository };
