const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

/**
 * @typedef {import("@prisma/client").Prisma.AppealUserGetPayload<{include: {Appeals: {include: {Appeal: { include: {AppealCase: true }}}}}}>} UserWithAppeals
 * @typedef { 'Appellant' | 'Agent' | 'InterestedParty' | 'Rule6Party' } AppealToUserRoles
 * @typedef {import("@prisma/client").Appeal} Appeal
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
	 * @param {AppealToUserRoles} role
	 * @returns {Promise<UserWithAppeals|null>}
	 */
	async listAppealsForUser(userId, role) {
		let roleWhere = {};

		if (role === APPEAL_USER_ROLES.APPELLANT || role === APPEAL_USER_ROLES.AGENT) {
			// if appellant or agent, search for both as we don't know the role before we fetch the appeal
			// and access is equivalent
			roleWhere.OR = [{ role: APPEAL_USER_ROLES.APPELLANT }, { role: APPEAL_USER_ROLES.AGENT }];
		} else {
			roleWhere.role = role;
		}

		try {
			return await this.dbClient.appealUser.findUnique({
				where: {
					id: userId
				},
				select: {
					id: true,
					Appeals: {
						where: roleWhere,
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
											caseValidationDate: true,
											caseReference: true,
											appellantCommentsSubmittedDate: true,
											appellantProofsSubmittedDate: true,
											finalCommentsDueDate: true,
											proofsOfEvidenceDueDate: true,
											statementDueDate: true,
											caseWithdrawnDate: true,
											caseTransferredDate: true,
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

	/**
	 * Update an appeal
	 *
	 * @param {{ appealId: string, data: Appeal }} params
	 * @returns {Promise<Appeal|null>}
	 */
	async patch({ appealId, data }) {
		try {
			return await this.dbClient.appeal.update({
				where: {
					id: appealId
				},
				data: data
			});
		} catch (e) {
			if (e instanceof PrismaClientKnownRequestError) {
				if (e.code === 'P2023' || e.code === 'P2025') {
					// probably an invalid ID/GUID
					return null;
				}
			}
			throw e;
		}
	}
}

module.exports = { UserAppealsRepository };
