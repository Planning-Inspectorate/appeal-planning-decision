const { get, post } = require('../../router-mock');
const {
	getEnterCode,
	postEnterCode
} = require('../../../../../src/controllers/full-appeal/submit-appeal/enter-code');
const {
	rules: ruleEnterCode
} = require('../../../../../src/validators/save-and-return/enter-code');
jest.mock('../../../../../src/validators/save-and-return/enter-code');
const {
	validationErrorHandler
} = require('../../../../../src/validators/validation-error-handler');
const fetchExistingAppealMiddleware = require('../../../../../src/middleware/fetch-existing-appeal');

describe('routes/full-appeal/submit-appeal/enter-code', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/full-appeal/submit-appeal/enter-code');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/submit-appeal/enter-code/:id',
			[fetchExistingAppealMiddleware],
			getEnterCode
		);
		expect(post).toHaveBeenCalledWith(
			'/submit-appeal/enter-code/',
			ruleEnterCode(),
			validationErrorHandler,
			postEnterCode
		);
	});
});
