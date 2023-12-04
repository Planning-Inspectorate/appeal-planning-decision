const { createPrismaClient } = require('../../../db/db-client');

/**
 * @typedef { import("@prisma/client").SecurityToken } SecurityToken
 * @typedef { import("@prisma/client").Prisma.SecurityTokenCreateInput } SecurityTokenCreateInput
 */

class TokenRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Upsert a new SecurityToken
	 * @param {string} appealUserId
	 * @param {string} action
	 * @param {string} token
	 * @returns {Promise<SecurityToken>}
	 */
	async create(appealUserId, action, token) {
		const securityToken = {
			token: token,
			action: action,
			attempts: 0,
			tokenGeneratedAt: new Date()
		};

		return this.dbClient.securityToken.upsert({
			create: { ...securityToken, appealUserId: appealUserId },
			update: { ...securityToken },
			where: { appealUserId: appealUserId }
		});
	}

	/**
	 * Get a token by user id
	 * @param {string} appealUserId
	 * @returns {Promise<SecurityToken|null>}
	 */
	async getByUserId(appealUserId) {
		return await this.dbClient.securityToken.update({
			data: {
				attempts: {
					increment: 1
				}
			},
			where: { appealUserId: appealUserId }
		});
	}

	/**
	 * Get a token's createdAt date or undefined if one doesn't exist
	 * @param {string} appealUserId
	 * @returns {Promise<Date|undefined>}
	 */
	async getCreatedDate(appealUserId) {
		const result = await this.dbClient.securityToken.findUnique({
			where: { appealUserId: appealUserId },
			select: {
				tokenGeneratedAt: true
			}
		});

		return result?.tokenGeneratedAt;
	}
}

module.exports = TokenRepository;
