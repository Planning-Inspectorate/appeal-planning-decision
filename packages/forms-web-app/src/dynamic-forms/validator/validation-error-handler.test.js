const { validationErrorHandler } = require('./validation-error-handler');
const {
	expressValidationErrorsToGovUkErrorList
} = require('../../lib/express-validation-errors-to-govuk-error-list');
const { validationResult } = require('express-validator');

jest.mock('../../lib/express-validation-errors-to-govuk-error-list');
jest.mock('express-validator');

describe('./src/dynamic-forms/validator/validation-error-handler.js', () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it('should call next if no errors', async () => {
		const req = {
			params: {
				section: 1,
				question: 1
			},
			body: {
				field1: 'bananas'
			}
		};
		validationResult.mockReturnValue({
			isEmpty: () => {
				return true;
			}
		});

		const next = jest.fn();
		validationErrorHandler(req, {}, next);
		expect(next).toHaveBeenCalledTimes(1);
		expect(expressValidationErrorsToGovUkErrorList).not.toHaveBeenCalled();
	});

	it('should map errors if some are returned', async () => {
		const req = {
			params: {
				section: 1,
				question: 1
			},
			body: {
				field1: 'bananas'
			}
		};
		validationResult.mockReturnValue({
			isEmpty: () => {
				return false;
			},
			mapped: () => {
				return { test: 'hello' };
			}
		});

		const next = jest.fn();
		validationErrorHandler(req, {}, next);
		expect(expressValidationErrorsToGovUkErrorList).toHaveBeenCalledTimes(1);
		expect(next).toHaveBeenCalledTimes(1);
	});
});
