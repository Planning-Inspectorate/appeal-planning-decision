const TextEntryQuestion = require('@pins/dynamic-forms/src/dynamic-components/text-entry/question');
const { saveAction, getDataToSave } = require('./appeal-grounds-text-entry');

describe('appeal-grounds-boolean-overrides', () => {
	const TITLE = 'title';
	const QUESTION = 'Question?';
	const DESCRIPTION = 'Describe';
	const FIELDNAME = 'fieldName-a';
	const URL = 'url-a';
	const PAGE_TITLE = 'this appears in <title>';

	const PARAMS = {
		title: TITLE,
		question: QUESTION,
		description: DESCRIPTION,
		fieldName: FIELDNAME,
		url: URL,
		pageTitle: PAGE_TITLE
	};

	const question = new TextEntryQuestion(PARAMS, { saveAction, getDataToSave });

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

	const req = {
		body: {
			'fieldName-a': 'A large amount of text about appeal grounds'
		},
		appealsApiClient: mockApi
	};

	const mockSaveAction = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('getDataToSave', () => {
		it('should save the text, parse the field name and update journeyResponse', async () => {
			const result = await question.getDataToSave(req, journeyResponse);

			expect(result.answers['fieldName']).toBe('A large amount of text about appeal grounds');
			expect(journeyResponse.answers['fieldName-a']).toBe(
				'A large amount of text about appeal grounds'
			);
		});
	});

	describe('saveAction', () => {
		it('should successfully save updated appeal ground and call the next question ', async () => {
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
	});
});
