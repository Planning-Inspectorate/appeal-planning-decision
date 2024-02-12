const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import('@prisma/client').Prisma.AppealCaseGetPayload<{
 *  where: {
 *    caseReference: any;
 *  };
 *  include: {
 *    Appeal: {
 *      include: {
 *        Users: {
 *          where: {
 *            userId: string;
 *            role: any;
 *          };
 *        };
 *      };
 *    };
 *  };
 *}>} AppealCaseWithUser
 */

module.exports = class Repo {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get appeals for the given user
	 *
	 * @param {{ caseReference: string, userId: string, role: string }} params
	 * @returns {Promise<AppealCaseWithUser|null>}
	 */
	async get({ caseReference, role, userId }) {
		try {
			return await this.dbClient.appealCase.findUnique({
				where: {
					caseReference
				},
				include: {
					Appeal: {
						include: {
							Users: {
								where: {
									userId,
									role
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
};
