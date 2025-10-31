const { createPrismaClient } = require('#db-client');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');
const { DocumentsArgsPublishedOnly } = require('../../../../appeal-cases/repo');
/**
 * @typedef {import('@prisma/client').AppealCase} AppealCase
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
	 * @returns {Promise<AppealCase|null>}
	 */
	async get({ caseReference, role, userId }) {
		try {
			/**
			 * @type {import('@prisma/client').Prisma.AppealToUserWhereInput}
			 */
			const where = {};
			if (role === APPEAL_USER_ROLES.APPELLANT || role === APPEAL_USER_ROLES.AGENT) {
				// if appellant or agent, search for both as we don't know the role before we fetch the appeal
				// and access is equivalent
				where.OR = [
					{ userId, role: APPEAL_USER_ROLES.APPELLANT },
					{ userId, role: APPEAL_USER_ROLES.AGENT }
				];
			} else {
				where.userId = userId;
				where.role = role;
			}

			return await this.dbClient.appealCase.findUnique({
				where: {
					caseReference,
					Appeal: {
						Users: {
							some: where
						}
					}
				},
				include: {
					Documents: DocumentsArgsPublishedOnly,
					ListedBuildings: true,
					AppealCaseLpaNotificationMethod: true,
					NeighbouringAddresses: true,
					ProcedureType: true,
					Events: true,
					AdvertDetails: true
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

	/**
	 * Get appeals for the given LPA user
	 *
	 * @param {{ caseReference: string, userId: string }} params
	 * @returns {Promise<AppealCase|null>}
	 */
	async getForLpaUser({ caseReference, userId }) {
		try {
			return await this.dbClient.$transaction(async (tx) => {
				const user = await tx.appealUser.findUnique({ where: { id: userId } });
				if (!user || !user.isLpaUser || !user.lpaCode) {
					return null;
				}
				return await this.dbClient.appealCase.findUnique({
					where: {
						caseReference,
						LPACode: user.lpaCode
					},
					include: {
						Documents: DocumentsArgsPublishedOnly,
						ListedBuildings: true,
						AppealCaseLpaNotificationMethod: true,
						NeighbouringAddresses: true,
						ProcedureType: true,
						Events: true,
						AdvertDetails: true
					}
				});
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
