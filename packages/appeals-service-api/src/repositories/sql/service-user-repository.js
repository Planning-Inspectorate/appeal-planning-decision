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
}

module.exports = {
	ServiceUserType: {
		Agent: 'Agent',
		Appellant: 'Appellant'
	},
	ServiceUserRepository
};
