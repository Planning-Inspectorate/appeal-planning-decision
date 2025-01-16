const { createPrismaClient } = require('#db-client');
const { CASE_RELATION_TYPES } = require('@pins/common/src/database/data-static');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { subYears } = require('date-fns');
const logger = require('#lib/logger');
const ApiError = require('#errors/apiError');
const sanitizePostcode = require('#lib/sanitize-postcode');

/**
 * @typedef {import("@prisma/client").Appeal} Appeal
 * @typedef {import("@prisma/client").AppellantSubmission} AppellantSubmission
 * @typedef {import("@prisma/client").AppealCase} AppealCase
 * @typedef {import("@prisma/client").AppealCaseRelationship} AppealCaseRelationship
 * @typedef {import("@prisma/client").Prisma.AppealCaseCreateInput} AppealCaseCreateInput
 * @typedef {import("@prisma/client").Prisma.AppealCaseCreateWithoutAppealInput} AppealCaseCreateWithoutAppealInput
 * @typedef {import('@prisma/client').Prisma.AppealCaseFindManyArgs} AppealCaseFindManyArgs
 * @typedef {import('@prisma/client').Prisma.AppealCaseWhereInput} AppealCaseWhereInput
 * @typedef {import('@prisma/client').Prisma.AppealCaseCountArgs} AppealCaseCountArgs
 * @typedef {import('pins-data-model/src/schemas').AppealHASCase} AppealHASCase
 */

/**
 * get generic appeal data for dashboards
 * @type {import('@prisma/client').Prisma.AppealCaseSelect}
 */
const dashboardSelect = {
	id: true,
	appealId: true,
	caseReference: true,

	LPACode: true,
	appealTypeCode: true,
	caseStatus: true,
	caseProcedure: true,
	applicationReference: true,
	applicationDecision: true,
	applicationDate: true,
	applicationDecisionDate: true,
	caseSubmissionDueDate: true,

	siteAddressLine1: true,
	siteAddressLine2: true,
	siteAddressTown: true,
	siteAddressCounty: true,
	siteAddressPostcode: true,

	caseDecisionOutcome: true,

	caseSubmittedDate: true,
	caseCreatedDate: true,
	caseUpdatedDate: true,
	caseValidDate: true,
	caseValidationDate: true,
	caseExtensionDate: true,
	caseStartedDate: true,
	casePublishedDate: true,
	caseWithdrawnDate: true,
	caseTransferredDate: true,
	transferredCaseClosedDate: true,
	caseDecisionOutcomeDate: true,
	// caseDecisionPublishedDate: true, null for HAS
	caseCompletedDate: true,
	lpaQuestionnaireDueDate: true,
	lpaQuestionnaireSubmittedDate: true,
	lpaQuestionnaireCreatedDate: true,
	lpaQuestionnairePublishedDate: true,
	lpaQuestionnaireValidationOutcomeDate: true,
	statementDueDate: true,
	LPAStatementSubmitted: true,
	appellantStatementSubmitted: true,
	finalCommentsDueDate: true,
	appellantCommentsSubmitted: true,
	LPACommentsSubmitted: true,
	proofsOfEvidenceDueDate: true,
	appellantsProofsSubmitted: true,
	LPAProofsSubmitted: true,

	interestedPartyRepsDueDate: true
};

/** @type {import('@prisma/client').Prisma.AppealCase$DocumentsArgs} */
const DocumentsArgsPublishedOnly = {
	where: {
		publishedDocumentURI: { not: null }
	},
	select: {
		id: true,
		publishedDocumentURI: true,
		filename: true,
		documentType: true,
		datePublished: true,
		redacted: true
	}
};

/**
 * @param {String} caseProcessCode
 * @param {AppealHASCase} dataModel
 * @returns {AppealCaseCreate}
 */
