/** @typedef {import('../../journey-response').JourneyResponse} JourneyResponse */
/** @typedef {import('../../question')} Question */

const logicalCombinations = (questionHasAnswer) => ({
	and: (questionKeyTuples) =>
		questionKeyTuples.every((questionKeyTuple) => questionHasAnswer(...questionKeyTuple)),
	or: (questionKeyTuples) =>
		questionKeyTuples.some((questionKeyTuple) => questionHasAnswer(...questionKeyTuple))
});

// TODO make these not higher order once you've made all the section builders use the new withCondition format

// TODO Make a type for all the question classes and use it here
/** @type {(response: JourneyResponse) => (question: any, expectedValue: unknown) => boolean} */
const questionHasAnswerBuilder = (response) => (question, expectedValue) => {
	if (!response.answers) return false;
	const answerField = response.answers[question.fieldName];

	if (Array.isArray(answerField)) {
		return answerField.includes(expectedValue);
	} else if (question.optionJoinString) {
		// todo: answers from options questions sometimes are array sometimes string, why?
		if (!answerField) return false;
		const answers = answerField.split(question.optionJoinString);
		return answers.includes(expectedValue);
	} else {
		return answerField === expectedValue;
	}
};

// TODO Make a type for all the question classes and use it here
/** @type {(response: JourneyResponse) => (questionKeyTuples: [any, unknown][], options?: {logicalCombinator: 'and' | 'or'}) => boolean} */
const questionsHaveAnswersBuilder = (response) => {
	const questionHasAnswer = questionHasAnswerBuilder(response);
	const combinators = logicalCombinations(questionHasAnswer);

	return (questionKeyTuples, { logicalCombinator } = { logicalCombinator: 'and' }) => {
		return combinators[logicalCombinator](questionKeyTuples);
	};
};

const questionHasNonEmptyStringAnswer = (response) => (question) => {
	if (!response.answers) return false;
	const answerField = response.answers[question.fieldName];
	return typeof answerField === 'string' && answerField.trim().length > 0;
};

const questionHasNonEmptyNumberAnswer = (response) => (question) => {
	if (!response.answers) return false;
	const answerField = response.answers[question.fieldName];
	return typeof answerField === 'number' && !isNaN(answerField);
};

module.exports = {
	questionHasAnswerBuilder,
	questionsHaveAnswersBuilder,
	questionHasNonEmptyStringAnswer,
	questionHasNonEmptyNumberAnswer
};
