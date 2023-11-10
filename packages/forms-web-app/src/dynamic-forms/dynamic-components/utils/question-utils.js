exports.getConditionalFieldName = (parentField, conditionalField) =>
	`${parentField}_${conditionalField}`;

exports.getConditionalAnswer = (answers, question, answer) => {
	const conditionalFieldName = question.options?.find((option) => option.value === answer)
		?.conditional?.fieldName;
	return conditionalFieldName
		? answers[this.getConditionalFieldName(question.fieldName, conditionalFieldName)]
		: null;
};
