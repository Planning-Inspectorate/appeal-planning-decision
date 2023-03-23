const { get, post } = require('../router-mock');

jest.mock('../../../../src/controllers/final-comment/enter-security-code');
jest.mock('../../../../src/validators/validation-error-handler');
jest.mock('../../../../src/validators/final-comment/email-code');

const {
	getEnterSecurityCode,
	postEnterSecurityCode
} = require('../../../../src/controllers/final-comment/enter-security-code');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');
const {
	rules: emailCodeValidationRules
} = require('../../../../src/validators/final-comment/email-code');

describe('routes/final-comment/enter-security-code', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/final-comment/enter-security-code');
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/input-code', getEnterSecurityCode);
		expect(post).toHaveBeenCalledWith(
			'/input-code',
			emailCodeValidationRules(),
			validationErrorHandler,
			postEnterSecurityCode
		);
		expect(emailCodeValidationRules).toHaveBeenCalled();
	});
});
