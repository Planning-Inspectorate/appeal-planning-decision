const AddMoreQuestion = require('./question');

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
