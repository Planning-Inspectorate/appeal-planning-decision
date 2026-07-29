const { get, post } = require('../../router-mock');

const { getEnterCode, postEnterCode } = require('../../../../../src/controllers/common/enter-code');

const { rules: ruleEnterCode } = require('../../../../../src/validators/common/enter-code');

const {
	validationErrorHandler
} = require('../../../../../src/validators/validation-error-handler');

jest.mock('../../../../../src/validators/common/enter-code');
jest.mock('../../../../../src/validators/validation-error-handler');
jest.mock('../../../../../src/controllers/common/enter-code');

describe('routes/full-appeal/submit-appeal/enter-code', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/full-appeal/login/enter-code');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenNthCalledWith(
			1,
			'/submit-appeal/enter-code/:enterCodeId',
			expect.any(Function)
		);
		expect(get).toHaveBeenNthCalledWith(
			2,
			'/submit-appeal/enter-code',
			validationErrorHandler,
			getEnterCode(expect.any(Object))
		);

		expect(post).toHaveBeenCalledWith(
			'/submit-appeal/enter-code',
			ruleEnterCode(),
			validationErrorHandler,
			postEnterCode()
		);
	});
});
