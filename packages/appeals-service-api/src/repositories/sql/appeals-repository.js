const { createPrismaClient } = require('../../db/db-client');
const { Prisma } = require('@prisma/client');
const logger = require('../../lib/logger');
const ApiError = require('../../errors/apiError');

/**
 * @typedef { import("@prisma/client").Appeal } Appeal
 * @typedef { import("@prisma/client").Prisma.AppealCreateInput } AppealCreateInput
 */

class AppealsRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Create a new Appeal
	 *
	 * @param {AppealCreateInput} appeal
	 * @returns {Promise<Appeal>}
	 */
	async createAppeal(appeal) {
		try {
			return await this.dbClient.appeal.create({
				data: appeal
			});
		} catch (err) {
			logger.error(err);
			if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
				throw ApiError.appealDuplicate();
			}
			throw err;
		}
	}

	/**
	 * Updates Appeal
	 *
	 * @param {AppealCreateInput} appeal
	 * @returns {Promise<Appeal>}
	 */
	async updateAppeal(appeal) {
		try {
			return await this.dbClient.appeal.update({
				data: appeal,
				where: {
					id: appeal.id
				}
			});
		} catch (err) {
			logger.error(err);
			if (err instanceof Prisma.PrismaClientKnownRequestError) {
				throw ApiError.appealNotFound();
			}
			throw err;
		}
	}

	/**
	 * Get an appeal by id
	 *
	 * @param {string} id
	 * @returns {Promise<Appeal|null>}
	 */
	async getById(id) {
		return await this.dbClient.appeal.findUnique({
			where: {
				id
			}
		});
	}
}

module.exports = { AppealsRepository };
