const { createPrismaClient } = require('#db-client');

/**
 * @typedef {import("@prisma/client").Appeal} Appeal
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
	caseDecisionPublishedDate: true,
	caseCompletedDate: true,
	lpaQuestionnaireDueDate: true,
	lpaQuestionnaireSubmittedDate: true,
	lpaQuestionnaireCreatedDate: true,
	lpaQuestionnairePublishedDate: true,
	lpaQuestionnaireValidationOutcomeDate: true,

	interestedPartyRepsDueDate: true
};

/**
 * @param {String} caseProcessCode
 * @param {AppealHASCase} dataModel
 * @returns {AppealCaseCreateWithoutAppealInput}
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
		caseProcedure,
		lpaCode,
		caseSpecialisms,
		caseValidationInvalidDetails,
		caseValidationIncompleteDetails,
		lpaQuestionnaireValidationDetails,
		siteAccessDetails,
		siteSafetyDetails,
		...commonFields
	}
) => ({
	...commonFields,
	CaseType: {
		connect: {
			processCode: caseProcessCode
		}
	},
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
	LPACode: lpaCode,
	caseSpecialisms: JSON.stringify(caseSpecialisms),
	caseValidationInvalidDetails: JSON.stringify(caseValidationInvalidDetails),
	caseValidationIncompleteDetails: JSON.stringify(caseValidationIncompleteDetails),
	lpaQuestionnaireValidationDetails: JSON.stringify(lpaQuestionnaireValidationDetails),
	siteAccessDetails: JSON.stringify(siteAccessDetails),
	siteSafetyDetails: JSON.stringify(siteSafetyDetails)
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
				Documents: {
					where: {
						publishedDocumentURI: { not: null }
					},
					select: {
						publishedDocumentURI: true,
						filename: true
					}
				},
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
	 * Get an appeal by case reference (aka appeal number)
	 *
	 * @param {string} caseReference
	 * @param {string} caseProcessCode
	 * @param {AppealHASCase} data
	 * @returns {Promise<AppealCase>}
	 */
	async putHASByCaseReference(caseReference, caseProcessCode, data) {
		const mappedData = mapHASDataModelToAppealCase(caseProcessCode, data);

		const appealCase = await this.dbClient.appealCase.upsert({
			create: { ...mappedData, Appeal: { create: {} } },
			update: mappedData,
			where: {
				caseReference
			}
		});

		// case relations
		await this.dbClient.$transaction(async (tx) => {
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

			if (data.leadCaseReference) {
				await tx.appealCaseRelationship.create({
					data: {
						caseReference,
						caseReference2: data.leadCaseReference,
						type: 'linked' // todo: const this
					}
				});
			}
		});

		// neighbour addresses
		await this.dbClient.$transaction(async (tx) => {
			await tx.neighbouringAddress.deleteMany({
				where: {
					caseReference: caseReference
				}
			});

			if (data.neighbouringSiteAddresses?.length) {
				await tx.neighbouringAddress.createMany({
					data: data.neighbouringSiteAddresses.map((address) => ({
						caseReference,
						addressLine1: address.neighbouringSiteAddressLine1,
						addressLine2: address.neighbouringSiteAddressLine2,
						townCity: address.neighbouringSiteAddressTown,
						county: address.neighbouringSiteAddressCounty,
						postcode: address.neighbouringSiteAddressPostcode,
						siteAccessDetails: address.neighbouringSiteAccessDetails,
						siteSafetyDetails: address.neighbouringSiteSafetyDetails
					}))
				});
			}
		});

		// listed building
		await this.dbClient.$transaction(async (tx) => {
			await tx.appealCaseListedBuilding.deleteMany({
				where: {
					caseReference: caseReference
				}
			});

			if (data.affectedListedBuildingNumbers?.length) {
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
			await tx.appealCaseLpaNotificationMethod.deleteMany({
				where: {
					caseReference
				}
			});

			if (data.notificationMethod?.length) {
				await tx.appealCaseLpaNotificationMethod.createMany({
					data: data.notificationMethod.map((notification) => ({
						caseReference,
						lPANotificationMethodsKey: notification
					}))
				});
			}
		});

		return appealCase;
	}

	/**
	 * List cases for an LPA
	 *
	 * @param {Object} options
	 * @param {string} options.lpaCode
	 * @param {boolean} options.decidedOnly - if true, only decided cases; else ONLY cases not decided
	 * @returns {Promise<AppealCase[]>}
	 */
	async listByLpaCode({ lpaCode, decidedOnly }) {
		/** @type {AppealCaseWhereInput[]}	*/
		const AND = [{ LPACode: lpaCode }];
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
	 * @param {string} options.postcode
	 * @param {boolean} options.decidedOnly - if true, only decided cases; else ONLY cases not decided
	 * @returns {Promise<AppealCase[]>}
	 */
	async listByPostCode({ postcode, decidedOnly }) {
		/** @type {AppealCaseWhereInput[]}	*/
		const AND = [
			{ siteAddressPostcode: { startsWith: postcode } },
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
		whereArray.push({ caseDecisionPublishedDate: { not: null } });
	} else {
		// or no decision date == not decided
		whereArray.push({ caseDecisionPublishedDate: null });
	}
}

module.exports = { AppealCaseRepository };
