/**
 * @typedef {Array<{text: string, href: string}>} Result
 * @param {Record<String, {msg: string}>} expressValidationErrors
 * @returns {Result}
 */
const expressValidationErrorsToGovUkErrorList = (expressValidationErrors) => {
	/** @type {Result} */
	const mappedErrors = [];

	if (Object.keys(expressValidationErrors).length === 0) {
		return mappedErrors;
	}

	Object.keys(expressValidationErrors).forEach((key) => {
		mappedErrors.push({
			text: expressValidationErrors[key].msg,
			href: `#${key}`
		});
	});

	return mappedErrors;
};

module.exports = {
	expressValidationErrorsToGovUkErrorList
};
