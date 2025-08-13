const { get, post } = require('../../router-mock');
const decisionDateHouseholderController = require('../../../../../src/controllers/householder-planning/eligibility/decision-date-householder');
const {
	validationErrorHandler
} = require('../../../../../src/validators/validation-error-handler');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');
const {
	rules: decisionDateHouseholderValidationRules
} = require('../../../../../src/validators/householder-planning/eligibility/decision-date-householder');
const convertMonthNameToNumber = require('../../../../../src/middleware/convert-month-name-to-number');

jest.mock(
	'../../../../../src/validators/householder-planning/eligibility/decision-date-householder'
);

describe('routes/householder-planning/eligibility/decision-date-householder', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/householder-planning/eligibility/decision-date-householder');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/decision-date-householder',
			[fetchExistingAppealMiddleware],
			decisionDateHouseholderController.getDecisionDateHouseholder
		);

		expect(post).toHaveBeenCalledWith(
			'/decision-date-householder',
			convertMonthNameToNumber,
			decisionDateHouseholderValidationRules(),
			validationErrorHandler,
			decisionDateHouseholderController.postDecisionDateHouseholder
		);
	});
});
