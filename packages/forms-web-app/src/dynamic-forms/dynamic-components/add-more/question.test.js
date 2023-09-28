const AddMoreQuestion = require('./question');
const uuid = require('uuid');
jest.mock('uuid');

const TITLE = 'Question1';
const QUESTION_STRING = 'What is your favourite colour?';
const FIELDNAME = 'favouriteColour';

describe('./src/dynamic-forms/dynamic-components/question.js', () => {
	const getTestQuestion = () => {
		return new AddMoreQuestion({
			title: TITLE,
			question: QUESTION_STRING,
			fieldName: FIELDNAME,
			viewFolder: 'view-folder',
			validators: []
		});
	};

	describe('constructor', () => {
		it('should create', () => {
			const question = getTestQuestion();
			expect(question).toBeTruthy();
		});
	});

	describe('getDataToSave', () => {
		it('should add a uuid to the data to save', async () => {
			const expectedId = 'abc';
			uuid.v4.mockReturnValue(expectedId);

			const question = getTestQuestion();

			const req = {
				body: {
					[question.fieldName]: { a: 1 }
				}
			};

			const journeyResponse = { answers: {} };

			const result = await question.getDataToSave(req, journeyResponse);

			const expectedResult = {
				value: { a: 1 },
				addMoreId: expectedId
			};
			expect(result).toEqual(expectedResult);
		});
	});

	describe('renderAction', () => {
		it('should call renderAction on subQuestion', async () => {
			const question = getTestQuestion();
			const fakeResult = { a: 1 };
			question.renderAction = jest.fn(() => fakeResult);
			const result = question.renderAction();
			expect(result).toEqual(fakeResult);
		});
	});

	describe('prepQuestionForRendering', () => {
		it('should call prepQuestionForRendering on subQuestion', async () => {
			const question = getTestQuestion();
			const fakeResult = { a: 1 };
			question.prepQuestionForRendering = jest.fn(() => fakeResult);
			const result = question.prepQuestionForRendering();
			expect(result).toEqual(fakeResult);
		});
	});
});
