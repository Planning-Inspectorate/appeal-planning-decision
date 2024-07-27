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
	anotherTestQuestion: { fieldName: 'anotherTestQuestion' },
	optionQuestion: { fieldName: 'optionQuestion', optionJoinString: ',' }
};

describe('question-has-answer', () => {
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

		it('should return false for options question without answer', () => {
			const questionHasAnswerFunction = questionHasAnswerBuilder(testResponse);
			const result = questionHasAnswerFunction(testQuestions.optionQuestion, 'option-a');
			expect(result).toBe(false);
		});

		it('should return false for options question with null answer', () => {
			const questionHasAnswerFunction = questionHasAnswerBuilder({
				answers: {
					optionQuestion: null
				}
			});
			const result = questionHasAnswerFunction(testQuestions.optionQuestion, 'option-a');
			expect(result).toBe(false);
		});

		it('should return true for options question with string', () => {
			const questionHasAnswerFunction = questionHasAnswerBuilder({
				answers: {
					optionQuestion: 'option-a'
				}
			});
			const result = questionHasAnswerFunction(testQuestions.optionQuestion, 'option-a');
			expect(result).toBe(true);
		});

		it('should return true for options question with joined string', () => {
			const questionHasAnswerFunction = questionHasAnswerBuilder({
				answers: {
					optionQuestion: `option-a${testQuestions.optionQuestion.optionJoinString}option-b`
				}
			});
			const result = questionHasAnswerFunction(testQuestions.optionQuestion, 'option-a');
			expect(result).toBe(true);
		});

		it('should return false for options missing from string', () => {
			const questionHasAnswerFunction = questionHasAnswerBuilder({
				answers: {
					optionQuestion: `option-a${testQuestions.optionQuestion.optionJoinString}option-b`
				}
			});
			const result = questionHasAnswerFunction(testQuestions.optionQuestion, 'option-c');
			expect(result).toBe(false);
		});

		it('should return true for options question with array', () => {
			const questionHasAnswerFunction = questionHasAnswerBuilder({
				answers: {
					optionQuestion: ['option-a', 'option-b']
				}
			});
			const result = questionHasAnswerFunction(testQuestions.optionQuestion, 'option-a');
			expect(result).toBe(true);
		});

		it('should return false for options missing from array', () => {
			const questionHasAnswerFunction = questionHasAnswerBuilder({
				answers: {
					optionQuestion: ['option-a', 'option-b']
				}
			});
			const result = questionHasAnswerFunction(testQuestions.optionQuestion, 'option-c');
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
});
