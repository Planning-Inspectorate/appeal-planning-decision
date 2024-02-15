import { Prisma } from '@prisma/client';

import createPrismaClient from '../adapter/prisma-client.js';
import logger from '../lib/logger.js';
import { DuplicateAccount } from './account-errors.js';
import { InvalidRequest } from 'oidc-provider/lib/helpers/errors.js';

/**
 * @typedef { import("@pins/database/src/seed/data-static").AppealToUserRoles } AppealToUserRoles
 * @typedef { import("@prisma/client").AppealUser } AppealUser
 * @typedef { import("@prisma/client").AppealToUser } AppealToUser
 * @typedef { import("@prisma/client").Prisma.AppealUserCreateInput } AppealUserCreateInput
 */

export default class AppealUserRepository {
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
				throw new DuplicateAccount(`duplicate user ${user.email}`);
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
				throw new InvalidRequest(err);
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
