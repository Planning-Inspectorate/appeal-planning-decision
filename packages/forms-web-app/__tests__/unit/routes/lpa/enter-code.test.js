const { get, post } = require('../router-mock');
const {
	getEnterCodeLPA,
	postEnterCodeLPA
} = require('../../../../src/controllers/common/enter-code');
const { rules: ruleEnterCode } = require('../../../../src/validators/lpa/enter-code');
const { rules: idValidationRules } = require('../../../../src/validators/common/check-id-is-uuid');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');

jest.mock('../../../../src/validators/lpa/enter-code');
jest.mock('../../../../src/validators/validation-error-handler');
jest.mock('../../../../src/controllers/common/enter-code');

describe('routes/appeal-householder-planning/enter-code', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/lpa/enter-code');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/enter-code/:id',
			idValidationRules,
			validationErrorHandler,
			getEnterCodeLPA()
		);
		expect(post).toHaveBeenCalledWith(
			'/enter-code/:id',
			ruleEnterCode(),
			validationErrorHandler,
			postEnterCodeLPA()
		);
	});
});
