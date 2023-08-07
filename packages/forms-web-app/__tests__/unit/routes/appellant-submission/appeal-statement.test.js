const { get, post } = require('../router-mock');
const appealStatementController = require('../../../../src/controllers/appellant-submission/appeal-statement');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
	rules: appealStatementValidationRules
} = require('../../../../src/validators/common/appeal-statement');
const fetchExistingAppealMiddleware = require('../../../../src/middleware/fetch-existing-appeal');
const setSectionAndTaskNames = require('../../../../src/middleware/set-section-and-task-names');

jest.mock('../../../../src/validators/common/appeal-statement');
jest.mock('../../../../src/middleware/set-section-and-task-names');

describe('routes/appellant-submission/appeal-statement', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/appellant-submission/appeal-statement');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/appeal-statement',
			[fetchExistingAppealMiddleware],
			appealStatementController.getAppealStatement
		);
		expect(post).toHaveBeenCalledWith(
			'/appeal-statement',
			setSectionAndTaskNames(),
			appealStatementValidationRules(),
			validationErrorHandler,
			appealStatementController.postAppealStatement
		);
	});
});
