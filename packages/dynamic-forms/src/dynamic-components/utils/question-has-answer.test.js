const {
	questionHasAnswer,
	questionsHaveAnswers,
	questionHasNonEmptyStringAnswer,
	questionHasNonEmptyNumberAnswer
} = require('./question-has-answer');

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
			const result = questionHasAnswer(
				testResponse,
				testQuestions.aTestQuestion,
				aTestQuestionExpectedResult
			);

			expect(result).toBe(true);
		});

		it('should return false when parameters do not match', () => {
			const result = questionHasAnswer(
				testResponse,
				testQuestions.aTestQuestion,
				aTestQuestionUnexpectedResult
			);

			expect(result).toBe(false);
		});

		it('should return false for options question without answer', () => {
			const result = questionHasAnswer(testResponse, testQuestions.optionQuestion, 'option-a');
			expect(result).toBe(false);
		});

		it('should return false for options question with null answer', () => {
			const result = questionHasAnswer(
				{
					answers: {
						optionQuestion: null
					}
				},
				testQuestions.optionQuestion,
				'option-a'
			);
			expect(result).toBe(false);
		});

		it('should return true for options question with string', () => {
			const result = questionHasAnswer(
				{
					answers: {
						optionQuestion: 'option-a'
					}
				},
				testQuestions.optionQuestion,
				'option-a'
			);
			expect(result).toBe(true);
		});

		it('should return true for options question with joined string', () => {
			const result = questionHasAnswer(
				{
					answers: {
						optionQuestion: `option-a${testQuestions.optionQuestion.optionJoinString}option-b`
					}
				},
				testQuestions.optionQuestion,
				'option-a'
			);
			expect(result).toBe(true);
		});

		it('should return false for options missing from string', () => {
			const result = questionHasAnswer(
				{
					answers: {
						optionQuestion: `option-a${testQuestions.optionQuestion.optionJoinString}option-b`
					}
				},
				testQuestions.optionQuestion,
				'option-c'
			);
			expect(result).toBe(false);
		});

		it('should return true for options question with array', () => {
			const result = questionHasAnswer(
				{
					answers: {
						optionQuestion: ['option-a', 'option-b']
					}
				},
				testQuestions.optionQuestion,
				'option-a'
			);
			expect(result).toBe(true);
		});

		it('should return false for options missing from array', () => {
			const result = questionHasAnswer(
				{
					answers: {
						optionQuestion: ['option-a', 'option-b']
					}
				},
				testQuestions.optionQuestion,
				'option-c'
			);
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
			const result = questionsHaveAnswers(testResponse, questionKeyTuples, { logicalCombinator });
			expect(result).toBe(expectedResult);
		}
	);
	});

	describe('questionHasNonEmptyStringAnswer', () => {
		const question = { fieldName: 'testField' };

		it('returns true for non-empty string', () => {
			const response = { answers: { testField: 'hello' } };
			expect(questionHasNonEmptyStringAnswer(response, question)).toBe(true);
		});

		it('returns false for empty string', () => {
			const response = { answers: { testField: '' } };
			expect(questionHasNonEmptyStringAnswer(response, question)).toBe(false);
		});

		it('returns false for whitespace string', () => {
			const response = { answers: { testField: '   ' } };
			expect(questionHasNonEmptyStringAnswer(response, question)).toBe(false);
		});

		it('returns false if field is not a string', () => {
			const response = { answers: { testField: 123 } };
			expect(questionHasNonEmptyStringAnswer(response, question)).toBe(false);
		});

		it('returns false if answers missing', () => {
			const response = {};
			expect(questionHasNonEmptyStringAnswer(response, question)).toBe(false);
		});
	});

	describe('questionHasNonEmptyNumberAnswer', () => {
		const question = { fieldName: 'numField' };

		it('returns true for a valid number', () => {
			const response = { answers: { numField: 42 } };
			expect(questionHasNonEmptyNumberAnswer(response, question)).toBe(true);
		});

		it('returns false for NaN', () => {
			const response = { answers: { numField: NaN } };
			expect(questionHasNonEmptyNumberAnswer(response, question)).toBe(false);
		});

		it('returns false for non-number', () => {
			const response = { answers: { numField: 'not a number' } };
			expect(questionHasNonEmptyNumberAnswer(response, question)).toBe(false);
		});

		it('returns false if field is undefined', () => {
			const response = { answers: {} };
			expect(questionHasNonEmptyNumberAnswer(response, question)).toBe(false);
		});

		it('returns false if answers missing', () => {
			const response = {};
			expect(questionHasNonEmptyNumberAnswer(response, question)).toBe(false);
		});
	});
});
