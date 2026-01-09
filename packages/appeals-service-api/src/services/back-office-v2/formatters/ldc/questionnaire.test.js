const { formatter } = require(`./questionnaire`);
const { CASE_TYPES: LDC } = require('@pins/common/src/database/data-static');

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
		SubmissionLinkedCase: [{ caseReference: 'CASE123' }]
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should format the data correctly', async () => {
		const result = await formatter(caseReference, answers);

		expect(result).toEqual({
			casedata: {
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
				nearbyCaseReferences: ['CASE123']
			},
			documents: [1]
		});
	});

	it('should handle missing optional fields', async () => {
		const minimalAnswers = {
			correctAppealType: true
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
				nearbyCaseReferences: undefined
			},
			documents: [1]
		});
	});
});
