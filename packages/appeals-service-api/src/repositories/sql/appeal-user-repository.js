const { createPrismaClient } = require('../../db/db-client');
const { Prisma } = require('@prisma/client');
const logger = require('../../lib/logger');
const ApiError = require('../../errors/apiError');
const { APPEAL_USER_ROLES } = require('../../db/seed/data-static');

/**
 * @typedef { import("../../db/seed/data-static").AppealToUserRoles } AppealToUserRoles
 * @typedef { import("@prisma/client").AppealUser } AppealUser
 * @typedef { import("@prisma/client").AppealToUser } AppealToUser
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

	/**
	 * Sets user's role on an appeal
	 * @param {string} userId
	 * @param {string} appealId
	 * @param {import("../../db/seed/data-static").AppealToUserRoles|undefined} role
	 * @returns {Promise<AppealToUser>}
	 */
	async linkUserToAppeal(userId, appealId, role) {
		try {
			const link = {
				appealId: appealId,
				userId: userId
			};

			// default to appellant as when creating new appeal we do not know the role yet
			const roleWithDefault = role !== undefined ? role : APPEAL_USER_ROLES.appellant.name;

			return await this.dbClient.appealToUser.upsert({
				create: { ...link, role: roleWithDefault },
				update: { role: role }, // don't default role when updating
				where: {
					appealId_userId: link
				}
			});
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2023') {
					throw ApiError.appealNotFound(appealId);
				}
			}
			throw e;
		}
	}
}

module.exports = { AppealUserRepository };
