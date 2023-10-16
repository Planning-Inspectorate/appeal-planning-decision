exports.checkAnswerIncludes = (answer, value) => {
	const answerArray = Array.isArray(answer) ? answer : [answer];
	return answerArray.includes(value);
};
