const { createPrismaClient } = require('../../db/db-client');
const { Prisma } = require('@pins/database/src/client');
const logger = require('../../lib/logger');
const ApiError = require('../../errors/apiError');
const { APPEAL_USER_ROLES, STATUS_CONSTANTS } = require('@pins/common/src/constants');

/**
 * @typedef { import('@pins/common/src/constants').AppealToUserRoles } AppealToUserRoles
 * @typedef { import('@pins/database/src/client').AppealUser } AppealUser
 * @typedef { import('@pins/database/src/client').AppealToUser } AppealToUser
 * @typedef { import('@pins/database/src/client').Prisma.AppealUserCreateInput } AppealUserCreateInput
 * @typedef { import('@pins/database/src/client').PrismaClient } PrismaClient
 */

class AppealUserRepository {
	/**
	 * @type {PrismaClient | Prisma.TransactionClient}
	 */
	dbClient;

	/**
	 * @param {Prisma.TransactionClient} [client]
	 */
	constructor(client) {
		this.dbClient = client ?? createPrismaClient();
	}

	/**
	 * Create a new AppealUser
	 *
	 * @param {AppealUserCreateInput} user
	 * @returns {Promise<AppealUser>}
	 */
	async createUser(user) {
		if (user.isLpaUser) {
			user.lpaStatus = STATUS_CONSTANTS.ADDED;
			user.isLpaAdmin = user.isLpaAdmin ?? false;
		}

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
	 * Search users
	 * @param {import('@pins/database/src/client').Prisma.AppealUserWhereInput} [searchOptions]
	 * @returns {Promise<AppealUser[]>}
	 */
	async search(searchOptions) {
		return this.dbClient.appealUser.findMany({
			where: searchOptions
		});
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
	 * Count Users where given email user also has Rule6Party role
	 * Used to confirm whether given user is a Rule 6 User
	 *
	 * @param {string} email
	 * @returns {Promise<number>}
	 */
	async countUsersWhereEmailAndRule6Party(email) {
		return await this.dbClient.appealUser.count({
			where: {
				AND: [
					{ email: email },
					{
						Appeals: {
							some: {
								role: APPEAL_USER_ROLES.RULE_6_PARTY
							}
						}
					}
				]
			}
		});
	}

	/**
	 * Sets user's role on an appeal
	 * @param {string} userId
	 * @param {string} appealId
	 * @param {AppealToUserRoles|undefined} role
	 * @returns {Promise<AppealToUser>}
	 */
	async linkUserToAppeal(userId, appealId, role) {
		try {
			const link = {
				appealId: appealId,
				userId: userId
			};

			const appealToUserRoles = await this.dbClient.appealToUser.findMany({
				where: link
			});

			// default to appellant as when creating new appeal we do not know the role yet
			if (appealToUserRoles.length === 0) {
				const roleWithDefault = role !== undefined ? role : APPEAL_USER_ROLES.APPELLANT;
				return this.dbClient.appealToUser.create({
					data: { ...link, role: roleWithDefault }
				});
			}

			// add as rule 6 if not already
			if (role === APPEAL_USER_ROLES.RULE_6_PARTY) {
				const rule6Role = appealToUserRoles.filter(
					(x) => x.role === APPEAL_USER_ROLES.RULE_6_PARTY
				);
				if (rule6Role.length === 0) {
					return this.dbClient.appealToUser.create({
						data: { ...link, role }
					});
				}

				return rule6Role[0];
			}

			// switch existing role between agent/appellant
			const existingRole = appealToUserRoles.filter(
				(x) => x.role === APPEAL_USER_ROLES.APPELLANT || x.role === APPEAL_USER_ROLES.AGENT
			)[0];

			if (existingRole.role === role) return existingRole;

			return this.dbClient.appealToUser.update({
				where: {
					id: existingRole.id
				},
				data: {
					role
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

	/**
	 * Remove user's specified role on an appeal
	 * @param {string} userId
	 * @param {string} caseReference
	 * @param {AppealToUserRoles} role
	 * @returns {Promise<void>}
	 */
	async unlinkUserFromAppeal(userId, caseReference, role) {
		try {
			await this.dbClient.appealToUser.deleteMany({
				where: {
					userId: userId,
					role: role,
					Appeal: {
						AppealCase: {
							caseReference
						}
					}
				}
			});
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2023') {
					throw ApiError.appealNotFound(caseReference);
				}
			}
			throw e;
		}
	}
}

module.exports = { AppealUserRepository };
