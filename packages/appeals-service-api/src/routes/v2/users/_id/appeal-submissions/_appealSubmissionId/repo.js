const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

/**
 * @typedef {import("@prisma/client").Prisma.AppealGetPayload<{
 *   where: {
 *      legacyAppealSubmissionId: string;
 *   };
 *  include: {
 *     Users: {
 *        where: {
 *           userId: string;
 *          role: string;
 *     };
 *       };
 *   };
 *}>} AppealWithUser
 */

class UserAppealSubmissionRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get appeals for the given user
	 *
	 * @param {{ userId: string, appealSubmissionId: string }} params
	 * @returns {Promise<AppealWithUser|null>}
	 */
	async getAppealSubmissionForUser({ userId, appealSubmissionId }) {
		try {
			return await this.dbClient.appeal.findFirst({
				where: {
					legacyAppealSubmissionId: appealSubmissionId
				},
				include: {
					Users: {
						where: {
							userId: userId,
							role: APPEAL_USER_ROLES.Appellant
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

module.exports = { UserAppealSubmissionRepository };
