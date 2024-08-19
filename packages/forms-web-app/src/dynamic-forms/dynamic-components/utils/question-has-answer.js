/** @typedef {import('../../journey-response').JourneyResponse} JourneyResponse */
/** @typedef {import('../../question')} Question */

/** @type {(response: JourneyResponse) => {and: (questionKeyTuples: [any, unknown][]) => boolean, or: (questionKeyTuples: [any, unknown][]) => boolean}} */
const logicalCombinations = (response) => ({
	and: (questionKeyTuples) =>
		questionKeyTuples.every((questionKeyTuple) => questionHasAnswer(response, ...questionKeyTuple)),
	or: (questionKeyTuples) =>
		questionKeyTuples.some((questionKeyTuple) => questionHasAnswer(response, ...questionKeyTuple))
});

// TODO Make a type for all the question classes and use it here
/** @type {(response: JourneyResponse, question: any, expectedValue: unknown) => boolean} */
const questionHasAnswer = (response, question, expectedValue) => {
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
/** @type {(response: JourneyResponse, questionKeyTuples: [any, unknown][], options?: {logicalCombinator: 'and' | 'or'}) => boolean} */
const questionsHaveAnswers = (
	response,
	questionKeyTuples,
	{ logicalCombinator } = { logicalCombinator: 'and' }
) => {
	const combinators = logicalCombinations(response);

	return combinators[logicalCombinator](questionKeyTuples);
};

// TODO Make a type for all the question classes and use it here
/** @type {(response: JourneyResponse, question: any) => boolean} */
const questionHasNonEmptyStringAnswer = (response, question) => {
	if (!response.answers) return false;
	const answerField = response.answers[question.fieldName];
	return typeof answerField === 'string' && answerField.trim().length > 0;
};

// TODO Make a type for all the question classes and use it here
/** @type {(response: JourneyResponse, question: any) => boolean} */
const questionHasNonEmptyNumberAnswer = (response, question) => {
	if (!response.answers) return false;
	const answerField = response.answers[question.fieldName];
	return typeof answerField === 'number' && !isNaN(answerField);
};

module.exports = {
	questionHasAnswer,
	questionsHaveAnswers,
	questionHasNonEmptyStringAnswer,
	questionHasNonEmptyNumberAnswer
};
