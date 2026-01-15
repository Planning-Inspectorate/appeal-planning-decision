const { createPrismaClient } = require('#db-client');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { SERVICE_USER_TYPE } = require('@planning-inspectorate/data-model');
const { AppealUserRepository } = require('#repositories/sql/appeal-user-repository');

/**
 * @typedef {import('@pins/database/src/client/client').ServiceUser} ServiceUser
 * @typedef {import('@pins/database/src/client/client').AppealToUser} AppealToUser
 * @typedef {Pick<ServiceUser, 'id' | 'emailAddress' | 'serviceUserType'>} BasicServiceUser
 * @typedef {Pick<ServiceUser, 'firstName' | 'lastName' | 'serviceUserType'>} ServiceUserName
 */

/** @type {(modelRole: string) => import('@pins/common/src/constants').APPEAL_USER_ROLES | null} */
const mapDataModelRoleToInternalRole = (modelRole) => {
	switch (modelRole) {
		case SERVICE_USER_TYPE.APPELLANT:
			return APPEAL_USER_ROLES.APPELLANT;
		case SERVICE_USER_TYPE.AGENT:
			return APPEAL_USER_ROLES.AGENT;
		case SERVICE_USER_TYPE.RULE_6_PARTY:
			return APPEAL_USER_ROLES.RULE_6_PARTY;
		default:
			return null;
	}
};

class ServiceUserRepository {
	/**
	 * @type {import('@pins/database/src/client/client').PrismaClient | import('@pins/database/src/client/client').Prisma.TransactionClient}
	 */
	dbClient;

	/**
	 * @param {import('@pins/database/src/client/client').PrismaClient | import('@pins/database/src/client/client').Prisma.TransactionClient} [client]
	 */
	constructor(client) {
		this.dbClient = client ?? createPrismaClient();
	}

	/**
	 * Get service user by ID
	 *
	 * @param {string} serviceUserId
	 * @returns {Promise<ServiceUser|null>}
	 */
	getById(serviceUserId) {
		return this.dbClient.serviceUser.findFirst({
			where: {
				id: serviceUserId
			}
		});
	}

	/**
	 * Get service user emails by array of ids
	 *
	 * @param {string[]} serviceUserIds
	 * @param {string} caseReference
	 * @returns {Promise<BasicServiceUser[]>}
	 */
	getServiceUsersWithEmailsByIdAndCaseReference(serviceUserIds, caseReference) {
		return this.dbClient.serviceUser.findMany({
			where: {
				AND: {
					id: {
						in: serviceUserIds
					},
					caseReference
				}
			},
			select: {
				id: true,
				emailAddress: true,
				serviceUserType: true
			}
		});
	}

	/**
	 * Get service user(s) by case reference and type
	 *
	 * @param {string} caseReference
	 * @param {Array.<string>} serviceUserType
	 * @returns {Promise<ServiceUser[]>}
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
				serviceUserType: true,
				id: true
			}
		});
	}

	/**
	 * Get service user by email, case reference and type
	 *
	 * @param {string} email
	 * @param {string} caseReference
	 * @param {Array.<string>} serviceUserType
	 * @returns {Promise<ServiceUser|null>}
	 */
	getForEmailCaseAndType(email, caseReference, serviceUserType) {
		return this.dbClient.serviceUser.findFirst({
			where: {
				OR: serviceUserType.map((type) => ({
					emailAddress: email,
					caseReference,
					serviceUserType: type
				}))
			},
			select: {
				emailAddress: true,
				serviceUserType: true,
				id: true,
				firstName: true,
				lastName: true,
				organisation: true
			}
		});
	}

	/**
	 * @param {Omit<ServiceUser, 'internalId'>} data
	 * @returns {Promise<ServiceUser>}
	 */
	async put(data) {
		const [appealUserResult, appealCase, serviceUser] = await Promise.all([
			data.emailAddress
				? this.dbClient.appealUser.findFirst({
						where: { email: data.emailAddress }
					})
				: Promise.resolve(null),

			this.dbClient.appealCase.findFirst({
				where: { caseReference: data.caseReference },
				select: { Appeal: { select: { id: true } } }
			}),

			this.dbClient.serviceUser.findFirst({
				where: { id: data.id, caseReference: data.caseReference, role: data.role }
			})
		]);

		let appealUser = appealUserResult;

		return this.dbClient.$transaction(async (tx) => {
			const appealUserRepository = new AppealUserRepository(tx);

			if (data.emailAddress) {
				if (!appealUser) {
					appealUser = await tx.appealUser.create({
						data: {
							email: data.emailAddress
						}
					});
				}

				const role = mapDataModelRoleToInternalRole(data.serviceUserType);
				if (!!role && !!appealCase) {
					await appealUserRepository.linkUserToAppeal(appealUser.id, appealCase.Appeal.id, role);
				}
			}

			if (serviceUser) {
				return await tx.serviceUser.update({
					where: {
						internalId: serviceUser.internalId
					},
					data
				});
			}

			return await tx.serviceUser.create({
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
