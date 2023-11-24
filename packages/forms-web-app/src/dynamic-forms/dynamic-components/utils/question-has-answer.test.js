const { questionHasAnswerBuilder, questionsHaveAnswersBuilder } = require('./question-has-answer');

const aTestQuestionExpectedResult = 'yes';
const aTestQuestionUnexpectedResult = 'no';
const anotherTestQuestionExpectedResult = '0';
const anotherTestQuestionUnexpectedResult = '1';
const testResponse = {
	answers: {
		aTestQuestion: aTestQuestionExpectedResult,
		anotherTestQuestion: anotherTestQuestionExpectedResult
	}
};
const testQuestions = {
	aTestQuestion: { fieldName: 'aTestQuestion' },
	anotherTestQuestion: { fieldName: 'anotherTestQuestion' }
};
describe('questionHasAnswer', () => {
	it('should return true when parameters do match', () => {
		const questionHasAnswerFunction = questionHasAnswerBuilder(testResponse);

		const result = questionHasAnswerFunction(
			testQuestions.aTestQuestion,
			aTestQuestionExpectedResult
		);

		expect(result).toBe(true);
	});

	it('should return false when parameters do not match', () => {
		const questionHasAnswerFunction = questionHasAnswerBuilder(testResponse);

		const result = questionHasAnswerFunction(testQuestions.aTestQuestion);

		expect(result).toBe(false);
	});
});

describe('questionsHaveAnswer', () => {
	// prettier-ignore
	it.each([
		[[[testQuestions.aTestQuestion, aTestQuestionExpectedResult], [testQuestions.anotherTestQuestion, anotherTestQuestionExpectedResult]], 'and', true],
		[[[testQuestions.aTestQuestion, aTestQuestionExpectedResult], [testQuestions.anotherTestQuestion, anotherTestQuestionUnexpectedResult]], 'and', false],
		[[[testQuestions.aTestQuestion, aTestQuestionUnexpectedResult], [testQuestions.anotherTestQuestion, anotherTestQuestionUnexpectedResult]], 'and', false],
		[[[testQuestions.aTestQuestion, aTestQuestionUnexpectedResult], [testQuestions.anotherTestQuestion, anotherTestQuestionExpectedResult]], 'and', false],

		[[[testQuestions.aTestQuestion, aTestQuestionExpectedResult], [testQuestions.anotherTestQuestion, anotherTestQuestionExpectedResult]], 'or', true],
		[[[testQuestions.aTestQuestion, aTestQuestionExpectedResult], [testQuestions.anotherTestQuestion, anotherTestQuestionUnexpectedResult]], 'or', true],
		[[[testQuestions.aTestQuestion, aTestQuestionUnexpectedResult], [testQuestions.anotherTestQuestion, anotherTestQuestionExpectedResult]], 'or', true],
		[[[testQuestions.aTestQuestion, aTestQuestionUnexpectedResult], [testQuestions.anotherTestQuestion, anotherTestQuestionUnexpectedResult]], 'or', false]
	])(
		'should return expectedResult given parameter set and logical combinator',
		(questionKeyTuples, logicalCombinator, expectedResult) => {
			const questionsHaveAnswersFunction = questionsHaveAnswersBuilder(testResponse);

			const result = questionsHaveAnswersFunction(questionKeyTuples, { logicalCombinator });

			expect(result).toBe(expectedResult);
		}
	);
});
