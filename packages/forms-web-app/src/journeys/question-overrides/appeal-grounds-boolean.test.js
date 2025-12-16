const BooleanQuestion = require('@pins/dynamic-forms/src/dynamic-components/boolean/question');
const { saveAction, getDataToSave } = require('./appeal-grounds-boolean');

describe('appeal-grounds-boolean-overrides', () => {
	const TITLE = 'title';
	const QUESTION = 'Question?';
	const DESCRIPTION = 'Describe';
	const FIELDNAME = 'fieldName-a';
	const URL = 'url-a';
	const PAGE_TITLE = 'this appears in <title>';

	const BOOLEAN_PARAMS = {
		title: TITLE,
		question: QUESTION,
		description: DESCRIPTION,
		fieldName: FIELDNAME,
		url: URL,
		pageTitle: PAGE_TITLE
	};

	const question = new BooleanQuestion(BOOLEAN_PARAMS, { saveAction, getDataToSave });

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
			'fieldName-a': 'yes'
		},
		appealsApiClient: mockApi
	};

	const mockSaveAction = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('getDataToSave', () => {
		it('should save true for "yes", parse the field name and update journeyResponse', async () => {
			const result = await question.getDataToSave(req, journeyResponse);

			expect(result.answers['fieldName']).toBe(true);
			expect(journeyResponse.answers['fieldName-a']).toBe('yes');
		});

		it('should save false for "no", parse the field name and update journeyResponse', async () => {
			const req = { body: { 'fieldName-a': 'no' } };
			const result = await question.getDataToSave(req, journeyResponse);

			expect(result.answers['fieldName']).toBe(false);
			expect(journeyResponse.answers['fieldName-a']).toBe('no');
		});
	});

	describe('saveAction', () => {
		it('should successfully save updated appeal ground and call the next question ', async () => {
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
	});
});
