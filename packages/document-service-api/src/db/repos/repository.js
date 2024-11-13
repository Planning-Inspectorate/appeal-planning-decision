const { createPrismaClient } = require('../db-client');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

const logger = require('#lib/logger');

class DocumentsRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * @param {string} id SubmissionDocumentUpload id
	 * @returns {Promise<import("@prisma/client").SubmissionDocumentUpload & { LPAQuestionnaireSubmission: { appealCaseReference: string} }>} documentWithAppeal
	 */
	async getSubmissionDocument(id) {
		return this.dbClient.submissionDocumentUpload.findUnique({
			where: {
				id
			},
			select: {
				id: true,
				location: true,
				originalFileName: true,
				appellantSubmissionId: true,
				LPAQuestionnaireSubmission: {
					select: {
						appealCaseReference: true
					}
				}
			}
		});
	}

	/**
	 * @param {string} id SubmissionDocumentUpload id
	 * @return {Promise<import("@prisma/client").SubmissionDocumentUpload>}
	 */
	async deleteSubmissionDocument(id) {
		return this.dbClient.submissionDocumentUpload.delete({
			where: {
				id
			}
		});
	}

	/**
	 * @param {string} lookup document lookup, id or uri
	 * @return {Promise<import("@prisma/client").Document & { AppealCase: { LPACode:string, appealId: string} }>}
	 */
	async getDocumentWithAppeal(lookup) {
		return await this.dbClient.document.findFirstOrThrow({
			where: this.#getDocumentLookupQuery(lookup),
			include: {
				AppealCase: {
					select: {
						LPACode: true,
						appealId: true
					}
				}
			}
		});
	}

	/**
	 *
	 * @param params
	 * @returns {Promise<import("@prisma/client").Document[]>}
	 */
	async getDocuments(params) {
		return await this.dbClient.document.findMany({
			where: params
		});
	}

	/**
	 * @param {Object} params
	 * @param {string} params.appealId
	 * @param {string} params.userId
	 * @returns {Promise<import("@prisma/client").AppealToUser[]>}
	 */
	async getAppealUserRoles({ appealId, userId }) {
		return await this.dbClient.appealToUser.findMany({
			where: {
				appealId,
				userId
			},
			select: {
				appealId: true,
				userId: true,
				role: true
			}
		});
	}

	/**
	 * @param {{ caseReference: string, userLpa: string }} params
	 * @returns {Promise<boolean>}
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
			throw new Error(`${userLpa} does not have access to case: ${caseReference}`);
		}
	}

	/**
	 * @param {{ appellantSubmissionId: string, userId: string }} params
	 * @returns {Promise<boolean>}
	 */
	async userOwnsAppealSubmission({ appellantSubmissionId, userId }) {
		try {
			const result = await this.dbClient.appellantSubmission.findUniqueOrThrow({
				where: {
					id: appellantSubmissionId
				},
				select: {
					Appeal: {
						select: {
							id: true,
							Users: {
								where: {
									userId,
									role: { in: [APPEAL_USER_ROLES.APPELLANT, APPEAL_USER_ROLES.AGENT] }
								}
							}
						}
					}
				}
			});

			if (!result.Appeal.Users.some((x) => x.userId.toLowerCase() === userId.toLowerCase())) {
				throw new Error('Forbidden');
			}

			return true;
		} catch (err) {
			logger.error({ err }, 'invalid user access');
			throw new Error('Forbidden');
		}
	}

	/**
	 * document lookup, can be blob storage uri or an id
	 * @param {string} documentLookup
	 * @returns {import('@prisma/client').Prisma.DocumentWhereUniqueInput}
	 */
	#getDocumentLookupQuery(documentLookup) {
		/** @type {import('@prisma/client').Prisma.DocumentWhereUniqueInput} */
		let where = {};
		if (documentLookup.includes('http')) {
			where.documentURI = documentLookup;
		} else {
			where.id = documentLookup;
		}
		return where;
	}
}

module.exports = { DocumentsRepository };
