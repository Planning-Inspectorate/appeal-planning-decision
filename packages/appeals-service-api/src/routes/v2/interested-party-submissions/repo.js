const { createPrismaClient } = require('#db-client');
const { Prisma } = require('@pins/database/src/client/client');
const ApiError = require('#errors/apiError');

/**
 * @typedef {import('@pins/database/src/client/client').InterestedPartySubmission} InterestedPartySubmission
 * @typedef {import('@pins/database/src/client/client').Prisma.InterestedPartySubmissionCreateInput} IPSubmissionData
 * @typedef {InterestedPartySubmission & {AppealCase?: {LPACode: string, appealTypeCode: string | null}}} DetailedInterestedPartySubmission
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
	 * @returns {Promise<DetailedInterestedPartySubmission>}
	 */
	async createInterestedPartySubmission(ipSubmissionData) {
		try {
			return await this.dbClient.interestedPartySubmission.create({
				data: ipSubmissionData,
				include: {
					AppealCase: {
						select: {
							LPACode: true,
							appealTypeCode: true
						}
					},
					SubmissionDocumentUpload: true
				}
			});
		} catch (e) {
			if (e instanceof Prisma.PrismaClientValidationError) {
				throw ApiError.badRequest(e.message);
			}
			throw e;
		}
	}
}

module.exports = { InterestedPartySubmissionRepository };
