const { buildQueryString } = require('@pins/common/src/client/utils');
const {
	LISTED_RELATION_TYPES,
	CASE_RELATION_TYPES,
	CASE_TYPES
} = require('@pins/common/src/database/data-static');
const config = require('../../../configuration/config');
const {
	createTestAppealCase
} = require('../../../../__tests__/developer/fixtures/appeals-case-data');
const {
	exampleHASDataModel
} = require('../../../../__tests__/developer/fixtures/appeals-HAS-data-model');
const {
	exampleS78DataModel
} = require('../../../../__tests__/developer/fixtures/appeals-S78-data-model');
const {
	exampleS20DataModel
} = require('../../../../__tests__/developer/fixtures/appeals-S20-data-model');
const {
	exampleCasPlanningDataModel
} = require('../../../../__tests__/developer/fixtures/appeals-cas-planning-data-model');
const {
	exampleCasAdvertsDataModel
} = require('../../../../__tests__/developer/fixtures/appeals-cas-adverts-data-model');
const {
	exampleAdvertsDataModel
} = require('../../../../__tests__/developer/fixtures/appeals-adverts-data-model');
const {
	exampleEnforcementDataModel
} = require('../../../../__tests__/developer/fixtures/appeals-enforcement-data-model');
const {
	exampleLDCDataModel
} = require('../../../../__tests__/developer/fixtures/appeals-ldc-data-model');

const { appendLinkedCasesForMultipleAppeals } = require('./service');

/**
 * @param {Object} dependencies
 * @param {function(): import('@pins/database/src/client/client').PrismaClient} dependencies.getSqlClient
 * @param {function(string): void} dependencies.setCurrentLpa
 * @param {import('../index.test').NotifyClientMock} dependencies.mockNotifyClient
 * @param {import('supertest').Agent} dependencies.appealsApi
 */
