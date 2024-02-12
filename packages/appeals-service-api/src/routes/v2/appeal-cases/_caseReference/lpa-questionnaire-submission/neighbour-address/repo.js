const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import('@prisma/client').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 */

/**
 * @typedef {Object} NeighbourAddressData
 * @property {string} addressLine1
 * @property {string} addressLine2
 * @property {string} townCity
 * @property {string} postcode
 */

class SubmissionNeighbourAddressRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Create submission neighbour address for a given questionnaire
	 *
	 * @param {string} caseReference
	 * @param {NeighbourAddressData} addressData
	 * @returns {Promise<LPAQuestionnaireSubmission>}
	 */
	async createNeighbourAddress(caseReference, addressData) {
		const { addressLine1, addressLine2, townCity, postcode } = addressData;

		return await this.dbClient.lPAQuestionnaireSubmission.update({
			where: {
				appealCaseReference: caseReference
			},
			data: {
				SubmissionNeighbourAddress: {
					create: {
						addressLine1,
						addressLine2,
						townCity,
						postcode
					}
				}
			},
			include: {
				AppealCase: {
					select: {
						LPACode: true
					}
				},
				SubmissionDocumentUpload: true,
				SubmissionNeighbourAddress: true
			}
		});
	}
}

module.exports = { SubmissionNeighbourAddressRepository };
