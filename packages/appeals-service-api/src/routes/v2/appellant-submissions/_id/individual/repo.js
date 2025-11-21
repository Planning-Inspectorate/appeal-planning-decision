const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import('@pins/database/src/client').AppellantSubmission} AppellantSubmission
 */

/**
 * @typedef {Object} IndividualData
 * @property {string} [id]
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} fieldName
 */

class SubmissionIndividualRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Create submission individual for a given submission
	 *
	 * @param {string} appellantSubmissionId
	 * @param {IndividualData} individualData
	 * @returns {Promise<AppellantSubmission>}
	 */
	async createIndividual(appellantSubmissionId, individualData) {
		const { firstName, lastName, fieldName, id } = individualData;

		if (id) {
			const existingIndividual = await this.dbClient.submissionIndividual.findUniqueOrThrow({
				where: { id: id }
			});

			return await this.dbClient.appellantSubmission.update({
				where: {
					id: appellantSubmissionId
				},
				data: {
					SubmissionIndividual: {
						update: {
							where: { id: existingIndividual.id },
							data: {
								firstName,
								lastName,
								fieldName
							}
						}
					}
				},
				include: {
					SubmissionDocumentUpload: true,
					SubmissionAddress: true,
					SubmissionLinkedCase: true,
					SubmissionIndividual: true
				}
			});
		}

		return await this.dbClient.appellantSubmission.update({
			where: {
				id: appellantSubmissionId
			},
			data: {
				SubmissionIndividual: {
					create: {
						firstName,
						lastName,
						fieldName
					}
				}
			},
			include: {
				SubmissionDocumentUpload: true,
				SubmissionAddress: true,
				SubmissionLinkedCase: true,
				SubmissionIndividual: true
			}
		});
	}

	/**
	 * Delete named individual
	 * @param {string} id
	 * @param {string} individualId
	 * @returns {Promise<AppellantSubmission>}
	 */
	async deleteIndividual(id, individualId) {
		return await this.dbClient.appellantSubmission.update({
			where: {
				id
			},
			data: {
				SubmissionIndividual: {
					delete: {
						id: individualId
					}
				}
			},
			include: {
				SubmissionDocumentUpload: true,
				SubmissionAddress: true,
				SubmissionLinkedCase: true,
				SubmissionIndividual: true
			}
		});
	}
}

module.exports = { SubmissionIndividualRepository };
