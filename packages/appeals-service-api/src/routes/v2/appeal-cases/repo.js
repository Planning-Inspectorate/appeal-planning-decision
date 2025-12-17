const { createPrismaClient } = require('#db-client');
const {
	CASE_RELATION_TYPES,
	LISTED_RELATION_TYPES
} = require('@pins/common/src/database/data-static');
const { APPEAL_USER_ROLES } = require('@pins/common/src/constants');
const { subYears } = require('date-fns');
const logger = require('#lib/logger.js');
const ApiError = require('#errors/apiError');
const sanitizePostcode = require('#lib/sanitize-postcode.js');

/**
 * @typedef {import('@pins/database/src/client/client').Appeal} Appeal
 * @typedef {import('@pins/database/src/client/client').AppealToUser} AppealToUser
 * @typedef {import('@pins/database/src/client/client').AppellantSubmission} AppellantSubmission
 * @typedef {import('@pins/database/src/client/client').SubmissionLinkedCase} SubmissionLinkedCase
 * @typedef {import('@pins/database/src/client/client').AppealCase} AppealCase
 * @typedef {import('@pins/database/src/client/client').AppealCaseRelationship} AppealCaseRelationship
 * @typedef {import('@pins/database/src/client/client').Prisma.AppealCaseCreateInput} AppealCaseCreateInput
 * @typedef {import('@pins/database/src/client/client').Prisma.AppealCaseFindManyArgs} AppealCaseFindManyArgs
 * @typedef {import('@pins/database/src/client/client').Prisma.AppealCaseWhereInput} AppealCaseWhereInput
 * @typedef {import('@pins/database/src/client/client').Prisma.AppealCaseCountArgs} AppealCaseCountArgs
 * @typedef {(import('@planning-inspectorate/data-model/src/schemas').AppealHASCase['neighbouringSiteAddresses'])} NeighbouringSiteAddresses
 * @typedef {{childCaseReference: string, leadCaseReference: string}} LinkedCase
 */

/**
 * get generic appeal data for dashboards
 * @type {import('@pins/database/src/client/client').Prisma.AppealCaseSelect}
 */
const dashboardSelect = {
	id: true,
	appealId: true,
	caseReference: true,

	// basic appeal details
	LPACode: true,
	appealTypeCode: true,
	caseStatus: true,
	caseProcedure: true,
	applicationReference: true,
	applicationDecision: true,
	applicationDate: true,
	applicationDecisionDate: true,

	// site address
	siteAddressLine1: true,
	siteAddressLine2: true,
	siteAddressTown: true,
	siteAddressCounty: true,
	siteAddressPostcode: true,
	siteGridReferenceEasting: true,
	siteGridReferenceNorthing: true,

	// outcome
	caseDecisionOutcome: true,

	// case dates
	caseSubmittedDate: true,
	caseValidDate: true,
	caseValidationDate: true,
	caseStartedDate: true,
	casePublishedDate: true,
	caseWithdrawnDate: true,
	caseTransferredDate: true,
	caseDecisionOutcomeDate: true,

	// lpaq dates
	lpaQuestionnaireDueDate: true,
	lpaQuestionnaireSubmittedDate: true,
	lpaQuestionnairePublishedDate: true,

	// statements dates
	statementDueDate: true,
	appellantStatementSubmittedDate: true,
	LPAStatementSubmittedDate: true,

	// final comments dates
	finalCommentsDueDate: true,
	appellantCommentsSubmittedDate: true,
	LPACommentsSubmittedDate: true,

	// proofs of evidence dates
	proofsOfEvidenceDueDate: true,
	appellantProofsSubmittedDate: true,
	LPAProofsSubmittedDate: true,

	// IP dates
	interestedPartyRepsDueDate: true
};

