const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import("@prisma/client").Prisma.AppealUserGetPayload<{include: {Appeals: {include: {Appeal: { include: {AppealCase: true }}}}}}>} UserWithAppeals
 */

class UserAppealsRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get appeals for the given user
	 *
	 * @param {string} userId
	 * @returns {Promise<UserWithAppeals|null>}
	 */
	async listAppealsForUser(userId) {
		try {
			return await this.dbClient.appealUser.findUnique({
				where: {
					id: userId
				},
				select: {
					id: true,
					Appeals: {
						select: {
							appealId: true,
							Appeal: {
								select: {
									id: true,
									legacyAppealSubmissionId: true,
									legacyAppealSubmissionDecisionDate: true,
									legacyAppealSubmissionState: true,
									AppealCase: {
										select: {
											id: true,
											appealTypeCode: true,
											caseDecisionOutcomeDate: true,
											caseDecisionOutcome: true,
											caseReference: true,
											appellantCommentsSubmitted: true,
											appellantsProofsSubmitted: true,
											finalCommentsDueDate: true,
											proofsOfEvidenceDueDate: true,
											caseWithdrawnDate: true,
											caseStatus: true,
											siteAddressLine1: true,
											siteAddressLine2: true,
											siteAddressTown: true,
											siteAddressPostcode: true
										}
									},
									AppellantSubmission: {
										select: {
											id: true,
											submitted: true,
											appealTypeCode: true,
											applicationDecisionDate: true,
											SubmissionAddress: true
										}
									}
								}
							}
						}
					}
				}
			});
		} catch (e) {
			if (e instanceof PrismaClientKnownRequestError) {
				if (e.code === 'P2023') {
					// probably an invalid ID/GUID
					return null;
				}
			}
			throw e;
		}
	}
}

module.exports = { UserAppealsRepository };
