const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import('@pins/database/src/client').LPAQuestionnaireSubmission} LPAQuestionnaireSubmission
 */

/**
 * @typedef {Object} AddressData
 * @property {string} [id]
 * @property {string} addressLine1
 * @property {string} addressLine2
 * @property {string} townCity
 * @property {string} postcode
 * @property {string} county
 * @property {string} fieldName
 */

class SubmissionAddressRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Create submission address for a given questionnaire
	 *
	 * @param {string} caseReference
	 * @param {AddressData} addressData
	 * @returns {Promise<LPAQuestionnaireSubmission>}
	 */
	async createAddress(caseReference, addressData) {
		const { addressLine1, addressLine2, townCity, postcode, county, fieldName, id } = addressData;

		if (id) {
			const exisitingAddress = await this.dbClient.submissionAddress.findUniqueOrThrow({
				where: { id: id }
			});

			return await this.dbClient.lPAQuestionnaireSubmission.update({
				where: {
					appealCaseReference: caseReference
				},
				data: {
					SubmissionAddress: {
						update: {
							where: { id: exisitingAddress.id },
							data: {
								addressLine1,
								addressLine2,
								townCity,
								postcode,
								county,
								fieldName
							}
						}
					}
				},
				include: {
					SubmissionDocumentUpload: true,
					SubmissionAddress: true,
					SubmissionLinkedCase: true
				}
			});
		}

		return await this.dbClient.lPAQuestionnaireSubmission.update({
			where: {
				appealCaseReference: caseReference
			},
			data: {
				SubmissionAddress: {
					create: {
						addressLine1,
						addressLine2,
						townCity,
						postcode,
						county,
						fieldName
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
				SubmissionAddress: true,
				SubmissionLinkedCase: true,
				SubmissionListedBuilding: true
			}
		});
	}

	/**
	 * Delete address
	 *
	 * @param {string} caseReference
	 * @param {string} addressId
	 * @returns {Promise<LPAQuestionnaireSubmission>}
	 */
	async deleteAddress(caseReference, addressId) {
		return await this.dbClient.lPAQuestionnaireSubmission.update({
			where: {
				appealCaseReference: caseReference
			},
			data: {
				SubmissionAddress: {
					delete: {
						id: addressId
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
				SubmissionAddress: true,
				SubmissionLinkedCase: true,
				SubmissionListedBuilding: true
			}
		});
	}
}

module.exports = { SubmissionAddressRepository };
