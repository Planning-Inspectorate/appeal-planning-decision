const { createPrismaClient } = require('#db-client');
const { appellantSubmissionRelations } = require('../../repo');

/**
 * @typedef {import('@pins/database/src/client/client').AppellantSubmission} AppellantSubmission
 */

/**
 * @typedef {Object} IndividualData
 * @property {string} [id]
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} fieldName
 * @property {string} [interestInAppealLand]
 * @property {string} [interestInAppealLand_interestInAppealLandDetails]
 * @property {boolean} [hasPermissionToUseLand]
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
		const {
			firstName,
			lastName,
			fieldName,
			id,
			interestInAppealLand,
			interestInAppealLand_interestInAppealLandDetails,
			hasPermissionToUseLand
		} = individualData;

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
								fieldName,
								interestInAppealLand,
								interestInAppealLand_interestInAppealLandDetails,
								hasPermissionToUseLand
							}
						}
					}
				},
				include: appellantSubmissionRelations
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
						fieldName,
						interestInAppealLand,
						interestInAppealLand_interestInAppealLandDetails,
						hasPermissionToUseLand
					}
				}
			},
			include: appellantSubmissionRelations
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
			include: appellantSubmissionRelations
		});
	}
}

module.exports = { SubmissionIndividualRepository };