const mapHASDataModelToAppealCase = (
	caseProcessCode,
	{
		caseType: _caseType,
		linkedCaseStatus: _linkedCaseStatus,
		leadCaseReference: _leadCaseReference,
		notificationMethod: _notificationMethod,
		nearbyCaseReferences: _nearbyCaseReferences,
		neighbouringSiteAddresses: _neighbouringSiteAddresses,
		affectedListedBuildingNumbers: _affectedListedBuildingNumbers,
		submissionId: _submissionId,
		caseStatus,
		caseDecisionOutcome,
		caseValidationOutcome,
		lpaQuestionnaireValidationOutcome,
		caseProcedure,
		lpaCode,
		caseSpecialisms,
		caseValidationInvalidDetails,
		caseValidationIncompleteDetails,
		lpaQuestionnaireValidationDetails,
		siteAccessDetails,
		siteSafetyDetails,
		siteAddressPostcode,
		...commonFields
	}
) => ({
	...commonFields,
	CaseStatus: { connect: { key: caseStatus } },
	CaseDecisionOutcome: caseDecisionOutcome ? { connect: { key: caseDecisionOutcome } } : undefined,
	CaseValidationOutcome: caseValidationOutcome
		? { connect: { key: caseValidationOutcome } }
		: undefined,
	LPAQuestionnaireValidationOutcome: lpaQuestionnaireValidationOutcome
		? { connect: { key: lpaQuestionnaireValidationOutcome } }
		: undefined,
	CaseType: { connect: { processCode: caseProcessCode } },
	ProcedureType: {
		connectOrCreate: {
			where: {
				key: caseProcedure
			},
			create: {
				key: caseProcedure,
				name: caseProcedure
			}
		}
	},
	siteAddressPostcode: siteAddressPostcode,
	siteAddressPostcodeSanitized: sanitizePostcode(siteAddressPostcode),
	LPACode: lpaCode,
	caseSpecialisms: caseSpecialisms ? JSON.stringify(caseSpecialisms) : null,
	caseValidationInvalidDetails: caseValidationInvalidDetails
		? JSON.stringify(caseValidationInvalidDetails)
		: null,
	caseValidationIncompleteDetails: caseValidationIncompleteDetails
		? JSON.stringify(caseValidationIncompleteDetails)
		: null,
	lpaQuestionnaireValidationDetails: lpaQuestionnaireValidationDetails
		? JSON.stringify(lpaQuestionnaireValidationDetails)
		: null,
	siteAccessDetails: siteAccessDetails ? JSON.stringify(siteAccessDetails) : null,
	siteSafetyDetails: siteSafetyDetails ? JSON.stringify(siteSafetyDetails) : null
});

class AppealCaseRepository {
	dbClient;

	constructor() {
		this.dbClient = createPrismaClient();
	}

	/**
	 * Get an appeal by case reference (aka appeal number)
	 * todo: inefficient - cache this and refresh on put?
	 * @param {object} opts
	 * @param {string} opts.caseReference
	 * @returns {Promise<AppealCase|null>}
	 */
	getByCaseReference({ caseReference }) {
		return this.dbClient.appealCase.findUnique({
			where: {
				caseReference,
				casePublishedDate: { not: null }
			},
			include: {
				Documents: DocumentsArgsPublishedOnly,
				AffectedListedBuildings: true,
				AppealCaseLpaNotificationMethod: true,
				NeighbouringAddresses: true,
				Events: true
			}
		});
	}

	/**
	 * Get all relations for an appeal
	 * @param {object} opts
	 * @param {string} opts.caseReference
	 * @returns {Promise<Array.<AppealCaseRelationship>|null>}
	 */
	getRelatedCases({ caseReference }) {
		return this.dbClient.appealCaseRelationship.findMany({
			where: {
				caseReference
			}
		});
	}

	/**
	 * @typedef {object} putAppealResult
	 * @property {AppealCase} appealCase
	 * @property {AppellantSubmission|null} appellantSubmission
	 * @property {boolean} exists
	 */

