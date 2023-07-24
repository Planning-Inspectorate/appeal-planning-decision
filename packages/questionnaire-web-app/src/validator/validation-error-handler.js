const { validationResult } = require('express-validator');
const {
	expressValidationErrorsToGovUkErrorList
} = require('../lib/express-validation-errors-to-govuk-error-list');

const validationErrorHandler = (req, res, next) => {
	const errors = validationResult(req);

	if (errors.isEmpty()) {
		return next();
	}

	const mappedErrors = errors.mapped();

	req.body.errors = mappedErrors;
	req.body.errorSummary = expressValidationErrorsToGovUkErrorList(mappedErrors);

	return next();
};

module.exports = {
	validationErrorHandler
};
