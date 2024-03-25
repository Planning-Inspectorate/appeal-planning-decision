/**
 * @typedef {import('../../journey-response').JourneyResponse} JourneyResponse
 */

exports.getConditionalFieldName = (parentField, conditionalField) =>
	`${parentField}_${conditionalField}`;

exports.getConditionalAnswer = (answers, question, answer) => {
	const conditionalFieldName = question.options?.find((option) => option.value === answer)
		?.conditional?.fieldName;
	return conditionalFieldName
		? answers[this.getConditionalFieldName(question.fieldName, conditionalFieldName)]
		: null;
};

/**
 * @param {JourneyResponse} journeyResponse
 * @param {string} fieldName
 */

exports.getAddressesForQuestion = (journeyResponse, fieldName) => {
	const addresses = journeyResponse.answers?.SubmissionAddress || [];

	return addresses.filter((address) => address.fieldName == fieldName);
};
