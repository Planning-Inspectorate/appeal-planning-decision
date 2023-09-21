const AddMoreQuestion = require('./question');
const Question = require('../../question');
const uuid = require('uuid');
jest.mock('uuid');

const TITLE = 'Question1';
const QUESTION_STRING = 'What is your favourite colour?';
const FIELDNAME = 'favouriteColour';

class TestQuestion extends Question {}

describe('./src/dynamic-forms/dynamic-components/question.js', () => {
	const getTestQuestion = () => {
		return new AddMoreQuestion({
			subQuestion: new TestQuestion({
				title: TITLE,
				question: QUESTION_STRING,
				fieldName: FIELDNAME,
				viewFolder: 'view-folder',
				validators: []
			})
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
					[question.subQuestion.fieldName]: { a: 1 }
				}
			};

			const journeyResponse = { answers: {} };

			const result = await question.getDataToSave(req, journeyResponse);

			const expectedResult = {
				[question.subQuestion.fieldName]: { a: 1 },
				addMoreId: expectedId
			};
			// this will break things if the subquestion has the same fieldname as a question in the journey
			const expectedSideEffect = {
				answers: {
					[question.subQuestion.fieldName]: { a: 1 }
				}
			};
			expect(result).toEqual(expectedResult);
			expect(journeyResponse).toEqual(expectedSideEffect);
		});
	});

	describe('renderAction', () => {
		it('should call renderAction on subQuestion', async () => {
			const question = getTestQuestion();
			const fakeResult = { a: 1 };
			question.subQuestion.renderAction = jest.fn(() => fakeResult);
			const result = question.renderAction();
			expect(result).toEqual(fakeResult);
		});
	});

	describe('prepQuestionForRendering', () => {
		it('should call prepQuestionForRendering on subQuestion', async () => {
			const question = getTestQuestion();
			const fakeResult = { a: 1 };
			question.subQuestion.prepQuestionForRendering = jest.fn(() => fakeResult);
			const result = question.prepQuestionForRendering();
			expect(result).toEqual(fakeResult);
		});
	});

	describe('formatAnswerForSummary', () => {
		it('should call formatAnswerForSummary on subQuestion', async () => {
			const question = getTestQuestion();
			const expectedResult = { a: 1 };
			const mockData = { [question.subQuestion.fieldName]: expectedResult };
			question.subQuestion.formatAnswerForSummary = jest.fn((fake) => fake);
			const result = question.formatAnswerForSummary(mockData);
			expect(result).toEqual(expectedResult);
		});
	});
});
