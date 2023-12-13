const { createPrismaClient } = require('../../db/db-client');
const { Prisma } = require('@prisma/client');
const logger = require('../../lib/logger');
const ApiError = require('../../errors/apiError');

/**
 * @typedef { import("@prisma/client").AppealUser } AppealUser
 * @typedef { import("@prisma/client").Prisma.AppealUserCreateInput } AppealUserCreateInput
 */

class AppealUserRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Create a new AppealUser
	 *
	 * @param {AppealUserCreateInput} user
	 * @returns {Promise<AppealUser>}
	 */
	async createUser(user) {
		try {
			return await this.dbClient.appealUser.create({
				data: user
			});
		} catch (err) {
			logger.error(err);
			if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
				throw ApiError.userDuplicate();
			}
			throw err;
		}
	}

	/**
	 * Updates AppealUser
	 *
	 * @param {AppealUserCreateInput} user
	 * @returns {Promise<AppealUser>}
	 */
	async updateUser(user) {
		try {
			return await this.dbClient.appealUser.update({
				data: user,
				where: {
					id: user.id
				}
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
		return await this.dbClient.appealUser.findUnique({
			where: {
				email
			}
		});
	}

	/**
	 * Get a user by id
	 *
	 * @param {string} id
	 * @returns {Promise<AppealUser|null>}
	 */
	async getById(id) {
		return await this.dbClient.appealUser.findUnique({
			where: {
				id
			}
		});
	}
}

module.exports = { AppealUserRepository };
