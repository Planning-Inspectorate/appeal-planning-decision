const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import("@prisma/client").Prisma.AppealUserGetPayload<{include: {Appeals: {include: {Appeal: { include: {AppealCase: true }}}}}}>} UserWithAppeals
 */

class UserAppealsRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get appeals for the given user
	 *
	 * @param {string} userId
	 * @returns {Promise<UserWithAppeals|null>}
	 */
	async listAppealsForUser(userId) {
		try {
			return await this.dbClient.appealUser.findUnique({
				where: {
					id: userId
				},
				include: {
					Appeals: {
						include: {
							Appeal: {
								include: {
									AppealCase: true
								}
							}
						}
					}
				}
			});
		} catch (e) {
			if (e instanceof PrismaClientKnownRequestError) {
				if (e.code === 'P2023') {
					// probably an invalid ID/GUID
					return null;
				}
			}
			throw e;
		}
	}
}

module.exports = { UserAppealsRepository };
