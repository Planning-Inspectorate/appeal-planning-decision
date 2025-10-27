const { validationResult } = require('express-validator');
const {
	expressValidationErrorsToGovUkErrorList
} = require('../lib/express-validation-errors-to-govuk-error-list');

/**
 * @typedef {Object} FieldError
 * @property {string} msg - The error message
 * @property {string} path - The field name (param)
 */

const validationErrorHandler = (req, res, next) => {
	let errors = validationResult(req);

	if (errors.isEmpty()) {
		return next();
	}

	// @ts-ignore JSDoc assertion that this is the type we expect
	const mappedErrors = /** @type {Record<string, FieldError>} */ (errors.mapped());
	// date-validator returns some empty error messages to avoid having an error for each field
	// there is probably a better way but we shouldn't block with an empty error anyway
	const filteredErrors = Object.entries(mappedErrors).filter(([_key, error]) => error.msg);
	if (filteredErrors.length === 0) return next();

	const mappedAndFilteredErrors = Object.fromEntries(filteredErrors);

	req.body.errors = mappedAndFilteredErrors;
	req.body.errorSummary = expressValidationErrorsToGovUkErrorList(mappedAndFilteredErrors);

	return next();
};

module.exports = {
	validationErrorHandler
};