/** @type {import('@pins/database/src/client/client').Prisma.AppealCase$DocumentsArgs} */
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
		redacted: true,
		virusCheckStatus: true,
		published: true
	}
};

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
				ListedBuildings: true,
				AppealCaseLpaNotificationMethod: true,
				NeighbouringAddresses: true,
				Events: true,
				AdvertDetails: true
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
	 * Get all linked cases for appeals, rename fields in return objects for each of use
	 * Uses distinct field to remove duplicates - each child ('caseReference') should only have one lead ('caseReference2')
	 * @param {string[] | string} caseReferences
	 * @returns {Promise<Array.<LinkedCase>|null>}
	 */
	async getLinkedCases(caseReferences) {
		const referenceArray = Array.isArray(caseReferences) ? caseReferences : [caseReferences];
		const linkedCaseRelationships = await this.dbClient.appealCaseRelationship.findMany({
			where: {
				AND: [
					{
						type: CASE_RELATION_TYPES.linked
					},
					{
						OR: [
							{
								caseReference: {
									in: referenceArray
								}
							},
							{
								caseReference2: {
									in: referenceArray
								}
							}
						]
					}
				]
			},
			distinct: ['caseReference'],
			select: {
				caseReference: true,
				caseReference2: true
			}
		});

		return linkedCaseRelationships.map((linkedCaseData) => ({
			childCaseReference: linkedCaseData.caseReference,
			leadCaseReference: linkedCaseData.caseReference2
		}));
	}

	/**
	 * @param {object} options
	 * @param {string} options.appealId
	 * @returns {Promise<{id: string, AppellantSubmission: { id: string} | null, AppealCase: { LPAQuestionnaireSubmission: { id: string} | null  } | null } | null>}
	 */
	async getSubmissionsForAppeal({ appealId }) {
		return this.dbClient.appeal.findFirst({
			where: {
				id: appealId
			},
			select: {
				id: true,
				AppealCase: {
					select: {
						LPAQuestionnaireSubmission: {
							select: {
								id: true
							}
						}
					}
				},
				AppellantSubmission: {
					select: {
						id: true
					}
				}
			}
		});
	}

	/**
	 * @param {object} options
	 * @param {string|null} [options.appealSubmissionId]
	 * @param {string|null} [options.lpaQuestionnaireSubmissionId]
	 * @returns {Promise<SubmissionLinkedCase[]|null>}
	 */
	async getSubmissionLinkedCasesForAppeal({ appealSubmissionId, lpaQuestionnaireSubmissionId }) {
		const lookup = [];
		if (appealSubmissionId) lookup.push({ appellantSubmissionId: appealSubmissionId });
		if (lpaQuestionnaireSubmissionId)
			lookup.push({ lPAQuestionnaireSubmissionId: lpaQuestionnaireSubmissionId });
		if (!lookup.length) return null;

		return this.dbClient.submissionLinkedCase.findMany({
			where: {
				OR: lookup
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
	 * Upsert an appeal by case reference (aka appeal number)
	 * @param {Object} params
	 * @param {string} params.caseReference
	 * @param {string|null|undefined} [params.submissionId]
	 * @param {Omit<AppealCaseCreateInput, 'Appeal'>} params.mappedData
	 * @returns {Promise<putAppealResult>}
	 */
	async putByCaseReference({ caseReference, submissionId, mappedData }) {
		const exists = !!(await this.dbClient.appealCase.count({
			where: {
				caseReference
			}
		}));

		/** @type {AppellantSubmission|null} */
		let appellantSubmission = null;
		if (!exists && submissionId) {
			appellantSubmission = await this.dbClient.appellantSubmission.findFirst({
				where: {
					appealId: submissionId
				}
			});
		}

		const appealCase = await this.dbClient.appealCase.upsert({
			create: {
				...mappedData,
				Appeal: submissionId ? { connect: { id: submissionId } } : { create: {} }
			},
			update: mappedData,
			where: {
				caseReference
			}
		});

		return {
			appealCase,
			appellantSubmission,
			exists
		};
	}

	/**
	 * @typedef AppealRelations
	 * @property {import('@planning-inspectorate/data-model/src/schemas').AppealS78Case['leadCaseReference']} [leadCaseReference]
	 * @property {import('@planning-inspectorate/data-model/src/schemas').AppealS78Case['nearbyCaseReferences']} [nearbyCaseReferences]
	 * @property {import('@planning-inspectorate/data-model/src/schemas').AppealS78Case['neighbouringSiteAddresses']} [neighbouringSiteAddresses]
	 * @property {import('@planning-inspectorate/data-model/src/schemas').AppealS78Case['affectedListedBuildingNumbers']} [affectedListedBuildingNumbers]
	 * @property {import('@planning-inspectorate/data-model/src/schemas').AppealS78Case['changedListedBuildingNumbers']} [changedListedBuildingNumbers]
	 * @property {import('@planning-inspectorate/data-model/src/schemas').AppealS78Case['notificationMethod']} [notificationMethod]
	 * @property {import('@planning-inspectorate/data-model/src/schemas').AppealS78Case['advertDetails']} [advertDetails]
	 */
	/**
	 * Upsert an appeal's relations by case reference (aka appeal number)
	 * @param {string} caseReference
	 * @param {AppealRelations} data
	 * @returns {Promise<void>}
	 */
	async putRelationsByCaseReference(
		caseReference,
		{
			leadCaseReference,
			nearbyCaseReferences,
			neighbouringSiteAddresses,
			affectedListedBuildingNumbers,
			changedListedBuildingNumbers,
			notificationMethod,
			advertDetails
		}
	) {
		// case relations
		// nearby cases are referenced both ways
		// lead/child are only reference from child(1) to lead(2)
		await this.dbClient.$transaction(async (tx) => {
			// delete all relations that use this case

			// delete nearby relations
			await tx.appealCaseRelationship.deleteMany({
				where: {
					AND: [
						{
							OR: [
								{
									caseReference: caseReference
								},
								{
									caseReference2: caseReference
								}
							]
						},
						{
							type: CASE_RELATION_TYPES.nearby
						}
					]
				}
			});

			// delete linked appeals where case is a child
			// should only be one but for safety delete many
			await tx.appealCaseRelationship.deleteMany({
				where: {
					AND: [
						{
							caseReference: caseReference
						},
						{
							type: CASE_RELATION_TYPES.linked
						}
					]
				}
			});

			// add nearby references both ways
			if (nearbyCaseReferences?.length) {
				const direction1 = nearbyCaseReferences.map((nearby) => ({
					caseReference: caseReference,
					caseReference2: nearby
				}));
				const direction2 = nearbyCaseReferences.map((nearby) => ({
					caseReference: nearby,
					caseReference2: caseReference
				}));

				await tx.appealCaseRelationship.createMany({
					data: direction1.concat(direction2)
				});
			}

			// add lead case (only referenced from child(1) -> lead(2))
			if (leadCaseReference && caseReference !== leadCaseReference) {
				await tx.appealCaseRelationship.create({
					data: {
						caseReference,
						caseReference2: leadCaseReference,
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
			if (neighbouringSiteAddresses?.length) {
				await tx.neighbouringAddress.createMany({
					data: neighbouringSiteAddresses.map((address) => ({
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

			const combinedListedBuildings = [
				...(affectedListedBuildingNumbers || []),
				...(changedListedBuildingNumbers || [])
			];

			if (combinedListedBuildings.length) {
				// upsert any listed buildings in case they don't already exist
				await Promise.all(
					combinedListedBuildings.map((reference) => {
						return tx.listedBuilding.upsert({
							create: { reference },
							update: {},
							where: {
								reference
							}
						});
					})
				);

				if (affectedListedBuildingNumbers?.length) {
					// add the links to affected listed buildings
					await tx.appealCaseListedBuilding.createMany({
						data: affectedListedBuildingNumbers.map((reference) => ({
							caseReference: caseReference,
							listedBuildingReference: reference,
							type: LISTED_RELATION_TYPES.affected
						}))
					});
				}

				if (changedListedBuildingNumbers?.length) {
					// add the links to changed listed buildings
					await tx.appealCaseListedBuilding.createMany({
						data: changedListedBuildingNumbers.map((reference) => ({
							caseReference: caseReference,
							listedBuildingReference: reference,
							type: LISTED_RELATION_TYPES.changed
						}))
					});
				}
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

			if (notificationMethod?.length) {
				// add all notification methods
				await tx.appealCaseLpaNotificationMethod.createMany({
					data: notificationMethod.map((notification) => ({
						caseReference,
						lPANotificationMethodsKey: notification
					}))
				});
			}
		});

		// advert details
		await this.dbClient.$transaction(async (tx) => {
			// delete all existing
			await tx.advertDetails.deleteMany({
				where: {
					caseReference
				}
			});

			if (advertDetails?.length) {
				// add all advert details
				await tx.advertDetails.createMany({
					data: advertDetails.map((detail) => ({
						caseReference,
						advertType: detail.advertType,
						isAdvertInPosition: detail.isAdvertInPosition ?? false,
						isSiteOnHighwayLand: detail.isSiteOnHighwayLand ?? false
					}))
				});
			}
		});
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
	 * @returns {Promise<boolean>}
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
	 * @returns {Promise<boolean>}
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

	/**
	 * checks user can modify case, does not work for LPA users
	 * @param {{ caseReference: string, userId: string }} params
	 * @returns {Promise<{ canModify: boolean, roles: AppealToUser[]}>}
	 */
	async userCanModifyCase({ caseReference, userId }) {
		try {
			const caseAndRoles = await this.dbClient.appealCase.findUniqueOrThrow({
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
									role: {
										in: [
											APPEAL_USER_ROLES.RULE_6_PARTY,
											APPEAL_USER_ROLES.APPELLANT,
											APPEAL_USER_ROLES.AGENT
										]
									}
								}
							}
						}
					}
				}
			});

			if (!caseAndRoles?.Appeal?.Users?.length)
				throw new Error(`${userId} has no role on case: ${caseReference}`);

			return {
				canModify: true,
				roles: caseAndRoles?.Appeal?.Users || []
			};
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

module.exports = { AppealCaseRepository, DocumentsArgsPublishedOnly, dashboardSelect };
