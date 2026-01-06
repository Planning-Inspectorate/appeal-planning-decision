const BooleanQuestion = require('@pins/dynamic-forms/src/dynamic-components/boolean/question');
const TextEntryQuestion = require('@pins/dynamic-forms/src/dynamic-components/text-entry/question');

const { saveAction } = require('./appeal-grounds-text-entry');

describe('appeal-grounds-questions-overrides', () => {
	const TITLE = 'title';
	const QUESTION = 'Question?';
	const DESCRIPTION = 'Describe';
	const FIELDNAME = 'fieldName';
	const URL = 'url-a';
	const PAGE_TITLE = 'this appears in <title>';
	const CUSTOM_DATA = {
		groundName: 'a'
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

	const mockApi = {
		postSubmissionAppealGround: jest.fn().mockResolvedValue({})
	};

	const journeyResponse = {
		journeyId: 'journey123',
		referenceId: '1234',
		answers: {
			SubmissionAppealGround: [
				{
					groundName: 'a',
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
		it('should successfully save a boolean to an updated appeal ground and call the next question', async () => {
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

			expect(mockApi.postSubmissionAppealGround).toHaveBeenCalledWith(journeyResponse.referenceId, {
				...journeyResponse.answers.SubmissionAppealGround[0],
				fieldName: true
			});
			expect(mockSaveAction).not.toHaveBeenCalled();
			expect(question.handleNextQuestion).toHaveBeenCalled();
		});

		it('should successfully save text entry to an updated appeal ground and call the next question', async () => {
			const question = new TextEntryQuestion(FULL_PARAMS, { saveAction });

			const req = {
				body: {
					fieldName: 'A large amount of text about appeal grounds'
				},
				appealsApiClient: mockApi
			};

			question.checkForValidationErrors = jest.fn().mockReturnValue(null);
			question.handleNextQuestion = jest.fn();

			await question.saveAction(req, {}, mockSaveAction, {}, {}, journeyResponse);

			expect(mockApi.postSubmissionAppealGround).toHaveBeenCalledWith(journeyResponse.referenceId, {
				...journeyResponse.answers.SubmissionAppealGround[0],
				fieldName: 'A large amount of text about appeal grounds'
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
			).rejects.toThrow('Ground name data missing from question');
		});
	});
});
