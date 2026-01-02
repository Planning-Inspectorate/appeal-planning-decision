const { createPrismaClient } = require('#db-client');
const { appellantSubmissionRelations } = require('../../repo');

/**
 * @typedef {import('@pins/database/src/client').AppellantSubmission} AppellantSubmission
 */

/**
 * @typedef {Object} AppealGroundData
 * @property {string} [id]
 * @property {string} groundName
 * @property {string} [facts]
 * @property {boolean} [addSupportingDocuments]
 */

class SubmissionAppealGroundRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Create submission appeal ground for a given submission
	 *
	 * @param {string} appellantSubmissionId
	 * @param {AppealGroundData} appealGroundData
	 * @returns {Promise<AppellantSubmission>}
	 */
	async createAppealGround(appellantSubmissionId, appealGroundData) {
		const { groundName, facts, addSupportingDocuments, id } = appealGroundData;

		if (id) {
			const existingAppealGround = await this.dbClient.submissionAppealGround.findUniqueOrThrow({
				where: { id: id }
			});

			await this.dbClient.submissionAppealGround.update({
				where: { id: existingAppealGround.id },
				data: {
					groundName,
					facts,
					addSupportingDocuments
				}
			});
		} else {
			await this.dbClient.submissionAppealGround.create({
				data: {
					appellantSubmissionId,
					groundName,
					facts,
					addSupportingDocuments
				}
			});
		}

		return await this.dbClient.appellantSubmission.findUniqueOrThrow({
			where: {
				id: appellantSubmissionId
			},
			include: appellantSubmissionRelations
		});
	}

	/**
	 * Delete appeal ground from a submission
	 * @param {string} id
	 * @param {string} appealGroundId
	 * @returns {Promise<AppellantSubmission>}
	 */
	async deleteAppealGround(id, appealGroundId) {
		await this.dbClient.submissionAppealGround.delete({
			where: {
				id: appealGroundId
			}
		});

		return await this.dbClient.appellantSubmission.findUniqueOrThrow({
			where: {
				id
			},
			include: appellantSubmissionRelations
		});
	}
}

module.exports = { SubmissionAppealGroundRepository };