	/**
	 * Get an appeal by case reference (aka appeal number)
	 * @param {string} caseReference
	 * @param {string} caseProcessCode
	 * @param {AppealHASCase} data
	 * @returns {Promise<putAppealResult>}
	 */
	async putHASByCaseReference(caseReference, caseProcessCode, data) {
		const mappedData = mapHASDataModelToAppealCase(caseProcessCode, data);

		/** @type {putAppealResult} */
		let result = {
			appealCase: null,
			appellantSubmission: null,
			exists: true
		};

		result.exists = !!(await this.dbClient.appealCase.count({
			where: {
				caseReference
			}
		}));

		if (!result.exists && data.submissionId) {
			result.appellantSubmission = await this.dbClient.appellantSubmission.findFirst({
				where: {
					appealId: data.submissionId
				}
			});
		}

		result.appealCase = await this.dbClient.appealCase.upsert({
			create: {
				...mappedData,
				Appeal: data.submissionId ? { connect: { id: data.submissionId } } : { create: {} }
			},
			update: mappedData,
			where: {
				caseReference
			}
		});

		// case relations
		// nearby cases are referenced both ways
		// lead/child are only reference from child(1) to lead(2)
		await this.dbClient.$transaction(async (tx) => {
			// delete all relations that use this case
			await tx.appealCaseRelationship.deleteMany({
				where: {
					OR: [
						{
							caseReference: caseReference
						},
						{
							caseReference2: caseReference
						}
					]
				}
			});

			// add nearby references both ways
			if (data.nearbyCaseReferences?.length) {
				const direction1 = data.nearbyCaseReferences.map((nearby) => ({
					caseReference: caseReference,
					caseReference2: nearby
				}));
				const direction2 = data.nearbyCaseReferences.map((nearby) => ({
					caseReference: nearby,
					caseReference2: caseReference
				}));

				await tx.appealCaseRelationship.createMany({
					data: direction1.concat(direction2)
				});
			}

			// add lead case (only referenced from child(1) -> lead(2))
			if (data.leadCaseReference) {
				await tx.appealCaseRelationship.create({
					data: {
						caseReference,
						caseReference2: data.leadCaseReference,
						type: CASE_RELATION_TYPES.linked
					}
				});
			}
		});

		// neighbour addresses
		await this.dbClient.$transaction(async (tx) => {
			// delete all of the existing neighbouringAddresses
			await tx.neighbouringAddress.deleteMany({
				where: {
					caseReference: caseReference
				}
			});

			// add all
			if (data.neighbouringSiteAddresses?.length) {
				await tx.neighbouringAddress.createMany({
					data: data.neighbouringSiteAddresses.map((address) => ({
						caseReference,
						addressLine1: address.neighbouringSiteAddressLine1,
						addressLine2: address.neighbouringSiteAddressLine2,
						townCity: address.neighbouringSiteAddressTown,
						county: address.neighbouringSiteAddressCounty,
						postcode: address.neighbouringSiteAddressPostcode,
						postcodeSanitized: sanitizePostcode(address.neighbouringSiteAddressPostcode),
						siteAccessDetails: address.neighbouringSiteAccessDetails,
						siteSafetyDetails: address.neighbouringSiteSafetyDetails
					}))
				});
			}
		});

		// listed building
		await this.dbClient.$transaction(async (tx) => {
			// delete all of the existing listed buildings
			await tx.appealCaseListedBuilding.deleteMany({
				where: {
					caseReference: caseReference
				}
			});

			if (data.affectedListedBuildingNumbers?.length) {
				// upsert any listed buildings in case they don't already exist
				await Promise.all(
					data.affectedListedBuildingNumbers.map((reference) => {
						return tx.listedBuilding.upsert({
							create: { reference },
							update: {},
							where: {
								reference
							}
						});
					})
				);

				// delete existing listed buildings
				await tx.appealCaseListedBuilding.deleteMany({
					where: {
						caseReference
					}
				});

				// add the links to the listed buildings
				await tx.appealCaseListedBuilding.createMany({
					data: data.affectedListedBuildingNumbers.map((reference) => ({
						caseReference: caseReference,
						listedBuildingReference: reference
					}))
				});
			}
		});

		// notifications
		await this.dbClient.$transaction(async (tx) => {
			// delete all existing
			await tx.appealCaseLpaNotificationMethod.deleteMany({
				where: {
					caseReference
				}
			});

			if (data.notificationMethod?.length) {
				// add all notification methods
				await tx.appealCaseLpaNotificationMethod.createMany({
					data: data.notificationMethod.map((notification) => ({
						caseReference,
						lPANotificationMethodsKey: notification
					}))
				});
			}
		});

		return result;
	}

	/**
	 * List cases for an LPA
	 *
	 * @param {Object} options
	 * @param {string} options.lpaCode
	 * @param {boolean} options.decidedOnly - if true, only decided cases; else ONLY cases not decided
	 * @param {string} options.caseStatus
	 * @returns {Promise<AppealCase[]>}
	 */
	async listByLpaCode({ lpaCode, decidedOnly, caseStatus }) {
		/** @type {AppealCaseWhereInput[]}	*/
		const AND = [{ LPACode: lpaCode }];
		addDecidedClauseToQuery(AND, decidedOnly);
		if (caseStatus) {
			addCaseStatusToQuery(AND, caseStatus);
		}
		/** @type {AppealCaseFindManyArgs}	*/
		const query = {
			where: {
				AND
			},
			select: dashboardSelect
		};
		// todo: probably pagination
		return await this.dbClient.appealCase.findMany(query);
	}

