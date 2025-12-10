const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import('@pins/database/src/client/client').AppellantSubmission} AppellantSubmission
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
	 * @param {string} appellantSubmissionId
	 * @param {AddressData} addressData
	 * @returns {Promise<AppellantSubmission>}
	 */
	async createAddress(appellantSubmissionId, addressData) {
		const { addressLine1, addressLine2, townCity, postcode, county, fieldName, id } = addressData;

		if (id) {
			const exisitingAddress = await this.dbClient.submissionAddress.findUniqueOrThrow({
				where: { id: id }
			});

			return await this.dbClient.appellantSubmission.update({
				where: {
					id: appellantSubmissionId
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

		return await this.dbClient.appellantSubmission.update({
			where: {
				id: appellantSubmissionId
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
				SubmissionDocumentUpload: true,
				SubmissionAddress: true,
				SubmissionLinkedCase: true
			}
		});
	}

	/**
	 * Delete address
	 *
	 * @param {string} id
	 * @param {string} addressId
	 * @returns {Promise<AppellantSubmission>}
	 */
	async deleteAddress(id, addressId) {
		return await this.dbClient.appellantSubmission.update({
			where: {
				id
			},
			data: {
				SubmissionAddress: {
					delete: {
						id: addressId
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
}

module.exports = { SubmissionAddressRepository };
