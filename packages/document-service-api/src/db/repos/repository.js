const { createPrismaClient } = require('../db-client');

class DocumentsRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * @param {string} id SubmissionDocumentUpload id
	 * @return {Promise<{id: string, location: string}|null>}
	 */
	async getSubmissionDocument(id) {
		return this.dbClient.submissionDocumentUpload.findUnique({
			where: {
				id
			},
			select: {
				id: true,
				location: true
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
	 * @param {Object} params
	 * @param {string} params.appealId
	 * @param {string} params.userId
	 * @returns {Promise<import("@prisma/client").AppealToUser|null>}
	 */
	async getAppealUser({ appealId, userId }) {
		return await this.dbClient.appealToUser.findFirst({
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
