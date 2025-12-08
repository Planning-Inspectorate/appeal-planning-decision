const AppealGroundsCheckboxQuestion = require('@pins/dynamic-forms/src/dynamic-components/appeal-grounds-checkbox/question');
const { saveAction } = require('./appeal-grounds-checkbox');

describe('appeal-grounds-checkbox-overrides', () => {
	const TITLE = 'title';
	const QUESTION = 'Question?';
	const DESCRIPTION = 'Describe';
	const FIELDNAME = 'field-name';
	const URL = 'url';
	const PAGE_TITLE = 'this appears in <title>';
	const OPTIONS = [
		{ text: 'a', value: 'a' },
		{ text: 'b', value: 'a' }
	];
	const CHECKBOX_PARAMS = {
		title: TITLE,
		question: QUESTION,
		description: DESCRIPTION,
		fieldName: FIELDNAME,
		url: URL,
		pageTitle: PAGE_TITLE,
		options: OPTIONS
	};

	const question = new AppealGroundsCheckboxQuestion(CHECKBOX_PARAMS, { saveAction });

	const mockApi = {
		postSubmissionAppealGround: jest.fn().mockResolvedValue({}),
		deleteSubmissionAppealGround: jest.fn().mockResolvedValue({})
	};

	const journeyResponse = {
		journeyId: 'journey123',
		referenceId: '1234',
		answers: {}
	};

	const req = {
		body: {
			'field-name': [OPTIONS[0].value]
		},
		appealsApiClient: mockApi
	};

	const mockSaveAction = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('saveAction', () => {
		it('should successfully save appeal grounds and call the next question - no previous grounds submitted', async () => {
			question.checkForValidationErrors = jest.fn().mockReturnValue(null);
			question.handleNextQuestion = jest.fn();

			await question.saveAction(req, {}, mockSaveAction, {}, {}, journeyResponse);

			expect(mockApi.postSubmissionAppealGround).toHaveBeenCalledWith(journeyResponse.referenceId, {
				groundName: OPTIONS[0].value
			});
			expect(mockApi.deleteSubmissionAppealGround).not.toHaveBeenCalled();
			expect(mockSaveAction).toHaveBeenCalled();
			expect(question.handleNextQuestion).toHaveBeenCalled();
		});

		it('should successfully save delete removed grounds and call the next question - no new grounds added', async () => {
			const mockSaveAction = jest.fn();

			const previouslySubmittedResponse = {
				...journeyResponse,
				answers: {
					SubmissionAppealGround: [
						{
							id: '123',
							groundName: 'a'
						},
						{
							id: '234',
							groundName: 'b'
						}
					]
				}
			};

			question.checkForValidationErrors = jest.fn().mockReturnValue(null);
			question.handleNextQuestion = jest.fn();

			await question.saveAction(req, {}, mockSaveAction, {}, {}, previouslySubmittedResponse);

			expect(mockApi.postSubmissionAppealGround).not.toHaveBeenCalled();
			expect(mockApi.deleteSubmissionAppealGround).toHaveBeenCalledWith(
				journeyResponse.referenceId,
				'234'
			);
			expect(mockSaveAction).toHaveBeenCalled();
			expect(question.handleNextQuestion).toHaveBeenCalled();
		});

		it('should successfully save delete removed grounds, add new grounds and call the next question', async () => {
			const mockSaveAction = jest.fn();

			const previouslySubmittedResponse = {
				...journeyResponse,
				answers: {
					SubmissionAppealGround: [
						{
							id: '234',
							groundName: 'b'
						}
					]
				}
			};

			question.checkForValidationErrors = jest.fn().mockReturnValue(null);
			question.handleNextQuestion = jest.fn();

			await question.saveAction(req, {}, mockSaveAction, {}, {}, previouslySubmittedResponse);

			expect(mockApi.postSubmissionAppealGround).toHaveBeenCalledWith(journeyResponse.referenceId, {
				groundName: OPTIONS[0].value
			});
			expect(mockApi.deleteSubmissionAppealGround).toHaveBeenCalledWith(
				journeyResponse.referenceId,
				'234'
			);
			expect(mockSaveAction).toHaveBeenCalled();
			expect(question.handleNextQuestion).toHaveBeenCalled();
		});
	});
});
