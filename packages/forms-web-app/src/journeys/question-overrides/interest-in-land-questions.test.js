const BooleanQuestion = require('@pins/dynamic-forms/src/dynamic-components/boolean/question');
const RadioQuestion = require('@pins/dynamic-forms/src/dynamic-components/radio/question');

const { saveAction } = require('./interest-in-land-questions');

describe('interest-in-land-question-overrides', () => {
	const TITLE = 'title';
	const QUESTION = 'Question?';
	const DESCRIPTION = 'Describe';
	const FIELDNAME = 'fieldName';
	const URL = 'url-a';
	const PAGE_TITLE = 'this appears in <title>';
	const CUSTOM_DATA = {
		individualId: '123'
	};

	const NO_CUSTOM_DATA_PARAMS = {
		title: TITLE,
		question: QUESTION,
		description: DESCRIPTION,
		fieldName: FIELDNAME,
		url: URL,
		pageTitle: PAGE_TITLE
	};

	const FULL_PARAMS = {
		...NO_CUSTOM_DATA_PARAMS,
		customData: CUSTOM_DATA
	};

	const FULL_RADIO_PARAMS = {
		...FULL_PARAMS,
		options: [
			{
				text: 'Test text',
				value: 'A mock radio option'
			}
		]
	};

	const mockApi = {
		postSubmissionIndividual: jest.fn().mockResolvedValue({})
	};

	const journeyResponse = {
		journeyId: 'journey123',
		referenceId: '1234',
		answers: {
			SubmissionIndividual: [
				{
					id: '123',
					fieldName: null
				}
			]
		}
	};

	const mockSaveAction = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('saveAction', () => {
		it('should successfully save a boolean to an individual and call the next question', async () => {
			const question = new BooleanQuestion(FULL_PARAMS, { saveAction });

			const req = {
				body: {
					fieldName: 'yes'
				},
				appealsApiClient: mockApi
			};

			question.checkForValidationErrors = jest.fn().mockReturnValue(null);
			question.handleNextQuestion = jest.fn();

			await question.saveAction(req, {}, mockSaveAction, {}, {}, journeyResponse);

			expect(mockApi.postSubmissionIndividual).toHaveBeenCalledWith(journeyResponse.referenceId, {
				...journeyResponse.answers.SubmissionIndividual[0],
				fieldName: true
			});
			expect(mockSaveAction).not.toHaveBeenCalled();
			expect(question.handleNextQuestion).toHaveBeenCalled();
		});

		it('should successfully save radio entry to an individual and call the next question', async () => {
			const question = new RadioQuestion(FULL_RADIO_PARAMS, { saveAction });

			const req = {
				body: {
					fieldName: 'A mock radio option'
				},
				appealsApiClient: mockApi
			};

			question.checkForValidationErrors = jest.fn().mockReturnValue(null);
			question.handleNextQuestion = jest.fn();

			await question.saveAction(req, {}, mockSaveAction, {}, {}, journeyResponse);

			expect(mockApi.postSubmissionIndividual).toHaveBeenCalledWith(journeyResponse.referenceId, {
				...journeyResponse.answers.SubmissionIndividual[0],
				fieldName: 'A mock radio option'
			});
			expect(mockSaveAction).not.toHaveBeenCalled();
			expect(question.handleNextQuestion).toHaveBeenCalled();
		});

		it('should throw an error if the question has missing customData', async () => {
			const noDataQuestion = new BooleanQuestion(NO_CUSTOM_DATA_PARAMS, { saveAction });

			const req = {
				body: {
					fieldName: 'yes'
				},
				appealsApiClient: mockApi
			};

			noDataQuestion.checkForValidationErrors = jest.fn().mockReturnValue(null);
			noDataQuestion.handleNextQuestion = jest.fn();

			await expect(
				noDataQuestion.saveAction(req, {}, mockSaveAction, {}, {}, journeyResponse)
			).rejects.toThrow('individual Id data missing from question');
		});
	});
});
