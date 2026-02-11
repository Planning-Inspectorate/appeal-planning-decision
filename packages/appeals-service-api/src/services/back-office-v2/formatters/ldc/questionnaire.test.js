const { formatter } = require(`./questionnaire`);
const {
	CASE_TYPES: { LDC }
} = require('@pins/common/src/database/data-static');

jest.mock('../../../../services/object-store');

// Mock getDocuments
jest.mock('../utils', () => {
	const originalModule = jest.requireActual('../utils');
	return {
		...originalModule,
		getDocuments: jest.fn(() => [1])
	};
});

describe('ldc lpaq formatter', () => {
	const caseReference = '12345';
	const answers = {
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
		correctAppealType: true,
		appealUnderActSection: 'proposed-changes-to-a-listed-building',
		planningCondition: 'yes',
		previousPlanningPermissionUpload: 'yes',
		noticeDateApplication: 'yes',
		noticeDateApplicationUpload: 'yes',
		relatedApplications: 'yes',
		relatedApplicationsUpload: 'yes',
		lpaConsiderAppealInvalid: 'yes',
		lpaConsiderAppealInvalid_lpaAppealInvalidReasons: 'invalid reasons',
		planningOfficersReport: 'yes',
		uploadPlanningOfficerReport: 'yes',
		infrastructureLevy: 'yes',
		infrastructureLevyUpload: 'yes',
		infrastructureLevyAdopted: 'yes',
		infrastructureLevyAdoptedDate: new Date('2026-01-01'),
		otherRelevantMatters: 'yes',
		otherRelevantMattersUpload: 'yes',
		lpaProcedurePreference: 'written'
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should format the data correctly', async () => {
		const result = await formatter(caseReference, answers);

		expect(result).toEqual({
			casedata: {
				// Common LPAQ submission fields
				caseType: LDC.key,
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
				// HAS LPAQ submission fields
				isCorrectAppealType: true,
				affectedListedBuildingNumbers: [],
				inConservationArea: undefined,
				isGreenBelt: undefined,
				notificationMethod: null,
				newConditionDetails: null,
				lpaStatement: '',
				lpaCostsAppliedFor: null,
				// LPA procedure preference fields
				lpaProcedurePreference: 'written',
				lpaProcedurePreferenceDetails: null,
				lpaProcedurePreferenceDuration: null,
				// Infrastructure levy fields
				hasInfrastructureLevy: true,
				isInfrastructureLevyFormallyAdopted: true,
				infrastructureLevyAdoptedDate: '2026-01-01T00:00:00.000Z',
				infrastructureLevyExpectedDate: null,
				// LDC specific LPAQ submission fields
				appealUnderActSection: 'proposed-changes-to-a-listed-building',
				lpaConsiderAppealInvalid: true,
				lpaAppealInvalidReasons: 'invalid reasons'
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
				caseType: LDC.key,
				caseReference: '12345',
				lpaQuestionnaireSubmittedDate: expect.any(String),
				siteAccessDetails: null,
				siteSafetyDetails: null,
				neighbouringSiteAddresses: undefined,
				reasonForNeighbourVisits: null,
				nearbyCaseReferences: undefined,
				// HAS LPAQ submission fields
				isCorrectAppealType: true,
				affectedListedBuildingNumbers: [],
				inConservationArea: undefined,
				isGreenBelt: undefined,
				notificationMethod: null,
				newConditionDetails: null,
				lpaStatement: '',
				lpaCostsAppliedFor: null,
				// LPA procedure preference fields
				lpaProcedurePreference: 'written',
				lpaProcedurePreferenceDetails: null,
				lpaProcedurePreferenceDuration: null,
				// Infrastructure levy fields
				hasInfrastructureLevy: false,
				isInfrastructureLevyFormallyAdopted: null,
				infrastructureLevyAdoptedDate: null,
				infrastructureLevyExpectedDate: null,
				// LDC specific LPAQ submission fields
				appealUnderActSection: null,
				lpaConsiderAppealInvalid: false,
				lpaAppealInvalidReasons: null
			},
			documents: [1]
		});
	});
});
