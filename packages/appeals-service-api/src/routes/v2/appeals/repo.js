const { createPrismaClient } = require('#db-client');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime/library');

/**
 * @typedef {import("@prisma/client").Prisma.AppealUserGetPayload<{include: {Appeals: {include: {Appeal: { include: {AppealCase: true }}}}}}>} UserWithAppeals
 */

// const caseDashboardSelect = {
// 	id: true,
// 	appealId: true,
// 	caseReference: true,

// 	LPACode: true,
// 	appealTypeCode: true,
// 	caseStatus: true,
// 	caseProcedure: true,
// 	applicationReference: true,
// 	applicationDecision: true,
// 	applicationDate: true,
// 	applicationDecisionDate: true,
// 	caseSubmissionDueDate: true,

// 	siteAddressLine1: true,
// 	siteAddressLine2: true,
// 	siteAddressTown: true,
// 	siteAddressCounty: true,
// 	siteAddressPostcode: true,

// 	caseDecisionOutcome: true,

// 	caseSubmittedDate: true,
// 	caseCreatedDate: true,
// 	caseUpdatedDate: true,
// 	caseValidDate: true,
// 	caseValidationDate: true,
// 	caseExtensionDate: true,
// 	caseStartedDate: true,
// 	casePublishedDate: true,
// 	caseWithdrawnDate: true,
// 	caseTransferredDate: true,
// 	transferredCaseClosedDate: true,
// 	caseDecisionOutcomeDate: true,
// 	caseDecisionPublishedDate: true,
// 	caseCompletedDate: true,
// 	lpaQuestionnaireDueDate: true,
// 	lpaQuestionnaireSubmittedDate: true,
// 	lpaQuestionnaireCreatedDate: true,
// 	lpaQuestionnairePublishedDate: true,
// 	lpaQuestionnaireValidationOutcomeDate: true,

// 	interestedPartyRepsDueDate: true
// };

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
	 */ // todo: select only needed fields
	async listAppealsForUser(userId) {
		try {
			return await this.dbClient.appealUser.findUnique({
				where: {
					id: userId
				},
				include: {
					Appeals: {
						include: {
							Appeal: {
								include: {
									AppealCase: true, //{ select: caseDashboardSelect },
									AppellantSubmission: {
										include: {
											// submitted: true,
											// appealTypeCode: true,
											// id: true,
											// onApplicationDate: true,
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
