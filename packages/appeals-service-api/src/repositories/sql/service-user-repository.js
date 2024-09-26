const { createPrismaClient } = require('#db-client');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { SERVICE_USER_TYPE } = require('pins-data-model');

/**
 * @typedef {import("@prisma/client").ServiceUser} ServiceUser
 * @typedef {import("@prisma/client").AppealToUser} AppealToUser
 */

/** @type {(modelRole: string) => 'Appellant' | 'Agent' | null} */
const mapDataModelRoleToInternalRole = (modelRole) => {
	switch (modelRole) {
		case SERVICE_USER_TYPE.APPELLANT:
			return APPEAL_USER_ROLES.APPELLANT;
		case SERVICE_USER_TYPE.AGENT:
			return APPEAL_USER_ROLES.AGENT;
		default:
			return null;
	}
};

class ServiceUserRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get service user by id
	 *
	 * @param {string} serviceUserId
	 * @param {string} caseReference
	 * @returns {Promise<ServiceUser|null>}
	 */
	getServiceUserByIdAndCaseReference(serviceUserId, caseReference) {
		return this.dbClient.serviceUser.findFirst({
			where: {
				id: serviceUserId,
				caseReference
			},
			select: {
				firstName: true,
				lastName: true
			}
		});
	}

	/**
	 * Get service user(s) by case reference and type
	 *
	 * @param {string} caseReference
	 * @param {Array.<string>} serviceUserType
	 * @returns {Promise<ServiceUser[]|null>}
	 */
	getForCaseAndType(caseReference, serviceUserType) {
		return this.dbClient.serviceUser.findMany({
			where: {
				OR: serviceUserType.map((type) => ({
					caseReference,
					serviceUserType: type
				}))
			},
			select: {
				firstName: true,
				lastName: true,
				emailAddress: true,
				organisation: true,
				telephoneNumber: true,
				serviceUserType: true
			}
		});
	}

	/**
	 * @param {Omit<ServiceUser, 'internalId'>} data
	 * @returns {Promise<ServiceUser>}
	 */
	async put(data) {
		return this.dbClient.$transaction(async (tx) => {
			/** @type {import('@prisma/client').AppealUser | null} */
			let appealUser = null;
			if (data.emailAddress) {
				appealUser = await tx.appealUser.findFirst({
					where: {
						email: data.emailAddress
					}
				});

				if (!appealUser) {
					appealUser = await tx.appealUser.create({
						data: {
							email: data.emailAddress,
							serviceUserId: data.id
						}
					});
				} else {
					appealUser = await tx.appealUser.update({
						where: {
							email: data.emailAddress
						},
						data: {
							serviceUserId: data.id
						}
					});
				}
			}

			const role = mapDataModelRoleToInternalRole(data.serviceUserType);
			if (role && appealUser) {
				const appealCase = await tx.appealCase.findFirst({
					where: {
						caseReference: data.caseReference
					},
					select: {
						Appeal: {
							select: {
								id: true
							}
						}
					}
				});

				if (appealCase) {
					await tx.appealToUser.upsert({
						where: {
							appealId_userId: {
								appealId: appealCase.Appeal.id,
								userId: appealUser.id
							}
						},
						create: {
							appealId: appealCase.Appeal.id,
							userId: appealUser.id,
							role
						},
						update: {
							appealId: appealCase.Appeal.id,
							userId: appealUser.id,
							role
						}
					});
				}
			}

			const { internalId } =
				(await tx.serviceUser.findFirst({
					where: {
						id: data.id
					}
				})) || {};

			if (internalId) {
				return await this.dbClient.serviceUser.update({
					where: {
						internalId
					},
					data
				});
			}

			return await this.dbClient.serviceUser.create({
				data
			});
		});
	}
}

module.exports = {
	ServiceUserType: {
		Agent: 'Agent',
		Appellant: 'Appellant'
	},
	ServiceUserRepository
};
