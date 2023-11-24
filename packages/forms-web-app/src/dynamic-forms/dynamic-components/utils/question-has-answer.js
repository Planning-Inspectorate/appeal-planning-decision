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

module.exports = {
	questionHasAnswerBuilder,
	questionsHaveAnswersBuilder
};
