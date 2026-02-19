const { formatter } = require(`../enforcement-listed/questionnaire`);
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const ENFORCEMENT_LISTED = CASE_TYPES.ENFORCEMENT_LISTED.key;
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
	const enforcementListedAnswers = {
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
		section3aGrant: true, // ELB specific
		consultHistoricEngland: true, // ELB specific
		environmentalImpactSchedule: 'hello',
		developmentDescription: 'eiaDevelopmentDescription',
		sensitiveArea_sensitiveAreaDetails: 'sensitiveArea_sensitiveAreaDetails',
		columnTwoThreshold: true,
		screeningOpinion: true,
		environmentalStatement: true,
		infrastructureLevy: true,
		infrastructureLevyAdopted: true,
		infrastructureLevyAdoptedDate: new Date(),
		infrastructureLevyExpectedDate: null,
		lpaProcedurePreference: APPEAL_LPA_PROCEDURE_PREFERENCE.INQUIRY,
		lpaPreferInquiryDetails: 'lpaPreferInquiryDetails',
		lpaProcedurePreference_lpaPreferInquiryDuration: '12',
		appealCaseReference: '4000015',
		submitted: false,
		submissionPdfId: null,
		affectsListedBuilding: false,
		affectedListedBuildingNumber: null,
		addAffectedListedBuilding: null,
		changesListedBuilding: false,
		changedListedBuildingNumber: null,
		addChangedListedBuilding: null,
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
		listOfPeopleSentEnforcementNotice: true,
		otherOperations: true,
		siteAreaSquareMetres: 234,
		allegedBreachArea: false,
		allegedBreachArea_allegedBreachAreaSquareMetres: 500,
		createFloorSpace: true,
		createFloorSpace_createFloorSpaceSquareMetres: 250,
		refuseWasteMaterials: true,
		mineralExtractionMaterials: true,
		storeMinerals: true,
		createBuilding: true,
		agriculturalPurposes: true,
		singleHouse: true,
		planningOfficerReport: false,
		localDevelopmentOrder: false,
		localDevelopmentOrderUpload: null,
		previousPlanningPermission: true,
		previousPlanningPermissionUpload: true,
		noticeDateApplication: true,
		noticeDateApplicationUpload: true,
		noticePlanUpload: true,
		appellantSubmittedEnvironmentalStatement: 'yes',
		AppealCase: { LPACode: 'Q1111', appealTypeCode: 'ENFORCEMENT_LISTED' }
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should format the Enforcement Listed Building data correctly', async () => {
		const result = await formatter(caseReference, enforcementListedAnswers);
		expect(result).toEqual({
			casedata: {
				caseType: ENFORCEMENT_LISTED,
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
					enforcementListedAnswers.infrastructureLevyAdoptedDate.toISOString(),
				infrastructureLevyExpectedDate: enforcementListedAnswers.infrastructureLevyExpectedDate,
				isCorrectAppealType: enforcementListedAnswers.correctAppealType,
				changedListedBuildingNumbers: ['LB123'],
				affectedListedBuildingNumbers: ['LB1234'],
				affectsScheduledMonument: enforcementListedAnswers.affectsScheduledMonument,
				inConservationArea: enforcementListedAnswers.conservationArea,
				hasProtectedSpecies: enforcementListedAnswers.protectedSpecies,
				isGreenBelt: enforcementListedAnswers.greenBelt,
				isAonbNationalLandscape: enforcementListedAnswers.areaOutstandingBeauty,
				designatedSitesNames: ['a', 'b', 'custom'],
				notificationMethod: ['notice', 'letter', 'advert'],
				isGypsyOrTravellerSite: enforcementListedAnswers.gypsyTraveller,
				siteAreaSquareMetres: Number(enforcementListedAnswers.siteAreaSquareMetres),
				eiaEnvironmentalImpactSchedule: enforcementListedAnswers.environmentalImpactSchedule,
				eiaDevelopmentDescription: enforcementListedAnswers.developmentDescription || null,
				eiaSensitiveAreaDetails: enforcementListedAnswers.sensitiveArea_sensitiveAreaDetails,
				eiaColumnTwoThreshold: enforcementListedAnswers.columnTwoThreshold,
				eiaScreeningOpinion: enforcementListedAnswers.screeningOpinion,
				eiaRequiresEnvironmentalStatement: enforcementListedAnswers.environmentalStatement,
				eiaCompletedEnvironmentalStatement: true,
				hasInfrastructureLevy: enforcementListedAnswers.infrastructureLevy,
				isInfrastructureLevyFormallyAdopted: enforcementListedAnswers.infrastructureLevyAdopted,
				lpaProcedurePreference: enforcementListedAnswers.lpaProcedurePreference,
				lpaProcedurePreferenceDetails: enforcementListedAnswers.lpaPreferInquiryDetails,
				lpaProcedurePreferenceDuration: Number(
					enforcementListedAnswers.lpaProcedurePreference_lpaPreferInquiryDuration
				),
				lpaCostsAppliedFor: null,
				lpaStatement: '',
				newConditionDetails: 'New condition details',
				changeOfUseMineralExtraction: enforcementListedAnswers.mineralExtractionMaterials,
				changeOfUseMineralStorage: enforcementListedAnswers.storeMinerals,
				changeOfUseRefuseOrWaste: enforcementListedAnswers.refuseWasteMaterials,
				floorSpaceCreatedByBreachInSquareMetres:
					enforcementListedAnswers.createFloorSpace_createFloorSpaceSquareMetres,
				areaOfAllegedBreachInSquareMetres:
					enforcementListedAnswers.allegedBreachArea_allegedBreachAreaSquareMetres,
				noticeRelatesToBuildingEngineeringMiningOther: enforcementListedAnswers.otherOperations,
				relatesToBuildingSingleDwellingHouse: enforcementListedAnswers.singleHouse,
				relatesToBuildingWithAgriculturalPurpose: enforcementListedAnswers.agriculturalPurposes,
				relatesToErectionOfBuildingOrBuildings: enforcementListedAnswers.createBuilding,

				// ELB specific
				preserveGrantLoan: true,
				consultHistoricEngland: true
			},
			documents: [1]
		});
	});
});
