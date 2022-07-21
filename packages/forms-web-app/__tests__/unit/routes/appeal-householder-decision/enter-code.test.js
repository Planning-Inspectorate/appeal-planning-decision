const { get, post } = require('../router-mock');
const {
	getEnterCode,
	postEnterCode
} = require('../../../../src/controllers/appeal-householder-decision/enter-code');
const {
	rules: ruleEnterCode
} = require('../../../../src/validators/appeal-householder-decision/enter-code');
jest.mock('../../../../src/validators/full-appeal/enter-code');
const { validationErrorHandler } = require('../../../../src/validators/validation-error-handler');

describe('routes/appeal-householder-planning/enter-code', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../src/routes/appeal-householder-decision/enter-code');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/enter-code', getEnterCode);
		expect(post).toHaveBeenCalledWith(
			'/enter-code',
			ruleEnterCode(),
			validationErrorHandler,
			postEnterCode
		);
	});
});
