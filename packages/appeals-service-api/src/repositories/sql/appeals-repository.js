const { createPrismaClient } = require('../../db/db-client');
const logger = require('../../lib/logger');
const ApiError = require('../../errors/apiError');
const { Prisma } = require('@pins/database/src/client/client');

/**
 * @typedef { import('@pins/database/src/client/client').Appeal } Appeal
 * @typedef { import('@pins/database/src/client/client').Prisma.AppealCreateInput } AppealCreateInput
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
	 * Updates Appeal by legacyAppealSubmissionId
	 *
	 * @param {AppealCreateInput} appeal
	 * @returns {Promise<Appeal>}
	 */
	async updateAppealByLegacyAppealSubmissionId(appeal) {
		if (!appeal.legacyAppealSubmissionId)
			throw ApiError.badRequest('No legacyAppealSubmissionId provided');
		await this.dbClient.$transaction(async (transaction) => {
			const { count } = await transaction.appeal.updateMany({
				data: appeal,
				where: {
					legacyAppealSubmissionId: appeal.legacyAppealSubmissionId
				}
			});

			if (count > 1) throw ApiError.appealDuplicateLegacyAppealSubmissionId();
			if (count === 0) throw ApiError.appealNotFound();
		});
		const updatedAppeals = await this.dbClient.appeal.findMany({
			where: {
				legacyAppealSubmissionId: appeal.legacyAppealSubmissionId || ''
			}
		});

		if (updatedAppeals.length > 1) throw ApiError.appealDuplicateLegacyAppealSubmissionId();
		if (updatedAppeals.length === 0) throw ApiError.appealNotFound();

		return updatedAppeals[0];
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

	/**
	 * Get by legacy appeal id
	 *
	 * @param {string} id
	 * @returns {Promise<Appeal|null>}
	 */
	async getByLegacyId(id) {
		return await this.dbClient.appeal.findFirst({
			where: {
				legacyAppealSubmissionId: id
			}
		});
	}
}

module.exports = { AppealsRepository };
