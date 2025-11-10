const { get, post } = require('../router-mock');
const enforcementIssueDateController = require('../../../../src/controllers/before-you-start/enforcement-issue-date');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
	rules: enforcementIssueDateValidationRules
} = require('../../../../src/validators/before-you-start/enforcement-issue-date');

jest.mock('../../../../src/validators/before-you-start/enforcement-issue-date');

describe('routes/full-appeal/enforcement-issue-date', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/before-you-start/enforcement-issue-date');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/enforcement-issue-date',
			[fetchExistingAppealMiddleware],
			enforcementIssueDateController.getEnforcementIssueDate
		);
		expect(post).toHaveBeenCalledWith(
			'/enforcement-issue-date',
			enforcementIssueDateValidationRules(),
			validationErrorHandler,
			enforcementIssueDateController.postEnforcementIssueDate
		);
	});
});
