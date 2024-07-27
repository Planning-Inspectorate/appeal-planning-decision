const logicalCombinations = (questionHasAnswer) => ({
	and: (questionKeyTuples) =>
		questionKeyTuples.every((questionKeyTuple) => questionHasAnswer(...questionKeyTuple)),
	or: (questionKeyTuples) =>
		questionKeyTuples.some((questionKeyTuple) => questionHasAnswer(...questionKeyTuple))
});

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
