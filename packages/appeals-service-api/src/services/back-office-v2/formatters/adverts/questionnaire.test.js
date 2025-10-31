const { formatter } = require(`./questionnaire`);
const { CASE_TYPES } = require('@pins/common/src/database/data-static');
const ADVERTS = CASE_TYPES.ADVERTS.key;
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
	const answers = {
		correctAppealType: true,
		SubmissionListedBuilding: [
			{ reference: 'LB123', fieldName: 'affectedListedBuildingNumber' },
			{ reference: 'LB124', fieldName: 'changedListedBuildingNumber' }
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
		neighbourSiteAccess_neighbourSiteAccessDetails: 'check the impact',
		SubmissionLinkedCase: [{ caseReference: 'CASE123' }],
		newConditions_newConditionDetails: 'New condition details'
	};

	const casAdvertAnswers = {
		...answers,
		affectsScheduledMonument: true,
		protectedSpecies: true,
		areaOutstandingBeauty: true,
		designatedSites: 'a,b',
		designatedSites_otherDesignations: 'custom',
		statutoryConsultees: 'yes',
		statutoryConsultees_consultedBodiesDetails: 'statutoryConsultees_consultedBodiesDetails',
		emergingPlan: true,
		lpaProcedurePreference: APPEAL_LPA_PROCEDURE_PREFERENCE.INQUIRY,
		lpaPreferInquiryDetails: 'lpaPreferInquiryDetails',
		lpaProcedurePreference_lpaPreferInquiryDuration: '12',
		// adverts specific
		isSiteInAreaOfSpecialControlAdverts: true,
		wasApplicationRefusedDueToHighwayOrTraffic: false,
		didAppellantSubmitCompletePhotosAndPlans: true
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should format the data correctly', async () => {
		const result = await formatter(caseReference, casAdvertAnswers);

		expect(result).toEqual({
			casedata: {
				caseType: ADVERTS,
				caseReference: '12345',
				lpaQuestionnaireSubmittedDate: expect.any(String),
				isCorrectAppealType: true,
				affectedListedBuildingNumbers: ['LB123'],
				changedListedBuildingNumbers: ['LB124'],
				inConservationArea: true,
				isGreenBelt: false,
				notificationMethod: ['notice', 'letter', 'advert'],
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
				newConditionDetails: 'New condition details',
				lpaStatement: '',
				lpaCostsAppliedFor: null,
				affectsScheduledMonument: casAdvertAnswers.affectsScheduledMonument,
				hasProtectedSpecies: casAdvertAnswers.protectedSpecies,
				isAonbNationalLandscape: casAdvertAnswers.areaOutstandingBeauty,
				designatedSitesNames: ['a', 'b', 'custom'],
				hasStatutoryConsultees: true,
				consultedBodiesDetails: casAdvertAnswers.statutoryConsultees_consultedBodiesDetails,
				hasEmergingPlan: casAdvertAnswers.emergingPlan,
				lpaProcedurePreference: casAdvertAnswers.lpaProcedurePreference,
				lpaProcedurePreferenceDetails: casAdvertAnswers.lpaPreferInquiryDetails,
				lpaProcedurePreferenceDuration: Number(
					casAdvertAnswers.lpaProcedurePreference_lpaPreferInquiryDuration
				),
				isSiteInAreaOfSpecialControlAdverts: true,
				wasApplicationRefusedDueToHighwayOrTraffic: false,
				didAppellantSubmitCompletePhotosAndPlans: true
			},
			documents: [1]
		});
	});

	it('should handle missing optional fields', async () => {
		const minimalAnswers = {
			correctAppealType: true,
			lpaProcedurePreference: 'written'
		};
		const result = await formatter(caseReference, minimalAnswers);

		expect(result).toEqual({
			casedata: {
				caseType: ADVERTS,
				caseReference: '12345',
				lpaQuestionnaireSubmittedDate: expect.any(String),
				isCorrectAppealType: true,
				affectedListedBuildingNumbers: [],
				changedListedBuildingNumbers: [],
				inConservationArea: undefined,
				isGreenBelt: undefined,
				notificationMethod: null,
				siteAccessDetails: null,
				siteSafetyDetails: null,
				neighbouringSiteAddresses: undefined,
				reasonForNeighbourVisits: null,
				nearbyCaseReferences: undefined,
				newConditionDetails: null,
				lpaStatement: '',
				lpaCostsAppliedFor: null,

				affectsScheduledMonument: undefined,
				hasProtectedSpecies: undefined,
				isAonbNationalLandscape: undefined,
				designatedSitesNames: [],
				hasStatutoryConsultees: false,
				consultedBodiesDetails: null,
				hasEmergingPlan: undefined,
				lpaProcedurePreference: 'written',
				lpaProcedurePreferenceDetails: null,
				lpaProcedurePreferenceDuration: null,
				isSiteInAreaOfSpecialControlAdverts: undefined,
				wasApplicationRefusedDueToHighwayOrTraffic: undefined,
				didAppellantSubmitCompletePhotosAndPlans: undefined
			},
			documents: [1]
		});
	});
});