module.exports = ({ getSqlClient, setCurrentLpa, mockNotifyClient, appealsApi }) => {
	const sqlClient = getSqlClient();

	/** @type {string[]} */
	let appealCaseIds = [];
	/** @type {number[]} */
	let appealCaseRelationshipIds = [];

	let caseRef = 5555555;

	/**
	 * @param {string} lpaCode
	 * @param {string} postCode
	 * @param {boolean} casePublished
	 * @returns {import('@pins/database/src/client/client').Prisma.AppealCaseCreateInput}
	 */
	function appealCase(lpaCode, postCode, casePublished = true) {
		caseRef++;

		const appealCase = createTestAppealCase(
			caseRef.toString(),
			'HAS',
			lpaCode,
			postCode,
			casePublished
		);

		appealCase.Appeal = { create: {} };

		return appealCase;
	}

	const postCodes = ['BS1 6PM', 'BS1 6AA', 'BS1 6PO', 'BS1 6PP'];
	const LPAs = ['LPA1', 'LPA1a', 'LPA2', 'LPA2a', 'LPA3', 'LPA3a'];

	/** @type {import('@pins/database/src/client/client').Prisma.AppealCaseCreateInput[]} */
	const publishedTestCases = [
		appealCase('LPA1', 'BS1 6PM'),
		appealCase('LPA1', 'BS1 6AA'),
		appealCase('LPA1', 'BS1 6PO'),
		appealCase('LPA1a', 'BS1 6PP'),
		appealCase('LPA1', 'BS1 6PP'),
		appealCase('LPA2', 'BS1 6PM'),
		appealCase('LPA2a', 'BS1 6AA'),
		appealCase('LPA2', 'BS1 6AA'),
		appealCase('LPA3', 'BS1 6PO'),
		appealCase('LPA3a', 'BS1 6PO')
	];

	/** @type {import('@pins/database/src/client/client').Prisma.AppealCaseCreateInput[]} */
	const notPublishedCases = [
		appealCase('LPA1', 'BS1 6PM', false),
		appealCase('LPA1', 'BS1 6AA', false),
		appealCase('LPA1', 'BS1 6PO', false),
		appealCase('LPA1a', 'BS1 6PP', false),
		appealCase('LPA1', 'BS1 6PP', false),
		appealCase('LPA2', 'BS1 6PM', false),
		appealCase('LPA2a', 'BS1 6AA', false),
		appealCase('LPA2', 'BS1 6AA', false),
		appealCase('LPA3', 'BS1 6PO', false),
		appealCase('LPA3a', 'BS1 6PO', false)
	];

	/** @type {import('@pins/database/src/client/client').Prisma.AppealCaseCreateInput[]} */
	const testCases = [...publishedTestCases, ...notPublishedCases];

	afterAll(async () => {
		await _clearSqlData();
	});

	describe('appeal-cases', () => {
		describe('list', () => {
			describe('validate request', () => {
				const tests = [
					{
						name: 'empty',
						params: {},
						want: {
							status: 400,
							errors: ['lpa-code || postcode is required']
						}
					},
					{
						name: 'invalid',
						params: { hello: 'world' },
						want: {
							status: 400,
							errors: ['lpa-code || postcode is required']
						}
					},
					{
						name: 'invalid bool',
						params: { postcode: 'BS1', 'decided-only': 'decided' },
						want: {
							status: 400,
							errors: ['decided-only must be true or false']
						}
					},
					{
						name: 'valid',
						params: { postcode: 'BS1', 'decided-only': 'true' },
						want: {
							status: 200
						}
					}
				];

				for (const { name, params, want } of tests) {
					it(name, async () => {
						const response = await appealsApi
							.get(`/api/v2/appeal-cases` + buildQueryString(params))
							.send();
						expect(response.status).toBe(want.status);
						expect(response.body.errors).toEqual(want.errors);
					});
				}
			});

			describe('by lpa code', () => {
				beforeAll(async () => {
					// seed cases
					for (const data of testCases) {
						await _createSqlAppealCase(data);
					}
				});
				afterAll(async () => {
					await _clearSqlData();
				});

				for (const lpa of LPAs) {
					it(`returns for ${lpa}`, async () => {
						setCurrentLpa(lpa);

						const response = await appealsApi
							.get(`/api/v2/appeal-cases` + buildQueryString({ 'lpa-code': lpa }))
							.send();
						expect(response.status).toBe(200);
						expect(response.body.length).toEqual(testCases.filter((c) => c.LPACode === lpa).length);
					});
				}

				it(`400 if lpa code in query doesn't match token`, async () => {
					setCurrentLpa('invalidLpa');

					const response = await appealsApi
						.get(`/api/v2/appeal-cases` + buildQueryString({ 'lpa-code': LPAs[0] }))
						.send();
					expect(response.status).toBe(400);
				});
			});

			describe('by postcode', () => {
				beforeAll(async () => {
					// seed cases
					for (const data of testCases) {
						await _createSqlAppealCase(data);
					}
				});
				afterAll(async () => {
					await _clearSqlData();
				});

				for (const postCode of postCodes) {
					it(`returns for ${postCode}`, async () => {
						const response = await appealsApi
							.get(`/api/v2/appeal-cases` + buildQueryString({ postcode: postCode }))
							.send();
						expect(response.status).toBe(200);
						expect(response.body.length).toEqual(
							// only published cases
							publishedTestCases.filter((c) => c.siteAddressPostcode === postCode).length
						);
					});
				}
			});
		});

		describe('count', () => {
			describe('by lpa code', () => {
				beforeAll(async () => {
					// seed cases
					for (const data of testCases) {
						await _createSqlAppealCase(data);
					}
				});
				afterAll(async () => {
					await _clearSqlData();
				});

				for (const lpa of LPAs) {
					it(`returns count for ${lpa}`, async () => {
						const response = await appealsApi
							.get(`/api/v2/appeal-cases/count` + buildQueryString({ 'lpa-code': lpa }))
							.send();
						expect(response.status).toBe(200);
						expect(response.body).toEqual({
							count: testCases.filter((c) => c.LPACode === lpa).length
						});
					});
				}
			});
		});

		describe('get', () => {
			beforeAll(async () => {
				// seed cases
				for (const data of testCases) {
					await _createSqlAppealCase(data);
				}
			});
			afterAll(async () => {
				await _clearSqlData();
			});

			// only published cases
			for (const testCase of publishedTestCases) {
				it(`returns case for ${testCase.caseReference}`, async () => {
					const response = await appealsApi
						.get(`/api/v2/appeal-cases/` + testCase.caseReference)
						.send();
					expect(response.status).toBe(200);
					expect(response.body).toHaveProperty('caseReference', testCase.caseReference);
				});
			}

			// only not published cases
			for (const testCase of notPublishedCases) {
				it(`doesn't return non-published case ${testCase.caseReference}`, async () => {
					const response = await appealsApi
						.get(`/api/v2/appeal-cases/` + testCase.caseReference)
						.send();
					expect(response.status).toBe(404);
				});
			}

			it(`returns 404 when not found`, async () => {
				const response = await appealsApi.get(`/api/v2/appeal-cases/abcdefg`).send();
				expect(response.status).toBe(404);
			});
		});

		describe('put', () => {
			const expectEmail = (email, appealReferenceNumber) => {
				expect(mockNotifyClient.sendEmail).toHaveBeenCalledTimes(1);
				expect(mockNotifyClient.sendEmail).toHaveBeenCalledWith(
					config.services.notify.templates.generic,
					email,
					{
						personalisation: {
							subject: `We have processed your appeal: ${appealReferenceNumber}`,
							content: expect.stringContaining('We have processed your appeal.') // start of v2FollowUp email content
						},
						reference: expect.any(String),
						emailReplyToId: undefined
					}
				);
				mockNotifyClient.sendEmail.mockClear();
			};

			afterAll(async () => {
				await _clearSqlData();
			});

			const hasExample = { ...exampleHASDataModel };
			const s78Example = { ...exampleS78DataModel };
			const s20Example = { ...exampleS20DataModel };
			const casPlanningExample = { ...exampleCasPlanningDataModel };
			const casAdvertsExample = { ...exampleCasAdvertsDataModel };
			const advertsExample = { ...exampleAdvertsDataModel };
			const enforcementExample = { ...exampleEnforcementDataModel };
			const ldcExample = { ...exampleLDCDataModel };

			const appealExamples = [
				{ name: CASE_TYPES.HAS.processCode, data: hasExample },
				{ name: CASE_TYPES.S78.processCode, data: s78Example },
				{ name: CASE_TYPES.S20.processCode, data: s20Example },
				{ name: CASE_TYPES.CAS_PLANNING.processCode, data: casPlanningExample },
				{ name: CASE_TYPES.CAS_ADVERTS.processCode, data: casAdvertsExample },
				{ name: CASE_TYPES.ADVERTS.processCode, data: advertsExample },
				{ name: CASE_TYPES.ENFORCEMENT.processCode, data: enforcementExample },
				{ name: CASE_TYPES.LDC.processCode, data: ldcExample }
			];

			for (const appealExample of appealExamples) {
				it(`creates initial case for ${appealExample.name}`, async () => {
					const data = structuredClone(appealExample.data);
					data.lpaCode = 'Q1111';
					const testCaseRef = 'put-initial-case-test-' + appealExample.name;
					const submission = await sqlClient.appellantSubmission.create({
						data: {
							appealTypeCode: appealExample.name,
							LPACode: 'Q1111',
							Appeal: { create: {} }
						},
						select: {
							id: true,
							Appeal: {
								select: {
									id: true
								}
							}
						}
					});
					const email = 'test@example.com';

					const user = await sqlClient.appealUser.upsert({
						where: { email },
						create: { email },
						update: {}
					});

					await sqlClient.appealToUser.create({
						data: {
							userId: user.id,
							appealId: submission.Appeal.id,
							role: 'Appellant'
						}
					});
					data.submissionId = submission.Appeal.id;
					data.caseReference = testCaseRef;
					const response = await appealsApi.put(`/api/v2/appeal-cases/` + testCaseRef).send(data);
					expect(response.status).toBe(200);
					expect(response.body).toEqual({
						id: expect.any(String),
						appealId: expect.any(String),
						appealTypeCode: appealExample.name,
						caseId: data.caseId ?? null,
						caseReference: data.caseReference ?? null,
						caseOfficerId: data.caseOfficerId ?? null,
						inspectorId: data.inspectorId ?? null,
						allocationLevel: data.allocationLevel ?? null,
						allocationBand: data.allocationBand ?? null,
						caseSubmittedDate: data.caseSubmittedDate ?? null,
						caseCreatedDate: data.caseCreatedDate ?? null,
						caseUpdatedDate: data.caseUpdatedDate ?? null,
						caseValidDate: data.caseValidDate ?? null,
						caseValidationDate: data.caseValidationDate ?? null,
						caseExtensionDate: data.caseExtensionDate ?? null,
						caseStartedDate: data.caseStartedDate ?? null,
						casePublishedDate: data.casePublishedDate ?? null,
						lpaQuestionnaireDueDate: data.lpaQuestionnaireDueDate ?? null,
						lpaQuestionnaireSubmittedDate: data.lpaQuestionnaireSubmittedDate ?? null,
						lpaQuestionnaireCreatedDate: data.lpaQuestionnaireCreatedDate ?? null,
						lpaQuestionnairePublishedDate: data.lpaQuestionnairePublishedDate ?? null,
						lpaQuestionnaireValidationOutcomeDate:
							data.lpaQuestionnaireValidationOutcomeDate ?? null,
						lpaStatement: data.lpaStatement ?? null,
						caseWithdrawnDate: data.caseWithdrawnDate ?? null,
						caseTransferredDate: data.caseTransferredDate ?? null,
						transferredCaseClosedDate: data.transferredCaseClosedDate ?? null,
						caseDecisionOutcomeDate: data.caseDecisionOutcomeDate ?? null,
						caseDecisionPublishedDate: data.caseDecisionPublishedDate ?? null,
						caseCompletedDate: data.caseCompletedDate ?? null,
						enforcementNotice: data.enforcementNotice ?? null,
						applicationReference: data.applicationReference ?? null,
						applicationDate: data.applicationDate ?? null,
						applicationDecision: data.applicationDecision ?? null,
						applicationDecisionDate: data.applicationDecisionDate ?? null,
						caseSubmissionDueDate: data.caseSubmissionDueDate ?? null,
						siteAddressLine1: data.siteAddressLine1 ?? null,
						siteAddressLine2: data.siteAddressLine2 ?? null,
						siteAddressTown: data.siteAddressTown ?? null,
						siteAddressCounty: data.siteAddressCounty ?? null,
						siteGridReferenceEasting: data.siteGridReferenceEasting ?? null,
						siteGridReferenceNorthing: data.siteGridReferenceNorthing ?? null,
						siteAreaSquareMetres: data.siteAreaSquareMetres?.toString() ?? null,
						floorSpaceSquareMetres: data.floorSpaceSquareMetres?.toString() ?? null,
						isCorrectAppealType: data.isCorrectAppealType ?? null,
						isGreenBelt: data.isGreenBelt ?? null,
						inConservationArea: data.inConservationArea ?? null,
						ownsAllLand: data.ownsAllLand ?? null,
						ownsSomeLand: data.ownsSomeLand ?? null,
						knowsOtherOwners: data.knowsOtherOwners ?? null,
						knowsAllOwners: data.knowsAllOwners ?? null,
						advertisedAppeal: data.advertisedAppeal ?? null,
						ownersInformed: data.ownersInformed ?? null,
						originalDevelopmentDescription: data.originalDevelopmentDescription ?? null,
						changedDevelopmentDescription: data.changedDevelopmentDescription ?? null,
						newConditionDetails: data.newConditionDetails ?? null,
						appellantCostsAppliedFor: data.appellantCostsAppliedFor ?? null,
						lpaCostsAppliedFor: data.lpaCostsAppliedFor ?? null,
						typeOfPlanningApplication: data.typeOfPlanningApplication ?? null,
						reasonForNeighbourVisits: data.reasonForNeighbourVisits ?? null,
						statutoryConsultees: data.hasStatutoryConsultees ?? null,
						consultedBodiesDetails: data.consultedBodiesDetails ?? null,
						hasLandownersPermission: data.hasLandownersPermission ?? null,
						siteAddressPostcode: data.siteAddressPostcode ?? null,
						siteAddressPostcodeSanitized: data.siteAddressPostcode?.toUpperCase().replace(' ', ''),
						scheduledMonument: data.affectsScheduledMonument ?? null,
						protectedSpecies: data.hasProtectedSpecies ?? null,
						areaOutstandingBeauty: data.isAonbNationalLandscape ?? null,
						designatedSitesNames: data.designatedSitesNames
							? JSON.stringify(data.designatedSitesNames)
							: null,
						lpaProcedurePreference: data.lpaProcedurePreference ?? null,
						lpaProcedurePreferenceDetails: data.lpaProcedurePreferenceDetails ?? null,
						lpaProcedurePreferenceDuration: data.lpaProcedurePreferenceDuration ?? null,
						wasApplicationRefusedDueToHighwayOrTraffic:
							data.wasApplicationRefusedDueToHighwayOrTraffic ?? null,
						isSiteInAreaOfSpecialControlAdverts: data.isSiteInAreaOfSpecialControlAdverts ?? null,
						didAppellantSubmitCompletePhotosAndPlans:
							data.didAppellantSubmitCompletePhotosAndPlans ?? null,
						ownerOccupancyStatus: data.ownerOccupancyStatus ?? null,
						occupancyConditionsMet: data.occupancyConditionsMet ?? null,
						applicationMadeAndFeePaid: data.applicationMadeAndFeePaid ?? null,
						previousPlanningPermissionGranted: data.previousPlanningPermissionGranted ?? null,
						issueDateOfEnforcementNotice: data.issueDateOfEnforcementNotice ?? null,
						effectiveDateOfEnforcementNotice: data.effectiveDateOfEnforcementNotice ?? null,
						didAppellantAppealLpaDecision: data.didAppellantAppealLpaDecision ?? null,
						dateLpaDecisionDue: data.dateLpaDecisionDue ?? null,
						dateLpaDecisionReceived: data.dateLpaDecisionReceived ?? null,
						enforcementReference: data.enforcementReference ?? null,
						descriptionOfAllegedBreach: data.descriptionOfAllegedBreach ?? null,
						applicationPartOrWholeDevelopment: data.applicationPartOrWholeDevelopment ?? null,
						contactPlanningInspectorateDate: data.contactPlanningInspectorateDate ?? null,
						agriculturalHolding: data.agriculturalHolding ?? null,
						tenantAgriculturalHolding: data.tenantAgriculturalHolding ?? null,
						otherTenantsAgriculturalHolding: data.otherTenantsAgriculturalHolding ?? null,
						informedTenantsAgriculturalHolding: data.informedTenantsAgriculturalHolding ?? null,
						appellantProcedurePreference: data.appellantProcedurePreference ?? null,
						appellantProcedurePreferenceDetails: data.appellantProcedurePreferenceDetails ?? null,
						appellantProcedurePreferenceDuration: data.appellantProcedurePreferenceDuration ?? null,
						appellantProcedurePreferenceWitnessCount:
							data.appellantProcedurePreferenceWitnessCount ?? null,
						statusPlanningObligation: data.statusPlanningObligation ?? null,
						gypsyTraveller: data.isGypsyOrTravellerSite ?? null,
						publicRightOfWay: data.isPublicRightOfWay ?? null,
						environmentalImpactSchedule: data.eiaEnvironmentalImpactSchedule ?? null,
						developmentDescription: data.eiaDevelopmentDescription ?? null,
						sensitiveAreaDetails: data.eiaSensitiveAreaDetails ?? null,
						columnTwoThreshold: data.eiaColumnTwoThreshold ?? null,
						screeningOpinion: data.eiaScreeningOpinion ?? null,
						requiresEnvironmentalStatement: data.eiaRequiresEnvironmentalStatement ?? null,
						completedEnvironmentalStatement: data.eiaCompletedEnvironmentalStatement ?? null,
						infrastructureLevy: data.hasInfrastructureLevy ?? null,
						infrastructureLevyAdopted: data.isInfrastructureLevyFormallyAdopted ?? null,
						infrastructureLevyAdoptedDate: data.infrastructureLevyAdoptedDate ?? null,
						infrastructureLevyExpectedDate: data.infrastructureLevyExpectedDate ?? null,
						caseworkReason: data.caseworkReason ?? null,
						developmentType: data.developmentType ?? null,
						importantInformation: data.importantInformation ?? null,
						jurisdiction: data.jurisdiction ?? null,
						redeterminedIndicator: data.redeterminedIndicator ?? null,
						dateCostsReportDespatched: data.dateCostsReportDespatched ?? null,
						dateNotRecoveredOrDerecovered: data.dateNotRecoveredOrDerecovered ?? null,
						dateRecovered: data.dateRecovered ?? null,
						originalCaseDecisionDate: data.originalCaseDecisionDate ?? null,
						targetDate: data.targetDate ?? null,
						appellantCommentsSubmittedDate: data.appellantCommentsSubmittedDate ?? null,
						appellantStatementSubmittedDate: data.appellantStatementSubmittedDate ?? null,
						appellantProofsSubmittedDate: data.appellantProofsSubmittedDate ?? null,
						finalCommentsDueDate: data.finalCommentsDueDate ?? null,
						interestedPartyRepsDueDate: data.interestedPartyRepsDueDate ?? null,
						LPACommentsSubmittedDate: data.lpaCommentsSubmittedDate ?? null,
						LPAProofsSubmittedDate: data.lpaProofsSubmittedDate ?? null,
						LPAStatementSubmittedDate: data.lpaStatementSubmittedDate ?? null,
						proofsOfEvidenceDueDate: data.proofsOfEvidenceDueDate ?? null,
						siteNoticesSentDate: data.siteNoticesSentDate ?? null,
						statementDueDate: data.statementDueDate ?? null,
						numberOfResidencesNetChange: data.numberOfResidencesNetChange ?? null,
						siteViewableFromRoad: data.siteViewableFromRoad ?? null,
						siteWithinSSSI: data.siteWithinSSSI ?? null,
						preserveGrantLoan: data.preserveGrantLoan ?? null,
						consultHistoricEngland: data.consultHistoricEngland ?? null,
						caseStatus: data.caseStatus,
						caseDecisionOutcome: data.caseDecisionOutcome,
						caseValidationOutcome: data.caseValidationOutcome,
						lpaQuestionnaireValidationOutcome: data.lpaQuestionnaireValidationOutcome,
						caseProcedure: data.caseProcedure,
						LPACode: data.lpaCode,
						caseSpecialisms: data.caseSpecialisms ? JSON.stringify(data.caseSpecialisms) : null,
						caseValidationInvalidDetails: data.caseValidationInvalidDetails
							? JSON.stringify(data.caseValidationInvalidDetails)
							: null,
						caseValidationIncompleteDetails: data.caseValidationIncompleteDetails
							? JSON.stringify(data.caseValidationIncompleteDetails)
							: null,
						lpaQuestionnaireValidationDetails: data.lpaQuestionnaireValidationDetails
							? JSON.stringify(data.lpaQuestionnaireValidationDetails)
							: null,
						siteAccessDetails: data.siteAccessDetails
							? JSON.stringify(data.siteAccessDetails)
							: null,
						siteSafetyDetails: data.siteSafetyDetails
							? JSON.stringify(data.siteSafetyDetails)
							: null,
						changeOfUseMineralExtraction: data.changeOfUseMineralExtraction ?? null,
						changeOfUseMineralStorage: data.changeOfUseMineralStorage ?? null,
						changeOfUseRefuseOrWaste: data.changeOfUseRefuseOrWaste ?? null,
						article4AffectedDevelopmentRights: data.article4AffectedDevelopmentRights ?? null,
						affectedTrunkRoadName: data.affectedTrunkRoadName ?? null,
						noticeRelatesToBuildingEngineeringMiningOther:
							data.noticeRelatesToBuildingEngineeringMiningOther ?? null,
						isSiteOnCrownLand: data.isSiteOnCrownLand ?? null,
						hasAllegedBreachArea: data.hasAllegedBreachArea ?? null,
						doesAllegedBreachCreateFloorSpace: data.doesAllegedBreachCreateFloorSpace ?? null,
						relatesToBuildingSingleDwellingHouse: data.relatesToBuildingSingleDwellingHouse ?? null,
						relatesToBuildingWithAgriculturalPurpose:
							data.relatesToBuildingWithAgriculturalPurpose ?? null,
						relatesToErectionOfBuildingOrBuildings:
							data.relatesToErectionOfBuildingOrBuildings ?? null,
						applicationMadeUnderActSection: data.applicationMadeUnderActSection ?? null,
						siteUseAtTimeOfApplication: data.siteUseAtTimeOfApplication ?? null,
						appealUnderActSection: data.appealUnderActSection ?? null,
						lpaConsiderAppealInvalid: data.lpaConsiderAppealInvalid ?? null,
						lpaAppealInvalidReasons: data.lpaAppealInvalidReasons ?? null
					});
					expectEmail(email, testCaseRef);
				});
			}

			for (const testCase of testCases) {
				it(`upserts case for ${testCase.caseReference}`, async () => {
					hasExample.caseReference = testCase.caseReference;
					const response = await appealsApi
						.put(`/api/v2/appeal-cases/` + testCase.caseReference)
						.send(hasExample);
					expect(response.status).toBe(200);
					expect(response.body).toHaveProperty('caseReference', testCase.caseReference);
				});

				it(`upserts S78 case for ${testCase.caseReference}`, async () => {
					s78Example.caseReference = testCase.caseReference;
					const response = await appealsApi
						.put(`/api/v2/appeal-cases/` + testCase.caseReference)
						.send(s78Example);
					expect(response.status).toBe(200);
					expect(response.body).toHaveProperty('caseReference', testCase.caseReference);
				});

				it(`upserts S20 case for ${testCase.caseReference}`, async () => {
					s20Example.caseReference = testCase.caseReference;
					const response = await appealsApi
						.put(`/api/v2/appeal-cases/` + testCase.caseReference)
						.send(s20Example);
					expect(response.status).toBe(200);
					expect(response.body).toHaveProperty('caseReference', testCase.caseReference);
				});

				it(`upserts cas planning case for ${testCase.caseReference}`, async () => {
					casPlanningExample.caseReference = testCase.caseReference;
					const response = await appealsApi
						.put(`/api/v2/appeal-cases/` + testCase.caseReference)
						.send(casPlanningExample);
					expect(response.status).toBe(200);
					expect(response.body).toHaveProperty('caseReference', testCase.caseReference);
				});

				it(`upserts cas adverts case for ${testCase.caseReference}`, async () => {
					casAdvertsExample.caseReference = testCase.caseReference;
					const response = await appealsApi
						.put(`/api/v2/appeal-cases/` + testCase.caseReference)
						.send(casAdvertsExample);
					expect(response.status).toBe(200);
					expect(response.body).toHaveProperty('caseReference', testCase.caseReference);
				});

				it(`upserts adverts case for ${testCase.caseReference}`, async () => {
					advertsExample.caseReference = testCase.caseReference;
					const response = await appealsApi
						.put(`/api/v2/appeal-cases/` + testCase.caseReference)
						.send(advertsExample);
					expect(response.status).toBe(200);
					expect(response.body).toHaveProperty('caseReference', testCase.caseReference);
				});

				it(`upserts enforcement case for ${testCase.caseReference}`, async () => {
					enforcementExample.caseReference = testCase.caseReference;
					const response = await appealsApi
						.put(`/api/v2/appeal-cases/` + testCase.caseReference)
						.send(enforcementExample);
					expect(response.status).toBe(200);
					expect(response.body).toHaveProperty('caseReference', testCase.caseReference);
				});
			}

			const testCase1 = testCases[0];

			it('upserts all relational data for HAS', async () => {
				hasExample.caseReference = testCase1.caseReference;
				await appealsApi.put(`/api/v2/appeal-cases/` + testCase1.caseReference).send(hasExample);

				await sqlClient.appealCaseListedBuilding.create({
					data: {
						AppealCase: {
							connect: {
								caseReference: testCase1.caseReference
							}
						},
						ListedBuilding: {
							create: {
								reference: 'unknown'
							}
						}
					}
				});

				await appealsApi.put(`/api/v2/appeal-cases/` + testCase1.caseReference).send(hasExample);

				const appealCase = await sqlClient.appealCase.findFirst({
					where: { caseReference: testCase1.caseReference },
					include: {
						ListedBuildings: true,
						AppealCaseLpaNotificationMethod: true,
						NeighbouringAddresses: true,
						CaseType: true,
						ProcedureType: true
					}
				});

				expect(
					appealCase?.ListedBuildings.filter((x) => x.type === LISTED_RELATION_TYPES.affected)
						.length
				).toBe(3); // the number of listed buildings in example json
				expect(appealCase?.AppealCaseLpaNotificationMethod.length).toBe(2); // the number of notification methods in example json
				expect(appealCase?.NeighbouringAddresses.length).toBe(4); // the number of neighbouring addresses in example json
				expect(appealCase?.CaseType?.processCode).toBe('HAS');
				expect(appealCase?.ProcedureType?.name).toBe('Written');

				const appealRelations = await sqlClient.appealCaseRelationship.findMany({
					where: {
						OR: [
							{
								caseReference: testCase1.caseReference
							},
							{
								caseReference2: testCase1.caseReference
							}
						]
					}
				});
				expect(appealRelations.length).toBe(5); // nearbyCaseReferences (linked bi-directional) + leadCaseReference (one-directional)
			});

			it('upserts all relational data for S78', async () => {
				s78Example.caseReference = testCase1.caseReference;
				await appealsApi.put(`/api/v2/appeal-cases/` + testCase1.caseReference).send(s78Example);

				await appealsApi.put(`/api/v2/appeal-cases/` + testCase1.caseReference).send(s78Example);

				const appealCase = await sqlClient.appealCase.findFirst({
					where: { caseReference: testCase1.caseReference },
					include: {
						ListedBuildings: true,
						AppealCaseLpaNotificationMethod: true,
						NeighbouringAddresses: true,
						CaseType: true,
						ProcedureType: true
					}
				});

				expect(
					appealCase?.ListedBuildings.filter((x) => x.type === LISTED_RELATION_TYPES.affected)
						.length
				).toBe(3); // the number of listed buildings in example json
				expect(appealCase?.AppealCaseLpaNotificationMethod.length).toBe(2); // the number of notification methods in example json
				expect(appealCase?.NeighbouringAddresses.length).toBe(4); // the number of neighbouring addresses in example json
				expect(appealCase?.CaseType?.processCode).toBe('S78');
				expect(appealCase?.ProcedureType?.name).toBe('Written');

				const appealRelations = await sqlClient.appealCaseRelationship.findMany({
					where: {
						OR: [
							{
								caseReference: testCase1.caseReference
							},
							{
								caseReference2: testCase1.caseReference
							}
						]
					}
				});
				expect(appealRelations.length).toBe(5); // nearbyCaseReferences (linked bi-directional) + leadCaseReference (one-directional)
			});

			it('upserts all relational data for adverts', async () => {
				advertsExample.caseReference = testCase1.caseReference;
				await appealsApi
					.put(`/api/v2/appeal-cases/` + testCase1.caseReference)
					.send(advertsExample);

				await appealsApi
					.put(`/api/v2/appeal-cases/` + testCase1.caseReference)
					.send(advertsExample);

				const appealCase = await sqlClient.appealCase.findFirst({
					where: { caseReference: testCase1.caseReference },
					include: {
						ListedBuildings: true,
						AppealCaseLpaNotificationMethod: true,
						NeighbouringAddresses: true,
						CaseType: true,
						ProcedureType: true,
						AdvertDetails: true
					}
				});

				expect(appealCase?.AdvertDetails.length).toBe(3); // the number of advert details in example json
				expect(
					appealCase?.ListedBuildings.filter((x) => x.type === LISTED_RELATION_TYPES.affected)
						.length
				).toBe(3); // the number of listed buildings in example json
				expect(appealCase?.AppealCaseLpaNotificationMethod.length).toBe(2); // the number of notification methods in example json
				expect(appealCase?.NeighbouringAddresses.length).toBe(4); // the number of neighbouring addresses in example json
				expect(appealCase?.CaseType?.processCode).toBe('ADVERTS');
				expect(appealCase?.ProcedureType?.name).toBe('Written');

				const appealRelations = await sqlClient.appealCaseRelationship.findMany({
					where: {
						OR: [
							{
								caseReference: testCase1.caseReference
							},
							{
								caseReference2: testCase1.caseReference
							}
						]
					}
				});
				expect(appealRelations.length).toBe(5); // nearbyCaseReferences (linked bi-directional) + leadCaseReference (one-directional)
			});

			it('upserts all relational data for enforcement', async () => {
				enforcementExample.caseReference = testCase1.caseReference;
				await appealsApi
					.put(`/api/v2/appeal-cases/` + testCase1.caseReference)
					.send(enforcementExample);

				await appealsApi
					.put(`/api/v2/appeal-cases/` + testCase1.caseReference)
					.send(enforcementExample);

				const appealCase = await sqlClient.appealCase.findFirst({
					where: { caseReference: testCase1.caseReference },
					include: {
						ListedBuildings: true,
						AppealCaseLpaNotificationMethod: true,
						NeighbouringAddresses: true,
						CaseType: true,
						ProcedureType: true,
						EnforcementAppealGroundsDetails: true
					}
				});

				expect(appealCase?.EnforcementAppealGroundsDetails.length).toBe(2); // the number of appeal ground details in example json
				expect(
					appealCase?.ListedBuildings.filter((x) => x.type === LISTED_RELATION_TYPES.affected)
						.length
				).toBe(3); // the number of listed buildings in example json
				expect(appealCase?.AppealCaseLpaNotificationMethod.length).toBe(2); // the number of notification methods in example json
				expect(appealCase?.NeighbouringAddresses.length).toBe(4); // the number of neighbouring addresses in example json
				expect(appealCase?.CaseType?.processCode).toBe('ENFORCEMENT');
				expect(appealCase?.ProcedureType?.name).toBe('Written');

				const appealRelations = await sqlClient.appealCaseRelationship.findMany({
					where: {
						OR: [
							{
								caseReference: testCase1.caseReference
							},
							{
								caseReference2: testCase1.caseReference
							}
						]
					}
				});
				expect(appealRelations.length).toBe(5); // nearbyCaseReferences (linked bi-directional) + leadCaseReference (one-directional)
			});

			it('does not add or delete a linked relation for a lead appeal', async () => {
				const testLeadData = structuredClone(s78Example);
				const testChildData = structuredClone(s78Example);
				const testCase2 = testCases[1];

				testLeadData.caseReference = testCase1.caseReference;
				testLeadData.linkedCaseStatus = 'lead';
				testLeadData.leadCaseReference = testCase1.caseReference;

				testChildData.caseReference = testCase2.caseReference;
				testChildData.linkedCaseStatus = 'child';
				testLeadData.leadCaseReference = testCase1.caseReference;

				await appealsApi.put(`/api/v2/appeal-cases/` + testCase1.caseReference).send(testLeadData);

				await appealsApi.put(`/api/v2/appeal-cases/` + testCase1.caseReference).send(testLeadData);

				const leadAppealRelations = await sqlClient.appealCaseRelationship.findMany({
					where: {
						AND: [
							{
								OR: [
									{
										caseReference: testCase1.caseReference
									},
									{
										caseReference2: testCase1.caseReference
									}
								]
							},
							{
								type: CASE_RELATION_TYPES.linked
							}
						]
					}
				});
				expect(leadAppealRelations.length).toBe(0);

				// create a linked appeal relationship for child

				await appealsApi.put(`/api/v2/appeal-cases/` + testCase2.caseReference).send(testChildData);

				const childAppealRelations = await sqlClient.appealCaseRelationship.findMany({
					where: {
						AND: [
							{
								caseReference: testCase2.caseReference
							},
							{
								type: CASE_RELATION_TYPES.linked
							}
						]
					}
				});
				expect(childAppealRelations.length).toBe(1);

				// is not deleted by update to lead

				await appealsApi.put(`/api/v2/appeal-cases/` + testCase1.caseReference).send(testLeadData);

				const childAppealRelations2 = await sqlClient.appealCaseRelationship.findMany({
					where: {
						AND: [
							{
								caseReference: testCase2.caseReference
							},
							{
								type: CASE_RELATION_TYPES.linked
							}
						]
					}
				});
				expect(childAppealRelations2.length).toBe(1);
			});

			it('upserts all relational data for S20', async () => {
				s20Example.caseReference = testCase1.caseReference;
				await appealsApi.put(`/api/v2/appeal-cases/` + testCase1.caseReference).send(s20Example);

				await appealsApi.put(`/api/v2/appeal-cases/` + testCase1.caseReference).send(s20Example);

				const appealCase = await sqlClient.appealCase.findFirst({
					where: { caseReference: testCase1.caseReference },
					include: {
						ListedBuildings: true,
						AppealCaseLpaNotificationMethod: true,
						NeighbouringAddresses: true,
						CaseType: true,
						ProcedureType: true
					}
				});

				expect(
					appealCase?.ListedBuildings.filter((x) => x.type === LISTED_RELATION_TYPES.affected)
						.length
				).toBe(3); // the number of listed buildings in example json
				expect(appealCase?.AppealCaseLpaNotificationMethod.length).toBe(2); // the number of notification methods in example json
				expect(appealCase?.NeighbouringAddresses.length).toBe(4); // the number of neighbouring addresses in example json
				expect(appealCase?.CaseType?.processCode).toBe('S20');
				expect(appealCase?.ProcedureType?.name).toBe('Written');
				expect(appealCase?.preserveGrantLoan).toBe(true);
				expect(appealCase?.consultHistoricEngland).toBe(true);

				const appealRelations = await sqlClient.appealCaseRelationship.findMany({
					where: {
						OR: [
							{
								caseReference: testCase1.caseReference
							},
							{
								caseReference2: testCase1.caseReference
							}
						]
					}
				});
				expect(appealRelations.length).toBe(5); // nearbyCaseReferences (linked bi-directional) + leadCaseReference (one-directional)
			});

			it('links to initial submission', async () => {
				const appeal = await sqlClient.appeal.create({});

				hasExample.caseReference = 'link-to-submission';
				hasExample.submissionId = appeal.id;

				await appealsApi.put(`/api/v2/appeal-cases/` + hasExample.caseReference).send(hasExample);

				const appealCase = await sqlClient.appealCase.findFirst({
					where: { caseReference: hasExample.caseReference },
					select: {
						appealId: true
					}
				});

				expect(appealCase?.appealId).toBe(appeal.id);
			});

			it(`returns 400 for bad requests`, async () => {
				const badData = {
					caseType: 'D'
				};
				const response = await appealsApi.put(`/api/v2/appeal-cases/abcdefg`).send(badData);
				expect(response.status).toBe(400);
			});
		});

		describe('appendLinkedCasesForMultipleAppeals', () => {
			const child1 = {
				caseReference: 'testChildRef1'
			};
			const child2 = {
				caseReference: 'testChildRef2'
			};
			const lead = {
				caseReference: 'testLeadRef'
			};
			const unlinked = {
				caseReference: 'unlinked'
			};
			const linkedCasesData = [
				{
					caseReference: child1.caseReference,
					caseReference2: lead.caseReference,
					type: 'linked'
				},
				{
					caseReference: child2.caseReference,
					caseReference2: lead.caseReference,
					type: 'linked'
				}
			];

			beforeAll(async () => {
				// seed linked appealCaseRelationship
				for (const data of linkedCasesData) {
					await _createSqlLinkedCases(data);
				}
			});

			afterAll(async () => {
				await _clearSqlData();
			});

			const inputArray = [child1, child2, lead, unlinked];

			const enhancedChild1 = {
				...child1,
				linkedCases: [
					{
						childCaseReference: child1.caseReference,
						leadCaseReference: lead.caseReference
					}
				]
			};
			const enhancedChild2 = {
				...child2,
				linkedCases: [
					{
						childCaseReference: child2.caseReference,
						leadCaseReference: lead.caseReference
					}
				]
			};
			const enhancedLead = {
				...lead,
				linkedCases: [
					{
						childCaseReference: child1.caseReference,
						leadCaseReference: lead.caseReference
					},
					{
						childCaseReference: child2.caseReference,
						leadCaseReference: lead.caseReference
					}
				]
			};

			it('appends linked case information', async () => {
				const results = await appendLinkedCasesForMultipleAppeals(inputArray);
				expect(results).toEqual([enhancedChild1, enhancedChild2, enhancedLead, unlinked]);
			});
		});
	});

	/**
	 * @returns {Promise.<void>}
	 */
	const _clearSqlData = async () => {
		const testAppealsClause = {
			in: appealCaseIds
		};

		const testRelationshipsClause = {
			in: appealCaseRelationshipIds
		};

		await sqlClient.appealCase.deleteMany({
			where: {
				id: testAppealsClause
			}
		});

		await sqlClient.appealCaseRelationship.deleteMany({
			where: {
				id: testRelationshipsClause
			}
		});

		appealCaseIds = [];
		appealCaseRelationshipIds = [];
	};

	/**
	 * @param {import('@pins/database/src/client/client').Prisma.AppealCaseCreateInput} data
	 * @returns {Promise.<import('@pins/database/src/client/client').AppealCase>}
	 */
	async function _createSqlAppealCase(data) {
		const appeal = await sqlClient.appealCase.create({ data });

		appealCaseIds.push(appeal.id);

		return appeal;
	}

	/**
	 * @param {import('@pins/database/src/client/client').Prisma.AppealCaseRelationshipCreateInput} data
	 * @returns {Promise.<import('@pins/database/src/client/client').AppealCaseRelationship>}
	 */
	async function _createSqlLinkedCases(data) {
		const appealCaseRelationship = await sqlClient.appealCaseRelationship.create({ data });

		appealCaseRelationshipIds.push(appealCaseRelationship.id);

		return appealCaseRelationship;
	}
};
