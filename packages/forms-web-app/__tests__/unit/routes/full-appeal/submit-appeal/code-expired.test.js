const { get, post } = require('../../router-mock');
const {
	getcodeExpired,
	postcodeExpired
} = require('../../../../../src/controllers/full-appeal/submit-appeal/code-expired');
describe('routes/full-appeal/submit-appeal/code-expired', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/full-appeal/submit-appeal/code-expired');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith('/submit-appeal/code-expired/', getcodeExpired);
		expect(post).toHaveBeenCalledWith('/submit-appeal/code-expired/', postcodeExpired);
	});
});
