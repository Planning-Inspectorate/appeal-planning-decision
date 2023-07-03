const { get, post } = require('../router-mock');
const {
	getEnterCodeLPA,
	postEnterCodeLPA
} = require('../../../../src/controllers/common/enter-code');
const { rules: ruleEnterCode } = require('../../../../src/validators/common/enter-code');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');

jest.mock('../../../../src/validators/common/enter-code');
jest.mock('../../../../src/validators/validation-error-handler');
jest.mock('../../../../src/controllers/common/enter-code');

describe('routes/lpa/enter-code', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/lpa-dashboard/enter-code');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/enter-code/:id', validationErrorHandler, getEnterCodeLPA());
		expect(post).toHaveBeenCalledWith(
			'/enter-code/:id',
			ruleEnterCode(),
			validationErrorHandler,
			postEnterCodeLPA()
		);
	});
});
