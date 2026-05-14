const { createPrismaClient } = require('#db-client');
const { Prisma } = require('@pins/database/src/client/client');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');

/**
 * @typedef {import('@pins/database/src/client/client').Prisma.AppealUserGetPayload<{include: {Appeals: {include: {Appeal: { include: {AppealCase: true }}}}}}>} UserWithAppeals
 * @typedef { 'Appellant' | 'Agent' | 'InterestedParty' | 'Rule6Party' } AppealToUserRoles
 * @typedef {import('@pins/database/src/client/client').Appeal} Appeal
 * @typedef {import('@pins/database/src/client/client').AppealCase} AppealCase
 * @typedef {import('@pins/database/src/client/client').AppellantSubmission} AppellantSubmission
 * @typedef {import('@pins/database/src/client/client').Prisma.AppealCreateInput} AppealCreateInput
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
					email: true,
					Appeals: {
						where: roleWhere,
						select: {
							id: true,
							appealId: true,
							role: true,
							userId: true,
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
											siteAddressPostcode: true,
											siteGridReferenceEasting: true,
											siteGridReferenceNorthing: true,
											// reps only needed for rule 6 ownership check
											...(role === APPEAL_USER_ROLES.RULE_6_PARTY
												? {
														Representations: {
															select: {
																id: true,
																representationType: true,
																serviceUserId: true,
																source: true,
																representationStatus: true,
																dateReceived: true
															}
														}
													}
												: {})
										}
									},
									AppellantSubmission: {
										select: {
											id: true,
											submitted: true,
											appealTypeCode: true,
											applicationDecisionDate: true,
											applicationDecision: true,
											siteAddress: true,
											SubmissionAddress: true,
											enforcementEffectiveDate: true,
											hasContactedPlanningInspectorate: true,
											isListedBuilding: true
										}
									}
								}
							}
						}
					}
				}
			});
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2023') {
					// probably an invalid ID/GUID
					return null;
				}
			}
			throw e;
		}
	}

	/**
	 * Get's a draft appeal
	 *
	 * @param {string} userId
	 * @param {string} appealId
	 * @returns {Promise<UserWithAppeals|null>}
	 */
	async getAppealDraft(userId, appealId) {
		try {
			return this.dbClient.appealUser.findUnique({
				where: {
					id: userId
				},
				select: {
					Appeals: {
						where: {
							AND: {
								appealId: appealId,
								OR: [{ role: APPEAL_USER_ROLES.APPELLANT }, { role: APPEAL_USER_ROLES.AGENT }]
							}
						},
						select: {
							Appeal: {
								select: {
									id: true,
									legacyAppealSubmissionId: true,
									legacyAppealSubmissionDecisionDate: true,
									legacyAppealSubmissionState: true,
									AppellantSubmission: {
										select: {
											id: true,
											submitted: true,
											appealTypeCode: true,
											applicationDecisionDate: true,
											enforcementEffectiveDate: true
										}
									}
								}
							}
						}
					}
				}
			});
		} catch (e) {
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
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
			if (e instanceof Prisma.PrismaClientKnownRequestError) {
				if (e.code === 'P2023' || e.code === 'P2025') {
					// probably an invalid ID/GUID
					return null;
				}
			}
			throw e;
		}
	}

	/**
	 * create an appeal
	 *
	 * @param {{ data: AppealCreateInput }} params
	 * @returns {Promise<Appeal>}
	 */
	async create({ data }) {
		return await this.dbClient.appeal.create({
			data
		});
	}
}

module.exports = { UserAppealsRepository };
