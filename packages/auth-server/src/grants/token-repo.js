import { createToken } from '@pins/common/src/lib/token.js';

export const MILLISECONDS_BETWEEN_TOKENS = 10_000;

/**
 * @typedef { import("@prisma/client").PrismaClient } PrismaClient
 * @typedef { import("@prisma/client").SecurityToken } SecurityToken
 * @typedef { import("@prisma/client").Prisma.SecurityTokenCreateInput } SecurityTokenCreateInput
 */

export default class TokenRepository {
	dbClient;

	/**
	 * @param {{client: import('@prisma/client').PrismaClient}} deps
	 */
	constructor({ client }) {
		this.dbClient = client;
	}

	/**
	 * Upsert a new SecurityToken
	 * @param {string} appealUserId
	 * @param {string} action
	 * @returns {Promise<string|null>}
	 */
	createOrUpdate(appealUserId, action) {
		return this.dbClient.$transaction(async (tx) => {
			const tokenCreatedAt = await tx.securityToken.findUnique({
				where: { appealUserId: appealUserId },
				select: {
					tokenGeneratedAt: true
				}
			});

			if (tokenCreatedAt) {
				// to avoid issue with multiple requests sending multiple emails
				const milliSecondsSinceTokenCreation = this.#getMilliSecondsSinceDate(
					tokenCreatedAt.tokenGeneratedAt
				);
				if (milliSecondsSinceTokenCreation < MILLISECONDS_BETWEEN_TOKENS) {
					return null;
				}
			}

			const token = createToken();

			const securityToken = {
				token: token,
				action: action,
				attempts: 0,
				tokenGeneratedAt: new Date()
			};

			const tokenResult = await tx.securityToken.upsert({
				create: { ...securityToken, appealUserId: appealUserId },
				update: { ...securityToken },
				where: { appealUserId: appealUserId }
			});

			return tokenResult.token;
		});
	}

	/**
	 * @param {Date} date
	 * @returns {number}
	 */
	#getMilliSecondsSinceDate(date) {
		return new Date().getTime() - new Date(date).getTime();
	}

	/**
	 * Get a token by user id
	 * @param {string} appealUserId
	 * @returns {Promise<SecurityToken|null>}
	 */
	getByUserId(appealUserId) {
		return this.dbClient.securityToken.update({
			data: {
				attempts: {
					increment: 1
				}
			},
			where: { appealUserId: appealUserId }
		});
	}
}
