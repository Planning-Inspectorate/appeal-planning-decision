const SiteAddressQuestion = require('@pins/dynamic-forms/src/dynamic-components/site-address/question');
const { saveAction } = require('./site-address');

describe('site-address-overrides', () => {
	const FIELDNAME = 'siteAddress';

	const question = new SiteAddressQuestion(
		{
			title: 'Test Question',
			question: 'Is this a question?',
			fieldName: FIELDNAME,
			viewFolder: 'address-entry'
		},
		{ saveAction }
	);

	const mockApi = {
		postSubmissionAddress: jest.fn().mockResolvedValue({})
	};

	const journeyResponse = {
		journeyId: 'journey123',
		referenceId: '1234',
		answers: {}
	};

	const req = {
		body: {
			siteAddress_addressLine1: '123 Main St',
			siteAddress_addressLine2: 'Floor 2',
			siteAddress_townCity: 'Testville',
			siteAddress_postcode: 'TE1 2ST',
			siteAddress_county: 'Testshire',
			fieldName: FIELDNAME
		},
		appealsApiClient: mockApi
	};

	describe('saveAction', () => {
		it('should successfully save the address and call the next question', async () => {
			const mockSaveAction = jest.fn();

			question.checkForValidationErrors = jest.fn().mockReturnValue(null);
			question.handleNextQuestion = jest.fn();

			await question.saveAction(req, {}, mockSaveAction, {}, {}, journeyResponse);

			expect(mockApi.postSubmissionAddress).toHaveBeenCalledWith(
				journeyResponse.journeyId,
				journeyResponse.referenceId,
				{
					addressLine1: '123 Main St',
					addressLine2: 'Floor 2',
					townCity: 'Testville',
					postcode: 'TE1 2ST',
					county: 'Testshire',
					fieldName: FIELDNAME
				}
			);
			expect(mockSaveAction).toHaveBeenCalled();
			expect(question.handleNextQuestion).toHaveBeenCalled();
		});
	});
});
