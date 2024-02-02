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

	// /**
	//  *
	//  * @param {*} caseReference
	//  * @param {*} data
	//  * @returns
	//  */
	// async patchSubmissionDocument(caseReference, data) {
	// 	return await this.dbClient.submissionDocumentUpload.update({
	// 		where: {
	// 			appealCaseReference: caseReference
	// 		},
	// 		data
	// 	});
	// }
}

module.exports = { SubmissionNeighbourAddressRepository };
