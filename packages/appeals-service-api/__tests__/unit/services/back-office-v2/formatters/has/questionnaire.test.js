const {
	formatter
} = require(`../../../../../../src/services/back-office-v2/formatters/has/questionnaire`);
const {
	getDocuments,
	howYouNotifiedPeople
} = require(`../../../../../../src/services/back-office-v2/formatters/utils`);
const { documentTypes } = require('@pins/common/src/document-types');

jest.mock(`../../../../../../src/services/back-office-v2/formatters/utils`);

describe('formatter', () => {
	const caseReference = '12345';
	const answers = {
		correctAppealType: true,
		SubmissionListedBuilding: [{ reference: 'LB123' }],
		conservationArea: true,
		greenBelt: false,
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
		SubmissionLinkedCase: [{ caseReference: 'CASE123' }],
		newConditions_newConditionDetails: 'New condition details'
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should format the data correctly', async () => {
		getDocuments.mockResolvedValue(['doc1', 'doc2']);
		howYouNotifiedPeople.mockReturnValue('Email');

		const result = await formatter(caseReference, answers);

		expect(result).toEqual({
			casedata: {
				caseReference: '12345',
				lpaQuestionnaireSubmittedDate: expect.any(String),
				isCorrectAppealType: true,
				affectedListedBuildingNumbers: ['LB123'],
				inConservationArea: true,
				isGreenBelt: false,
				notificationMethod: 'Email',
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
				nearbyCaseReferences: ['CASE123'],
				newConditionDetails: 'New condition details',
				lpaStatement: '',
				lpaCostsAppliedFor: null
			},
			documents: ['doc1', 'doc2']
		});

		expect(getDocuments).toHaveBeenCalledWith(
			answers,
			documentTypes.planningOfficersReportUpload.dataModelName
		);
		expect(howYouNotifiedPeople).toHaveBeenCalledWith(answers);
	});

	it('should handle missing optional fields', async () => {
		const minimalAnswers = {
			correctAppealType: true
		};

		getDocuments.mockResolvedValue([]);
		howYouNotifiedPeople.mockReturnValue('Email');

		const result = await formatter(caseReference, minimalAnswers);

		expect(result).toEqual({
			casedata: {
				caseReference: '12345',
				lpaQuestionnaireSubmittedDate: expect.any(String),
				isCorrectAppealType: true,
				affectedListedBuildingNumbers: undefined,
				inConservationArea: undefined,
				isGreenBelt: undefined,
				notificationMethod: 'Email',
				siteAccessDetails: null,
				siteSafetyDetails: null,
				neighbouringSiteAddresses: undefined,
				nearbyCaseReferences: undefined,
				newConditionDetails: null,
				lpaStatement: '',
				lpaCostsAppliedFor: null
			},
			documents: []
		});

		expect(getDocuments).toHaveBeenCalledWith(
			minimalAnswers,
			documentTypes.planningOfficersReportUpload.dataModelName
		);
		expect(howYouNotifiedPeople).toHaveBeenCalledWith(minimalAnswers);
	});
});
