const dbClient = require('../../db/db-client');
const { Prisma } = require('@prisma/client');
const logger = require('../../lib/logger');
const ApiError = require('../../errors/apiError');

/**
 * @typedef { import("@prisma/client").AppealUser } AppealUser
 * @typedef { import("@prisma/client").Prisma.AppealUserCreateInput } AppealUserCreateInput
 */

class AppealUserRepository {
	constructor() {}

	/**
	 * Create a new LPA user
	 *
	 * @param {AppealUserCreateInput} user
	 * @returns {Promise<AppealUser>}
	 */
	async createUser(user) {
		try {
			return await dbClient.appealUser.create({
				data: user
			});
		} catch (err) {
			logger.error(err);
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				throw ApiError.userDuplicate();
			}
			throw err;
		}
	}

	/**
	 * Get a user by email
	 *
	 * @param {string} email
	 * @returns {Promise<AppealUser|null>}
	 */
	async getByEmail(email) {
		return await dbClient.appealUser.findUnique({
			where: {
				email
			}
		});
	}
}

module.exports = { AppealUserRepository };
