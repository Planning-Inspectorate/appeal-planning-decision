const { get, post } = require('../router-mock');
const applicationLookupController = require('../../../../src/controllers/before-you-start/application-lookup');
const applicationLookupFailedController = require('../../../../src/controllers/before-you-start/application-not-found');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
	rules: applicationLookupRules
} = require('../../../../src/validators/before-you-start/application-lookup');
const {
	rules: applicationNotFoundValidationRules
} = require('../../../../src/validators/before-you-start/application-not-found');

jest.mock('../../../../src/validators/before-you-start/application-lookup');
jest.mock('../../../../src/validators/before-you-start/application-not-found');

describe('routes/before-you-start/application-lookup', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/before-you-start/application-lookup');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/application-number',
			[fetchExistingAppealMiddleware],
			applicationLookupController.getApplicationLookup
		);
		expect(post).toHaveBeenCalledWith(
			'/application-number',
			applicationLookupRules(),
			validationErrorHandler,
			applicationLookupController.postApplicationLookup
		);

		expect(get).toHaveBeenCalledWith(
			'/application-not-found',
			[fetchExistingAppealMiddleware],
			applicationLookupFailedController.getApplicationFailedLookup
		);
		expect(post).toHaveBeenCalledWith(
			'/application-not-found',
			applicationNotFoundValidationRules(),
			validationErrorHandler,
			applicationLookupFailedController.postApplicationFailedLookup
		);
	});
});