	/**
	 * Count cases for an LPA
	 *
	 * @param {Object} options
	 * @param {string} options.lpaCode
	 * @param {boolean} options.decidedOnly - if true, only decided cases; else ONLY cases not decided
	 * @returns {Promise<number>}
	 */
	async countByLpaCode({ lpaCode, decidedOnly }) {
		/** @type {AppealCaseWhereInput[]}	*/
		const AND = [{ LPACode: lpaCode }];

		if (decidedOnly) {
			const fiveYearsAgo = subYears(new Date(), 5);
			AND.push({
				caseDecisionOutcomeDate: {
					gte: fiveYearsAgo
				}
			});
		}
		addDecidedClauseToQuery(AND, decidedOnly);
		/** @type {AppealCaseCountArgs}	*/
		const query = {
			where: {
				AND
			}
		};
		return await this.dbClient.appealCase.count(query);
	}

	/**
	 * List cases by postcode
	 *
	 * @param {Object} options
	 * @param {string} options.sanitizedPostcode
	 * @param {boolean} options.decidedOnly - if true, only decided cases; else ONLY cases not decided
	 * @returns {Promise<AppealCase[]>}
	 */
	async listByPostCode({ sanitizedPostcode, decidedOnly }) {
		/** @type {AppealCaseWhereInput[]}	*/
		const AND = [
			{ siteAddressPostcodeSanitized: { startsWith: sanitizedPostcode } },
			{ casePublishedDate: { not: null } }
		];
		addDecidedClauseToQuery(AND, decidedOnly);
		/** @type {AppealCaseFindManyArgs}	*/
		const query = {
			where: {
				AND
			},
			select: dashboardSelect
		};
		// todo: probably pagination
		return await this.dbClient.appealCase.findMany(query);
	}

	/**
	 * Retrieve email address of appellant or agent linked to appeal
	 * @param {string} caseReference
	 * @returns
	 */
	async getAppealUserEmailAddress(caseReference) {
		const result = await this.dbClient.appealCase.findFirst({
			where: {
				caseReference
			},
			select: {
				Appeal: {
					select: {
						Users: {
							where: {
								role: { in: [APPEAL_USER_ROLES.APPELLANT, APPEAL_USER_ROLES.AGENT] }
							},
							select: {
								AppealUser: {
									select: {
										email: true
									}
								}
							}
						}
					}
				}
			}
		});

		return result?.Appeal?.Users[0]?.AppealUser?.email;
	}

	/**
	 * @param {{ caseReference: string, userId: string }} params
	 */
	async appellantCanModifyCase({ caseReference, userId }) {
		try {
			await this.dbClient.appealCase.findUniqueOrThrow({
				where: {
					caseReference
				},
				select: {
					Appeal: {
						select: {
							id: true,
							Users: {
								where: {
									userId,
									role: { in: [APPEAL_USER_ROLES.APPELLANT, APPEAL_USER_ROLES.AGENT] }
								}
							}
						}
					}
				}
			});

			return true;
		} catch (err) {
			logger.error({ err }, 'invalid user access');
			throw ApiError.forbidden();
		}
	}

	/**
	 * @param {{ caseReference: string, userId: string }} params
	 */
	async rule6PartyCanModifyCase({ caseReference, userId }) {
		try {
			await this.dbClient.appealCase.findUniqueOrThrow({
				where: {
					caseReference
				},
				select: {
					Appeal: {
						select: {
							id: true,
							Users: {
								where: {
									userId,
									role: APPEAL_USER_ROLES.RULE_6_PARTY
								}
							}
						}
					}
				}
			});

			return true;
		} catch (err) {
			logger.error({ err }, 'invalid user access');
			throw ApiError.forbidden();
		}
	}
}

/**
 * Add a where clause to either filter by only decided or only not decided cases
 *
 * @param {AppealCaseWhereInput[]} whereArray
 * @param {boolean} decidedOnly - if true, only decided cases; else ONLY cases not decided
 */
function addDecidedClauseToQuery(whereArray, decidedOnly) {
	if (decidedOnly) {
		// either has decision date == decided
		whereArray.push({ caseDecisionOutcomeDate: { not: null } });
	} else {
		// or no decision date == not decided
		whereArray.push({ caseDecisionOutcomeDate: null });
	}
}

/**
 * Add a where clause to either filter by only decided or only not decided cases
 *
 * @param {AppealCaseWhereInput[]} whereArray
 * @param {string} caseStatus
 */
function addCaseStatusToQuery(whereArray, caseStatus) {
	whereArray.push({ caseStatus: caseStatus });
}

module.exports = { AppealCaseRepository, DocumentsArgsPublishedOnly };
