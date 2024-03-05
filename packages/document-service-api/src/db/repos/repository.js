const { createPrismaClient } = require('../db-client');

class AppealUserRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
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

module.exports = { AppealUserRepository };
