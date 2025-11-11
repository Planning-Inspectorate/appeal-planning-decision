const { get, post } = require('../router-mock');
const enforcementEffectiveDateController = require('../../../../src/controllers/before-you-start/enforcement-effective-date');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const combineDateInputsMiddleware = require('../../../../src/middleware/combine-date-inputs');
const convertMonthNameToNumber = require('../../../../src/middleware/convert-month-name-to-number');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
	rules: enforcementIssueDateValidationRules
} = require('../../../../src/validators/before-you-start/enforcement-effective-date');

jest.mock('../../../../src/validators/before-you-start/enforcement-effective-date');

describe('routes/full-appeal/enforcement-effective-date', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/before-you-start/enforcement-effective-date');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/enforcement-effective-date',
			[fetchExistingAppealMiddleware],
			enforcementEffectiveDateController.getEnforcementEffectiveDate
		);
		expect(post).toHaveBeenCalledWith(
			'/enforcement-effective-date',
			[fetchExistingAppealMiddleware, convertMonthNameToNumber, combineDateInputsMiddleware],
			enforcementIssueDateValidationRules(),
			validationErrorHandler,
			enforcementEffectiveDateController.postEnforcementEffectiveDate
		);
	});
});
