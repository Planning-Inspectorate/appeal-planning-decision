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

/**
 * @param {JourneyResponse} journeyResponse
 * @param {string} fieldName
 */
exports.getLinkedCasesForQuestion = (journeyResponse, fieldName) => {
	const linkedCases = journeyResponse.answers?.SubmissionLinkedCase || [];

	return linkedCases.filter((linkedCase) => linkedCase.fieldName == fieldName);
};

/**
 * @param {JourneyResponse} journeyResponse
 * @param {string} fieldName
 */
exports.getListedBuildingForQuestion = (journeyResponse, fieldName) => {
	const listedBuildings = journeyResponse.answers?.SubmissionListedBuilding || [];

	return listedBuildings.filter((listedBuilding) => listedBuilding.fieldName == fieldName);
};

/** @type {(maybeDivider: import('../../question-props').Option) => maybeDivider is { divider: string }} */
exports.optionIsDivider = (maybeDivider) => Object.hasOwn(maybeDivider, 'divider');

/** @type {(conditional: unknown) => conditional is { html: string }} */
exports.conditionalIsJustHTML = (conditional) =>
	!!conditional && Object.hasOwn(conditional, 'html') && Object.keys(conditional).length === 1;
