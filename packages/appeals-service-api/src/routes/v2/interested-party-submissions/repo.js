const { createPrismaClient } = require('#db-client');
const { PrismaClientValidationError } = require('@prisma/client/runtime/library');
const ApiError = require('#errors/apiError');

/**
 * @typedef {import('@prisma/client').InterestedPartySubmission} InterestedPartySubmission
 * @typedef {import("@prisma/client").Prisma.InterestedPartySubmissionCreateInput} IPSubmissionData
 */

class InterestedPartySubmissionRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Create interested party submission for a given case
	 *
	 * @param {IPSubmissionData} ipSubmissionData
	 * @returns {Promise<InterestedPartySubmission>}
	 */
	async createInterestedPartySubmission(ipSubmissionData) {
		try {
			return await this.dbClient.interestedPartySubmission.create({
				data: ipSubmissionData
			});
		} catch (e) {
			if (e instanceof PrismaClientValidationError) {
				throw ApiError.badRequest(e.message);
			}
			throw e;
		}
	}
}

module.exports = { InterestedPartySubmissionRepository };
