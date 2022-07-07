const { get, post } = require('../../router-mock');
const requestNewCodeController = require('../../../../../src/controllers/full-appeal/submit-appeal/request-new-code');

jest.mock('../../../../../src/controllers/full-appeal/submit-appeal/request-new-code');

describe('routes/full-appeal/submit-appeal/request-new-code', () => {
	beforeEach(() => {
		// eslint-disable-next-line global-require
		require('../../../../../src/routes/full-appeal/submit-appeal/request-new-code');
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('should define the expected routes', () => {
		expect(get).toHaveBeenCalledWith(
			'/submit-appeal/request-new-code',
			requestNewCodeController.getRequestNewCode
		);
		expect(post).toHaveBeenCalledWith(
			'/submit-appeal/request-new-code',
			requestNewCodeController.postRequestNewCode
		);
	});
});
