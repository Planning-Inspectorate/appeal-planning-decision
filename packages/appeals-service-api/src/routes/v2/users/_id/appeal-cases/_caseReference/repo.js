const { createPrismaClient } = require('#db-client');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { Prisma } = require('@pins/database/src/client/client');
const { DocumentsArgsPublishedOnly } = require('../../../../appeal-cases/repo');
/**
 * @typedef {import('@pins/database/src/client/client').AppealCase} AppealCase
 */

module.exports = class Repo {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get appeals for the given user
	 *
	 * @param {{ caseReference: string, userId: string, appealUserRoles: Array<import('@pins/database/src/client/client').AppealToUser> }} params
	 * @returns {Promise<AppealCase|null>}
	 */
	async get({ caseReference, appealUserRoles, userId }) {
		try {
			/**
			 * @type {import('@pins/database/src/client/client').Prisma.AppealToUserWhereInput}
			 */
			const where = {};
			const roles = appealUserRoles.map(({ role }) => role);
			where.OR = roles.map((role) => ({ userId, role }));
			const hasAppellantRole = roles.includes(APPEAL_USER_ROLES.APPELLANT);
			const hasAgentRole = roles.includes(APPEAL_USER_ROLES.AGENT);

			// Appellant and agent have equivalent access, so include the other role when either is present.
			if (hasAppellantRole && !hasAgentRole) {
				where.OR.push({ userId, role: APPEAL_USER_ROLES.AGENT });
			}
			if (hasAgentRole && !hasAppellantRole) {
				where.OR.push({ userId, role: APPEAL_USER_ROLES.APPELLANT });
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
					AdvertDetails: true,
					EnforcementAppealGroundsDetails: true
				}
			});
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
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
						AdvertDetails: true,
						EnforcementAppealGroundsDetails: true
					}
				});
			});
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2023') {
					// probably an invalid ID/GUID
					return null;
				}
			}
			throw e;
		}
	}
};
