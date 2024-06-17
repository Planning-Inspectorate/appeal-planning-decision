const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import("@prisma/client").ServiceUser} ServiceUser
 */

class ServiceUserRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get service user(s) by case reference and type
	 *
	 * @param {string} caseReference
	 * @param {string} serviceUserType
	 * @returns {Promise<ServiceUser[]|null>}
	 */
	getForCaseAndType(caseReference, serviceUserType) {
		return this.dbClient.serviceUser.findMany({
			where: {
				caseReference,
				serviceUserType
			}
		});
	}

	/**
	 * @param {Omit<ServiceUser, 'internalId'>} data
	 * @returns
	 */
	async put(data) {
		return this.dbClient.$transaction(async (tx) => {
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
