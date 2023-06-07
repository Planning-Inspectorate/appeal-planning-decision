const { get, post } = require('../router-mock');

jest.mock('../../../../src/controllers/final-comment/input-code');
jest.mock('../../../../src/validators/validation-error-handler');
jest.mock('../../../../src/validators/final-comment/email-code');
jest.mock('../../../../src/middleware/final-comment/check-final-comment-test-enabled');

const {
	getInputCode,
	postInputCode
} = require('../../../../src/controllers/final-comment/input-code');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
	rules: emailCodeValidationRules
} = require('../../../../src/validators/final-comment/email-code');
const checkFinalCommentTestEnabled = require('../../../../src/middleware/final-comment/check-final-comment-test-enabled');

describe('routes/final-comment/input-code', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/final-comment/input-code');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/input-code/:caseReference',
			checkFinalCommentTestEnabled,
			getInputCode
		);
		expect(post).toHaveBeenCalledWith(
			'/input-code/:caseReference',
			emailCodeValidationRules(),
			validationErrorHandler,
			postInputCode
		);
		expect(emailCodeValidationRules).toHaveBeenCalled();
	});
});
