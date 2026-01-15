const { formatter } = require(`./questionnaire`);
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const ENFORCEMENT = CASE_TYPES.ENFORCEMENT.key;
const { APPEAL_LPA_PROCEDURE_PREFERENCE } = require('@planning-inspectorate/data-model');

jest.mock('../../../../services/object-store');

// Mock getDocuments
jest.mock('../utils', () => {
	const originalModule = jest.requireActual('../utils');
	return {
		...originalModule,
		getDocuments: jest.fn(() => [1])
	};
});

describe('formatter', () => {
	const caseReference = '12345';
	const enforcementAnswers = {
		correctAppealType: true,
		SubmissionListedBuilding: [
			{
				reference: 'LB123',
				fieldName: 'changedListedBuildingNumber',
				name: 'Affected Listed Building',
				listedBuildingGrade: 'Grade I',
				id: 'abc123'
			},
			{
				reference: 'LB1234',
				fieldName: 'affectedListedBuildingNumber',
				name: 'Affected Listed Building Two',
				listedBuildingGrade: 'Grade II',
				id: 'abc1234'
			}
		],
		conservationArea: true,
		greenBelt: false,
		notificationMethod: 'site-notice,letters-or-emails,advert',
		lpaSiteAccess_lpaSiteAccessDetails: 'Access details',
		lpaSiteSafetyRisks_lpaSiteSafetyRiskDetails: 'Safety details',
		SubmissionAddress: [
			{
				fieldName: 'neighbourSiteAddress',
				addressLine1: 'Line 1',
				addressLine2: 'Line 2',
				townCity: 'Town',
				county: 'County',
				postcode: 'Postcode'
			}
		],
		neighbouringSite: 'yes',
		neighbourSiteAccess_neighbourSiteAccessDetails: 'check the impact',
		SubmissionLinkedCase: [{ caseReference: 'CASE123' }],
		newConditions_newConditionDetails: 'New condition details',
		affectsScheduledMonument: true,
		protectedSpecies: true,
		areaOutstandingBeauty: true,
		designatedSites: 'a,b',
		designatedSites_otherDesignations: 'custom',
		treePreservationOrder: true,
		gypsyTraveller: true,
		publicRightOfWay: true,
		section3aGrant: true,
		consultHistoricEngland: true,
		environmentalImpactSchedule: 'hello',
		developmentDescription: 'eiaDevelopmentDescription',
		sensitiveArea_sensitiveAreaDetails: 'sensitiveArea_sensitiveAreaDetails',
		columnTwoThreshold: true,
		screeningOpinion: true,
		environmentalStatement: true,
		applicantSubmittedEnvironmentalStatement: 'yes',
		statutoryConsultees: 'yes',
		statutoryConsultees_consultedBodiesDetails: 'statutoryConsultees_consultedBodiesDetails',
		consultationResponses: true,
		emergingPlan: true,
		supplementaryPlanningDocs: true,
		infrastructureLevy: true,
		infrastructureLevyAdopted: true,
		infrastructureLevyAdoptedDate: new Date(),
		infrastructureLevyExpectedDate: null,
		lpaProcedurePreference: APPEAL_LPA_PROCEDURE_PREFERENCE.INQUIRY,
		lpaPreferInquiryDetails: 'lpaPreferInquiryDetails',
		lpaProcedurePreference_lpaPreferInquiryDuration: '12',
		appealCaseReference: '4000014',
		submitted: false,
		submissionPdfId: null,
		affectsListedBuilding: false,
		affectedListedBuildingNumber: null,
		addAffectedListedBuilding: null,
		changesListedBuilding: false,
		changedListedBuildingNumber: null,
		addChangedListedBuilding: null,
		otherPartyRepresentations: null,
		accessForInspection: 'yes',
		lpaSiteAccess: 'yes',
		neighbourSiteAccess: 'yes',
		addNeighbourSiteAccess: true,
		neighbourSiteAddress: null,
		lpaSiteSafetyRisks: 'yes',
		lpaPreferHearingDetails: 'hfhskj',
		nearbyAppeals: true,
		addNearbyAppeal: true,
		newConditions: 'yes',
		developmentPlanPolicies: false,
		otherRelevantPolicies: false,
		scopingOpinion: null,
		sensitiveArea: 'yes',
		appealNotification: true,
		demolishAlterExtend: null,
		listedBuildingGrade: null,
		isSiteInAreaOfSpecialControlAdverts: null,
		wasApplicationRefusedDueToHighwayOrTraffic: null,
		didAppellantSubmitCompletePhotosAndPlans: null,
		listOfPeopleSentEnforcementNotice: true,
		otherOperations: true,
		siteAreaSquareMetres: 234,
		allegedBreachArea: true,
		createFloorSpace: true,
		refuseWasteMaterials: true,
		mineralExtractionMaterials: true,
		storeMinerals: true,
		createBuilding: true,
		agriculturalPurposes: true,
		singleHouse: true,
		trunkRoad: 'yes',
		trunkRoad_enforcementTrunkRoadDetails: 'blah balh',
		crownLand: true,
		stopNotice: false,
		stopNoticeUpload: null,
		developmentRights: false,
		developmentRightsUpload: null,
		developmentRightsRemoved: 'fghn',
		planningOfficerReport: false,
		localDevelopmentOrder: false,
		localDevelopmentOrderUpload: null,
		previousPlanningPermission: true,
		previousPlanningPermissionUpload: true,
		noticeDateApplication: true,
		noticeDateApplicationUpload: true,
		noticePlanUpload: true,
		planningContraventionNotice: false,
		planningContraventionNoticeUpload: null,
		appellantSubmittedEnvironmentalStatement: 'yes',
		AppealCase: { LPACode: 'Q1111', appealTypeCode: 'ENFORCEMENT' }
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should format the Enforcement data correctly', async () => {
		const result = await formatter(caseReference, enforcementAnswers);
		expect(result).toEqual({
			casedata: {
				caseType: ENFORCEMENT,
				caseReference: '12345',
				lpaQuestionnaireSubmittedDate: expect.any(String),
				siteAccessDetails: ['Access details'],
				siteSafetyDetails: ['Safety details'],
				neighbouringSiteAddresses: [
					{
						neighbouringSiteAddressLine1: 'Line 1',
						neighbouringSiteAddressLine2: 'Line 2',
						neighbouringSiteAddressTown: 'Town',
						neighbouringSiteAddressCounty: 'County',
						neighbouringSiteAddressPostcode: 'Postcode',
						neighbouringSiteAccessDetails: null,
						neighbouringSiteSafetyDetails: null
					}
				],
				reasonForNeighbourVisits: 'check the impact',
				nearbyCaseReferences: ['CASE123'],
				infrastructureLevyAdoptedDate:
					enforcementAnswers.infrastructureLevyAdoptedDate.toISOString(),
				infrastructureLevyExpectedDate: enforcementAnswers.infrastructureLevyExpectedDate,
				isCorrectAppealType: enforcementAnswers.correctAppealType,
				hasChangesListedBuilding: enforcementAnswers.changesListedBuilding,
				changedListedBuildingNumbers: ['LB123'],
				isAffectsListedBuilding: enforcementAnswers.affectsListedBuilding,
				affectedListedBuildingNumbers: ['LB1234'],
				affectsScheduledMonument: enforcementAnswers.affectsScheduledMonument,
				inConservationArea: enforcementAnswers.conservationArea,
				hasProtectedSpecies: enforcementAnswers.protectedSpecies,
				isGreenBelt: enforcementAnswers.greenBelt,
				isAonbNationalLandscape: enforcementAnswers.areaOutstandingBeauty,
				designatedSitesNames: ['a', 'b', 'custom'],
				hasTreePreservationOrder: enforcementAnswers.treePreservationOrder,
				hasConsultationResponses: enforcementAnswers.consultationResponses,
				hasStatutoryConsultees: true,
				notificationMethod: ['notice', 'letter', 'advert'],
				consultedBodiesDetails: enforcementAnswers.statutoryConsultees_consultedBodiesDetails,
				isGypsyOrTravellerSite: enforcementAnswers.gypsyTraveller,
				isPublicRightOfWay: enforcementAnswers.publicRightOfWay,
				otherOperations: enforcementAnswers.otherOperations,
				sireAreaSquareMetres: enforcementAnswers.siteAreaSquareMetres,
				allegedBreachArea: enforcementAnswers.allegedBreachArea,
				createFloorSpace: enforcementAnswers.createFloorSpace,
				refuseWasteMaterials: enforcementAnswers.refuseWasteMaterials,
				mineralExtractionMaterials: enforcementAnswers.mineralExtractionMaterials,
				storeMinerals: enforcementAnswers.storeMinerals,
				createBuilding: enforcementAnswers.createBuilding,
				agriculturalPurposes: enforcementAnswers.agriculturalPurposes,
				singleHouse: enforcementAnswers.singleHouse,
				trunkRoadDetails: enforcementAnswers.trunkRoad_enforcementTrunkRoadDetails,
				crownLand: enforcementAnswers.crownLand,
				stopNotice: enforcementAnswers.stopNotice,
				developmentRightsRemoved: enforcementAnswers.developmentRightsRemoved,
				eiaEnvironmentalImpactSchedule: enforcementAnswers.environmentalImpactSchedule,
				eiaDevelopmentDescription: enforcementAnswers.developmentDescription || null,
				eiaSensitiveAreaDetails: enforcementAnswers.sensitiveArea_sensitiveAreaDetails,
				eiaColumnTwoThreshold: enforcementAnswers.columnTwoThreshold,
				eiaScreeningOpinion: enforcementAnswers.screeningOpinion,
				eiaRequiresEnvironmentalStatement: enforcementAnswers.environmentalStatement,
				eiaCompletedEnvironmentalStatement: true,
				hasDevelopmentPlanPolicies: enforcementAnswers.developmentPlanPolicies,
				hasOtherRelevantPolicies: enforcementAnswers.otherRelevantPolicies,
				hasEmergingPlan: enforcementAnswers.emergingPlan,
				hasSupplementaryPlanningDocs: enforcementAnswers.supplementaryPlanningDocs,
				localDevelopmentOrder: enforcementAnswers.localDevelopmentOrder,
				previousPlanningPermission: enforcementAnswers.previousPlanningPermission,
				noticeDateApplication: enforcementAnswers.noticeDateApplication,
				planningContraventionNotice: enforcementAnswers.planningContraventionNotice,
				accessForInspection: enforcementAnswers.lpaSiteAccess,
				neighbouringSite: enforcementAnswers.neighbouringSite,
				hasNearbyAppeals: enforcementAnswers.nearbyAppeals,
				newConditions: enforcementAnswers.newConditions,
				hasInfrastructureLevy: enforcementAnswers.infrastructureLevy,
				isInfrastructureLevyFormallyAdopted: enforcementAnswers.infrastructureLevyAdopted,
				lpaProcedurePreference: enforcementAnswers.lpaProcedurePreference,
				lpaProcedurePreferenceDetails: enforcementAnswers.lpaPreferInquiryDetails,
				lpaProcedurePreferenceDuration: Number(
					enforcementAnswers.lpaProcedurePreference_lpaPreferInquiryDuration
				),
				lpaCostsAppliedFor: null,
				lpaStatement: '',
				newConditionDetails: 'New condition details'
			},
			documents: [1]
		});
	});
});
