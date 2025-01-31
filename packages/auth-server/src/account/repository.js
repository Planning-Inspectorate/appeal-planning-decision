import { Prisma } from '@prisma/client';

import { DuplicateAccount } from './account-errors.js';
import { InvalidRequest } from 'oidc-provider/lib/helpers/errors.js';

/**
 * @typedef { import("@prisma/client").AppealUser } AppealUser
 * @typedef { import("@prisma/client").AppealToUser } AppealToUser
 * @typedef { import("@prisma/client").Prisma.AppealUserCreateInput } AppealUserCreateInput
 */

export default class AccountRepository {
	dbClient;

	/**
	 * @param {{client: import('@prisma/client').PrismaClient, logger: import('pino').Logger}} deps
	 */
	constructor({ client, logger }) {
		this.dbClient = client;
		this.logger = logger;
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
				data: {
					...user,
					email: user.email?.trim()
				}
			});
		} catch (err) {
			this.logger.error(err);
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
				data: {
					...user,
					email: user.email?.trim()
				},
				where: {
					id: user.id?.trim()
				}
			});
		} catch (err) {
			this.logger.error(err);
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
				email: email.trim()
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
