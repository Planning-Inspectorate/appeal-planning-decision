const { createPrismaClient } = require('#db-client');
const { appellantSubmissionRelations } = require('../../repo');

/**
 * @typedef {import('@pins/database/src/client').AppellantSubmission} AppellantSubmission
 * @typedef {import('@pins/database/src/client').Prisma.SubmissionLinkedCaseCreateInput} LinkedCaseData
 */

class LinkedCaseRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Create submission address for a given appeal submission
	 *
	 * @param {string} id
	 * @param {LinkedCaseData} linkedCase
	 * @returns {Promise<AppellantSubmission>}
	 */
	async createLinkedCase(id, linkedCase) {
		return await this.dbClient.appellantSubmission.update({
			where: {
				id
			},
			data: {
				SubmissionLinkedCase: {
					create: {
						...linkedCase
					}
				}
			},
			include: appellantSubmissionRelations
		});
	}

	/**
	 * Delete address
	 *
	 * @param {string} id
	 * @param {string} linkedCaseId
	 * @returns {Promise<AppellantSubmission>}
	 */
	async deleteLinkedCase(id, linkedCaseId) {
		return await this.dbClient.appellantSubmission.update({
			where: {
				id: id
			},
			data: {
				SubmissionLinkedCase: {
					delete: {
						id: linkedCaseId
					}
				}
			},
			include: appellantSubmissionRelations
		});
	}
}

module.exports = { LinkedCaseRepository };
