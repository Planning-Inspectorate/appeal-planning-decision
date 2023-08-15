const { get, post } = require('../../router-mock');

const { getEnterCode, postEnterCode } = require('../../../../../src/controllers/common/enter-code');

const { rules: ruleEnterCode } = require('../../../../../src/validators/common/enter-code');

const {
	rules: idValidationRules
} = require('../../../../../src/validators/common/check-id-is-uuid');

const {
	validationErrorHandler
} = require('../../../../../src/validators/validation-error-handler');

jest.mock('../../../../../src/validators/common/check-id-is-uuid');
jest.mock('../../../../../src/validators/common/enter-code');
jest.mock('../../../../../src/validators/validation-error-handler');
jest.mock('../../../../../src/controllers/common/enter-code');

describe('routes/full-appeal/submit-appeal/enter-code', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/full-appeal/submit-appeal/enter-code');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/submit-appeal/enter-code', getEnterCode());
		expect(get).toHaveBeenCalledWith(
			'/submit-appeal/enter-code/:id',
			idValidationRules(),
			validationErrorHandler,
			getEnterCode()
		);
		expect(post).toHaveBeenCalledWith(
			'/submit-appeal/enter-code/:id',
			ruleEnterCode(),
			validationErrorHandler,
			postEnterCode()
		);
	});
});
