const { createPrismaClient } = require('#db-client');
// const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import('@prisma/client').SubmissionNeighbourAddress} SubmissionNeighbourAddress
 */

class SubmissionNeighbourAddressRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get all submission documents for given questionnaire
	 *
	 * @param {string} questionnaireId
	 * @returns {Promise<SubmissionNeighbourAddress[]|null>}
	 */

	async getNeighbourAddresses(questionnaireId) {
		return await this.dbClient.submissionNeighbourAddress.findMany({
			where: {
				questionnaireId
			}
		});
	}

	/**
	 * Create questionnaire for given appeal
	 *
	 * @param {object} addressData
	 * @returns {Promise<SubmissionNeighbourAddress|null>}
	 */
	async createNeighbourAddress(addressData) {
		const { questionnaireId, addressLine1, addressLine2, townCity, postcode } = addressData;

		return await this.dbClient.submissionNeighbourAddress.create({
			data: {
				questionnaireId,
				addressLine1,
				addressLine2,
				townCity,
				postcode
			}
		});
	}
}

module.exports = { SubmissionNeighbourAddressRepository };
